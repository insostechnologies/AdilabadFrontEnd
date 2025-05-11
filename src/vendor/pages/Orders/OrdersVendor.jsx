import React, { useEffect, useMemo, useState, useContext } from 'react';
import './Orders.css';
import ReactTable from '../../components/ReactTable/ReactTable.jsx';
import SectionMenuLeft from '../../components/SectionMenuLeft/SectionMenuLeft.jsx';
import { AdminSidebarContext } from '../../../context/adminSidebarContext.js';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { config } from '../../../config.js';
import { useParams } from 'react-router-dom';
import { BsWhatsapp, BsTelephone } from "react-icons/bs";

const OrdersVendor = () => {
	const { isSidebar } = useContext(AdminSidebarContext);
	const [orders, setOrders] = useState([]);
	const [filteredOrders, setFilteredOrders] = useState([]); // State for filtered orders
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedStatus, setSelectedStatus] = useState(''); // State for selected filter
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
			setFilteredOrders(result.data); // Initialize filtered orders
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

	// Filter orders by status
	useEffect(() => {
		if (selectedStatus) {
			setFilteredOrders(orders.filter(order => order.status === selectedStatus));
		} else {
			setFilteredOrders(orders);
		}
	}, [selectedStatus, orders]);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'uid',
				header: 'Order ID',
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
				accessorKey: 'user.phone',
				header: 'Contact Number',
			},
			{
				accessorKey: 'user.phone',
				header: 'Contact',
				Cell: ({ cell, row }) => {
					const phoneNumber = cell.getValue(); // Assuming phone number is available in the cell
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
			// {
			// 	accessorKey: 'user.address.city',
			// 	header: 'City',
			// },
			{
				accessorKey: 'user.address',
				header: 'Address',
				Cell: ({ cell }) => {
					let address = cell.getValue()
					return `${address?.landmark}, ${address?.area}, ${address?.city}`
				},
			},
			{
				accessorKey: 'created_at',
				header: 'Created On',
				Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
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
				Cell: ({ cell }) => `₹${parseInt(cell.getValue()).toFixed(2)}`,
			},
			{
				accessorKey: 'total_amount',
				header: 'Total Amount',
				Cell: ({ row }) => {
					const qty = row.original.qty;
					const price = row.original.product.selling_price;
					const total = qty * price;
					return `₹${parseInt(total).toFixed(2)}`;
				}
			},
		],
		[]
	);

	return (
		<>
			<div className="body">
				<div id="wrapper">
					<div id="page" className="">
						<div className="layout-wrap">
							<SectionMenuLeft />
							<div className="section-content-right">
								<div className="main-content" style={{ paddingLeft: isSidebar ? '280px' : '0px' }}>
									<div className="main-content-inner">
										<div className="flex items-center flex-wrap justify-between gap20 mb-27">
											<h3>Orders</h3>
											<div className='fil-con'>
												<select
													value={selectedStatus}
													onChange={(e) => setSelectedStatus(e.target.value)}
													className="date-input"
												>
													<option value="">All</option>
													<option value="placed">Placed</option>
													<option value="accepted">Accepted</option>
													<option value="on the way">On The Way</option>
													<option value="delivered">Delivered</option>
													<option value="rejected">Rejected</option>
													<option value="canceled">Canceled</option>
												</select>
												<div className="date-filter">
													<DatePicker
														selected={startDate}
														onChange={(date) => setStartDate(date)}
														placeholderText="From"
														dateFormat="MM/dd/yyyy"
														className="date-input"
													/>
													<DatePicker
														selected={endDate}
														onChange={(date) => setEndDate(date)}
														placeholderText="To"
														dateFormat="MM/dd/yyyy"
														className="date-input"
													/>
												</div>
											</div>
										</div>
										{
											isLoading ? (
												<div className="preloader">
													<div className="spinner"></div>
												</div>
											) : (
												<>

													<ReactTable columns={columns} data={filteredOrders} />
												</>
											)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default OrdersVendor;
