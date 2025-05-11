import React, { useMemo, useState, useEffect, useContext } from 'react';
import ReactTable from '../../components/ReactTable/ReactTable.jsx';
import SectionMenuLeft from '../../components/SectionMenuLeft/SectionMenuLeft.jsx';
import { AdminSidebarContext } from '../../../context/adminSidebarContext.js';
import { Link } from 'react-router-dom';
import { config } from '../../../config.js';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './Vendors.css';
import './ToggleButton.css';
import { FaRegTrashAlt } from "react-icons/fa";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


const Vendors = () => {
	const { isSidebar } = useContext(AdminSidebarContext);
	const [vendors, setVendors] = useState([]);
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [isClearBtnShown, setIsClearBtnShown] = useState(false);
	const [statusFilter, setStatusFilter] = useState('all');  // all, active, inactive
	const [timeFilter, setTimeFilter] = useState('all'); // all, last24

	const fetchVendors = async () => {
		try {
			let url = `${config.backEndBaseUrl}api/user?type=vendor&vendor_status=${statusFilter == "all" ? "" : statusFilter}`;


			const response = await fetch(url, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			});

			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

			let result = await response.json();
			let filteredVendors = result.data;

			if (startDate && endDate) {
				filteredVendors = filteredVendors.filter(vendor => {
					const createdAt = new Date(vendor.created_at);
					return createdAt >= startDate && createdAt <= endDate;
				});
			}
			// if (statusFilter !== 'all') {
			// 	filteredVendors = filteredVendors.filter(vendor => vendor.vendor_status == statusFilter);
			// }
			if (timeFilter === 'last24') {
				const last24Hours = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
				filteredVendors = filteredVendors.filter(vendor => new Date(vendor.created_at) >= last24Hours);
			}

			filteredVendors.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
			setVendors(filteredVendors);
		} catch (error) {
			console.error('Error fetching vendors:', error);
		}
	};

	useEffect(() => {
		fetchVendors();
	}, [startDate, endDate, statusFilter, timeFilter]);

	const handleStartDateChange = (date) => {
		setStartDate(date);
		setIsClearBtnShown(true);
	};

	const handleEndDateChange = (date) => {
		setEndDate(date);
		setIsClearBtnShown(true);
	};

	const hideClearBtn = () => {
		setIsClearBtnShown(false);
		setStartDate(null);
		setEndDate(null);
		fetchVendors();
	};

	const ToggleButton = ({ uid, initialStatus, onUpdate }) => {
		const [status, setStatus] = useState(initialStatus);

		const handleToggleChange = async () => {
			const newStatus = !status;
			try {
				const response = await fetch(`${config.backEndBaseUrl}api/user/vendor/status/${uid}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ status: newStatus ? 1 : 0 }),
				});
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				setStatus(newStatus);
				if (onUpdate) onUpdate();
			} catch (error) {
				console.error('Error updating status:', error);
			}
		};

		return (
			<div className="toggle-container" onClick={handleToggleChange}>
				<div className={`toggle-switch ${status ? 'active' : ''}`}>
					<div className="toggle-knob"></div>
				</div>
				<span className={`toggle-text ${status ? 'active' : ''}`}>{status ? 'active' : 'deactive'}</span>
			</div>
		);
	};

	const ToggleButtonVendor = ({ uid, initialStatus, onUpdate, type }) => {
		const [status, setStatus] = useState(initialStatus);

		const handleToggleChange = async () => {
			const newStatus = !status;
			try {
				const response = await fetch(`${config.backEndBaseUrl}api/user/vendor/access/${uid}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						status: newStatus ? 1 : 0,
						type: type
					}),
				});
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				setStatus(newStatus);
				if (onUpdate) onUpdate();
			} catch (error) {
				console.error('Error updating status:', error);
			}
		};

		return (
			<div className="toggle-container" onClick={handleToggleChange}>
				<div className={`toggle-switch ${status ? 'active' : ''}`}>
					<div className="toggle-knob"></div>
				</div>
				<span className={`toggle-text ${status ? 'active' : ''}`}>{status ? 'active' : 'deactive'}</span>
			</div>
		);
	};

	const handleDelete = (uid) => {
		confirmAlert({
			title: 'Confirm to delete',
			message: 'Are you sure you want to delete this category?',
			buttons: [
				{
					label: 'Yes',
					onClick: async () => {
						try {
							const response = await fetch(`${config.backEndBaseUrl}api/user/delete/${uid}?u=v`, {
								method: 'DELETE',
								headers: {
									'Content-Type': 'application/json',
								},
							});
							if (!response.ok) {
								throw new Error('Network response was not ok');
							}
							fetchVendors();
						} catch (error) {
							console.error('Error deleting category:', error);
						}
					}
				},
				{
					label: 'No',
					onClick: () => { }
				}
			]
		});
	};


	const columns = useMemo(
		() => [
			{
				accessorKey: 'user_name',
				header: 'Vendor',
			},
			{
				accessorKey: 'phone',
				header: 'Phone',
			},
			{
				accessorKey: 'created_at',
				header: 'Created on',
			},
			{
				accessorKey: 'vendor_status',
				header: 'status',
				Cell: ({ cell }) => (
					<ToggleButton
						uid={cell.row.original.uid}
						initialStatus={cell.getValue() === 'active'}
						onUpdate={() => fetchVendors()}
					/>
				),
			},
			{
				accessorKey: 'store_id',
				header: 'Store',
				Cell: ({ cell }) => (
					<Link className='btn btn-lg btn-success' to={`/admin/store/list?store_id=${cell.row.original.store_id}`}>
						View Store
					</Link>

				),
			},
			{
				accessorKey: 'uid',
				header: 'Data',
				Cell: ({ cell }) => (
					<Link className='btn btn-lg btn-success' to={`/admin/vendor/data/${cell.row.original.store_id}`}>
						View Data
					</Link>

				),
			},
			{
				accessorKey: 'send_notification',
				header: 'Send Notification',
				Cell: ({ cell }) => (
					<ToggleButtonVendor
						uid={cell.row.original.uid}
						initialStatus={cell.getValue() === '1'}
						onUpdate={() => fetchVendors()}
						type='send_notification'
					/>
				),
			},
			{
				accessorKey: 'reports',
				header: 'Analytical reports',
				Cell: ({ cell }) => (
					<ToggleButtonVendor
						uid={cell.row.original.uid}
						initialStatus={cell.getValue() === '1'}
						onUpdate={() => fetchVendors()}
						type='reports'

					/>
				),
			},
			{
				accessorKey: 'uid',
				header: 'Action',
				Cell: ({ row, cell }) => {
					return (
						<div className={`actionBtn-wrapper `} >
							<div
								className='actionBtn btn btn-lg btn-danger m-2'
								onClick={() => handleDelete(cell.row.original.uid)}
							>
								<FaRegTrashAlt />
							</div>
						</div>
					);
				},
			},
			{
				accessorKey: 'view_calls',
				header: 'Show Numbers',
				Cell: ({ cell }) => (
					<ToggleButtonVendor
						uid={cell.row.original.uid}
						initialStatus={cell.getValue() === '1'}
						onUpdate={() => fetchVendors()}
						type='view_calls'

					/>
				),
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
										<div className="items-center flex-wrap gap20 mb-27">
											<h3 className="mb-5">Vendors</h3>
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
												<div className='w-50 flex items-center gap10'>
													{/* Status Filter Dropdown */}
													<select
														className="form-select"
														value={statusFilter}
														onChange={(e) => setStatusFilter(e.target.value)}
														style={{ padding: '5px 10px', borderRadius: '5px' }}
													>
														<option value="all">All</option>
														<option value="active">Active</option>
														<option value="inactive">Inactive</option>
													</select>

													{/* Time Filter Dropdown */}
													<select
														className="form-select"
														value={timeFilter}
														onChange={(e) => setTimeFilter(e.target.value)}
														style={{ padding: '5px 10px', borderRadius: '5px' }}
													>
														<option value="all">Show All</option>
														<option value="last24">Last 24 Hours</option>
													</select>
												</div>

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
										<ReactTable columns={columns} data={vendors} />
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

export default Vendors;