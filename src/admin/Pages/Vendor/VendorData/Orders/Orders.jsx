import React, { useEffect, useMemo, useState } from 'react';
import './Orders.css';
import ReactTable from '../../../../components/ReactTable/ReactTable.jsx';
import { config } from '../../../../../config.js';
import { useParams } from 'react-router-dom';
import { BsWhatsapp, BsTelephone } from "react-icons/bs";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState(''); // Track selected filter status
    const [isLoading, setIsLoading] = useState(true);
    const { uid } = useParams();

    const fetchOrders = async (storeId) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/order/list?s=${storeId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            setOrders(result.data);
            setFilteredOrders(result.data); // Initialize filteredOrders with all data
        } catch (error) {
            console.error('Fetching orders failed', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/order/update/status/${orderId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'PUT',
                body: JSON.stringify({ status: newStatus }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.uid === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            console.error('Updating order status failed', error);
        }
    };

    useEffect(() => {
        fetchOrders(uid);
    }, [uid]);

    useEffect(() => {
        if (filterStatus === '') {
            setFilteredOrders(orders); // Show all orders if no filter is applied
        } else {
            setFilteredOrders(orders.filter(order => order.status === filterStatus));
        }
    }, [filterStatus, orders]);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'uid',
                header: 'Order ID',
            },
            {
                accessorKey: 'created_at',
                header: 'Date',
                Cell: ({ cell }) => {
                    const dateValue = new Date(cell.getValue());
                    return new Intl.DateTimeFormat('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    }).format(dateValue);
                }
            },
            {
                accessorKey: 'product.name',
                header: 'Product Name',
            },
            {
                accessorKey: 'user.user_name',
                header: 'Customer Name',
            },
            {
                header: 'Contact',
                Cell: ({ cell, row }) => {
                    const phoneNumber = row.original.user.phone; // Assuming phone number is available in the cell
                    return (
                        <div>
                            {phoneNumber && (
                                <>
                                    <a href={`tel:${phoneNumber}`} className="actionBtn btn btn-lg btn-secondary" style={{ margin: '8px', padding: '10px' }}>
                                        <BsTelephone style={{ fontSize: '20px', fontWeight: '700' }} />
                                    </a>
                                    <a href={`https://wa.me/${phoneNumber}`} className="actionBtn btn btn-lg btn-success" style={{ margin: '8px', padding: '10px' }}>
                                        <BsWhatsapp style={{ fontSize: '20px', fontWeight: '700' }} />
                                    </a>
                                </>
                            )}
                        </div>
                    );
                }
            },
            {
                accessorKey: 'user.phone',
                header: 'Contact',
            },
            {
				accessorKey: 'user.address',
				header: 'Address',
				Cell: ({ cell }) => {
					let address = cell.getValue()
					return `${address?.landmark}, ${address?.area}, ${address?.city}`
				},
			},
            {
                accessorKey: 'status',
                header: 'Status',
                Cell: ({ row }) => (
                    <select
                        value={row.original.status}
                        onChange={(e) => updateOrderStatus(row.original.uid, e.target.value)}
                        className='border-success'
                    >
                        <option value="placed">Placed</option>
                        <option value="accepted">Accepted</option>
                        <option value="on the way">On The Way</option>
                        <option value="delivered">Delivered</option>
                        <option value="rejected">Rejected</option>
                        <option value="canceled">Canceled</option>
                    </select>
                ),
            },
            {
                accessorKey: 'qty',
                header: 'Quantity',
            },
            {
                accessorKey: 'product.selling_price',
                header: 'Selling Price',
                Cell: ({ cell }) => `₹${cell.getValue()}`,
            },
            {
				accessorKey: 'total_amount',
				header: 'Total Amount',
				Cell: ({ row }) => {
					const qty = row.original.qty;
					const price = row.original.product.selling_price;
					const total = qty * price;
					return `₹${total}`;
				}
			},
        ],
        []
    );

    return (
        <div className="wg-box wg-box-container">
            <div className="section-content-right">
                <div className="flex items-center flex-wrap justify-between gap20 mb-27">
                    <h3>Orders</h3>
                    {/* Filter Dropdown */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="filter-dropdown">
                        <option value="">All</option>
                        <option value="placed">Placed</option>
                        <option value="accepted">Accepted</option>
                        <option value="on the way">On The Way</option>
                        <option value="delivered">Delivered</option>
                        <option value="rejected">Rejected</option>
                        <option value="canceled">Canceled</option>
                    </select>
                </div>
                {isLoading ? (
                    <div className="preloader">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <ReactTable columns={columns} data={filteredOrders} />
                )}
            </div>
        </div>
    );
};

export default Orders;
