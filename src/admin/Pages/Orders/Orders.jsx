import React, { useEffect, useMemo, useState, useContext } from 'react';
import './Orders.css';
import ReactTable from '../../components/ReactTable/ReactTable.jsx';
import SectionMenuLeft from '../../components/SectionMenuLeft/SectionMenuLeft';
import { AdminSidebarContext } from '../../../context/adminSidebarContext';
import DatePicker from "react-datepicker"; // Import DatePicker component
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles
import { config } from '../../../config.js';

const Orders = () => {
	const { isSidebar } = useContext(AdminSidebarContext);
	const [orders, setOrders] = useState([]);
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [isLoading, setIsLoading] = useState(true); // Initialize loading state
	const [isClearBtnShown, setIsClearBtnShown] = useState(false)

	const fetchOrders = async () => {
		setIsLoading(true); // Set loading to true when fetching starts
		try {
			const response = await fetch(`${config.backEndBaseUrl}api/user/order/list`, {
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'GET',
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const result = await response.json();

			// Normalize start and end dates
			const normalizeDate = (date) => {
				const d = new Date(date);
				d.setHours(0, 0, 0, 0); // Start of the day for startDate
				return d;
			};

			const normalizeEndDate = (date) => {
				const d = new Date(date);
				d.setHours(23, 59, 59, 999); // End of the day for endDate
				return d;
			};

			// Filter orders based on selected date range
			let filteredOrders = result.data;

			if (startDate) {
				filteredOrders = filteredOrders.filter(order => {
					const orderDate = new Date(order.created_at);
					return orderDate >= normalizeDate(startDate);
				});
			}

			if (endDate) {
				filteredOrders = filteredOrders.filter(order => {
					const orderDate = new Date(order.created_at);
					return orderDate <= normalizeEndDate(endDate);
				});
			}

			// Sort orders by created_at in descending order
			const sortedOrders = filteredOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

			setOrders(sortedOrders);
		} catch (error) {
			console.error('Fetching orders failed', error);
		} finally {
			setIsLoading(false); // Set loading to false when fetching ends
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
		fetchOrders();
	}, []);

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
				accessorKey: 'store.name',
				header: 'Store Name',
			},
			{
				accessorKey: 'user.user_name',
				header: 'Customer Name',
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
				accessorKey: 'created_at',
				header: 'Created On',
				Cell: ({ cell }) => {
					const date = new Date(cell.getValue());
					const pad = (n) => n.toString().padStart(2, '0');

					let hours = date.getHours();
					const ampm = hours >= 12 ? 'PM' : 'AM';
					hours = hours % 12 || 12; // Convert to 12-hour format

					return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(hours)}:${pad(date.getMinutes())} ${ampm}`;
				}

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
						<option value="canceled">canceled</option>
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
				accessorKey: 'product',
				header: 'Total Price',
				Cell: ({ row }) => {
					const sellingPrice = row.original.product.selling_price;
					const qty = row.original.qty;
					const totalPrice = sellingPrice * qty;
					return `₹${parseInt(totalPrice).toFixed(2)}`;

				},
			},
		],
		[]
	);

	const handleDateChange = (newStartDate, newEndDate) => {
		// console.log(newStartDate, newEndDate);
		let dates = {
			newStartDate: newStartDate,
			newEndDate: newEndDate
		};
		fetchOrders();
		setIsClearBtnShown(true)
	};

	const handleStartDateChange = (date) => {
		setStartDate(date);
		fetchOrders(); // Re-fetch orders when start date changes
		setIsClearBtnShown(true); // Show clear button
	};

	const handleEndDateChange = (date) => {
		setEndDate(date);
		fetchOrders(); // Re-fetch orders when end date changes
		setIsClearBtnShown(true); // Show clear button
	};

	const hideClearBtn = () => {
		setIsClearBtnShown(false);
		setStartDate(null);
		setEndDate(null);
		fetchOrders(); // Fetch without date filters
	};

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
											<h3>Total Orders : {orders.length}</h3>
										</div>
										{
											isLoading ? (
												<div className="preloader">
													<div className="spinner"></div>
												</div>
											) : (
												<>
													<div className="date-filter">
														<div style={{
															display: 'flex',
															fontSize: '13px',
															alignItems: 'center',
															gap: '10px',
															zIndex: '10',
															outline: '1px solid lightgray',
															padding: '10px',
															borderRadius: '5px',
															flexWrap: 'wrap'
														}}>
															<DatePicker
																id="startDate"
																selected={startDate}
																onChange={handleStartDateChange}
																dateFormat="dd MMM yyyy"
																placeholderText="Start Date"
																autoComplete='off'
															/>
															<DatePicker
																id="endDate"
																selected={endDate}
																onChange={handleEndDateChange}
																dateFormat="dd MMM yyyy"
																placeholderText="End Date"
																autoComplete='off'
															/>
															{
																isClearBtnShown
																&&
																<button
																	className='btn btn-lg btn-dark'
																	style={{ width: 'fit-content', padding: '10px 15px', fontSize: '14px' }}
																	onClick={() => hideClearBtn()}>
																	Clear
																</button>
															}
														</div>
													</div>
													<ReactTable columns={columns} data={orders} />
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

export default Orders;