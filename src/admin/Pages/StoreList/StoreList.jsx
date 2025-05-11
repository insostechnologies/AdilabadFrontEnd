import React, { useState, useEffect, useMemo, useContext } from 'react';
import SectionMenuLeft from '../../components/SectionMenuLeft/SectionMenuLeft';
import { AdminSidebarContext } from '../../../context/adminSidebarContext';
import ReactTable from '../../components/ReactTable/ReactTable.jsx';
import { config } from '../../../config';
import { Link, useSearchParams } from 'react-router-dom';
import CustomSelect from '../../components/CustomSelect/CustomSelect.jsx';
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './ToggleButton.css';
import './EditableCell.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './StoreList.css';
import { BsWhatsapp, BsTelephone } from "react-icons/bs";

function StoreList() {
	const { isSidebar } = useContext(AdminSidebarContext);
	const [storesCount, setStoresCount] = useState(0);
	const [selectedOption, setSelectedOption] = useState({ value: 'all', label: 'All' });
	const [storesList, setStoresList] = useState([]);
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [isClearBtnShown, setIsClearBtnShown] = useState(false);
	const [searchParams] = useSearchParams();
	const cid = searchParams.get('cid');
	const storeId = searchParams.get('store_id');
	const [categoryName, setCategoryName] = useState('All');

	const handleDelete = (uid, pos, posId) => {
		confirmAlert({
			title: 'Confirm to delete',
			message: 'Are you sure you want to delete this category?',
			buttons: [
				{
					label: 'Yes',
					onClick: async () => {
						try {
							const response = await fetch(`${config.backEndBaseUrl}api/store/delete/${uid}?c_id=${cid}&pos=${pos}&pos_id=${posId}`, {
								method: 'DELETE',
								headers: {
									'Content-Type': 'application/json',
								},
							});
							if (!response.ok) {
								throw new Error('Network response was not ok');
							}
							getStores(selectedOption.value);
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

	const getStores = async (status, dates, storeId) => {
		let params = '';
		if (status !== 'all') {
			params += `?status=${status}`;
		}
		if (cid) {
			params += params ? `&cid=${cid}` : `?cid=${cid}`;
		}

		try {
			const response = await fetch(`${config.backEndBaseUrl}api/store${params}`, {
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'GET',
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			let storeList = result.data;

			// Move store with matching storeId to the front
			if (storeId) {
				storeList = storeList.sort((a, b) => {
					if (a.uid === storeId) return -1;
					if (b.uid === storeId) return 1;
					return 0;
				});
			}

			if (dates) {
				const { newStartDate, newEndDate } = dates;
				if (newStartDate && newEndDate) {
					storeList = storeList.filter(item => {
						const createdAt = new Date(item.created_at);
						return createdAt >= newStartDate && createdAt <= newEndDate;
					});
				}
			}

			if (result.categoryData) {
				setCategoryName(result.categoryData.name);
			}

			setStoresList(storeList);
			setStoresCount(storeList.length);
		} catch (error) {
			console.error('Fetching banners failed', error);
		}
	};


	const options = useMemo(() => [
		{ value: 'all', label: 'All' },
		{ value: 1, label: 'Active' },
		{ value: 0, label: 'Deactive' },
	], []);

	const ToggleButton = ({ uid, initialStatus, onUpdate }) => {
		const [status, setStatus] = useState(initialStatus);

		const handleToggleChange = async () => {
			setStatus(!status);
			const newStatus = !status;
			try {
				const response = await fetch(`${config.backEndBaseUrl}api/store/update/status/${uid}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
				});
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				setStatus(newStatus);
				if (onUpdate) onUpdate(); // Notify parent component to refresh data
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

	const EditableCell = ({ id, initialValue, onSave, page }) => {
		const [value, setValue] = useState(initialValue);
		const [isChanged, setIsChanged] = useState(false);
		const [isLoading, setIsLoading] = useState(false);

		useEffect(() => {
			setIsChanged(value !== initialValue);
		}, [value, initialValue]);

		const handleInputChange = (e) => {
			setValue(e.target.value);
		};

		const handleSave = async () => {
			setIsLoading(true);
			await onSave(id, value, page);
			setIsLoading(false);
			setIsChanged(false);
		};

		return (
			<div className="editable-cell">
				<input
					className="editable-input"
					type="number"
					value={value}
					onChange={handleInputChange}
					disabled={isLoading}
				/>
				{isChanged && (
					<button
						className="editable-button"
						onClick={handleSave}
						disabled={isLoading}
					>
						{isLoading ? (
							<div className="spinner">
								{/* Spinner CSS here */}
							</div>
						) : (
							'Save'
						)}
					</button>
				)}
			</div>
		);
	};

	const handleSave = async (id, value, page) => {
		if (!value) {
			toast.error('Please Select a value', {
				position: 'top-center',
			});
		} else {
			try {
				const response = await fetch(`${config.backEndBaseUrl}api/store/update/rank/${id}`, {
					method: 'PUT',
					body: JSON.stringify({
						rank: value,
						category_id: cid
					}),
					headers: {
						'Content-Type': 'application/json',
					},
				});
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const result = await response.json();
				if (result.status) {
					toast.success('Position Updated', {
						position: 'top-center',
					});
					await getStores(selectedOption.value);
				}
			} catch (error) {
				console.error('Updating category rank failed', error);
			}
		}
	};

	const handleDateChange = (newStartDate, newEndDate) => {
		let dates = {
			newStartDate: newStartDate,
			newEndDate: newEndDate
		};
		getStores(selectedOption.value, dates);
		setIsClearBtnShown(true);
	};

	const handleStartDateChange = (date) => {
		setStartDate(date);
		handleDateChange(date, endDate);
	};

	const handleEndDateChange = (date) => {
		setEndDate(date);
		handleDateChange(startDate, date);
	};

	const hideClearBtn = () => {
		setIsClearBtnShown(false);
		setStartDate(null);
		setEndDate(null);
		getStores(selectedOption.value);
	};

	const columns = useMemo(
		() => [
			{
				accessorKey: 'position',
				header: 'position',
				Cell: ({ row, cell }) => (
					cid
						?
						<EditableCell
							id={row.original.posId}
							initialValue={cell.getValue()}
							onSave={handleSave}
							category_id={cid}
						/>
						:
						row.index + 1
				),
			},
			{
				accessorKey: 'name',
				header: 'Store Name',
				index: 4,
			},
			{
				accessorKey: 'uid',
				header: 'Analitycs',
				Cell: ({ row, cell }) => {
					return (
						<>
							<Link
								className="actionBtn btn btn-lg  btn-info text-light"
								key={row.original.uid}
								to={`/admin/store/analitycs/${row.original.uid}`}
								style={{ color: 'blue', cursor: 'pointer' }}>
								View
							</Link>

						</>
					);
				},
			},
			{
				accessorKey: 'owner_name',
				header: 'Owner name',
			},
			{
				accessorKey: 'details',
				header: 'Contact',
				Cell: ({ row }) => {
					const phoneDetail = row.original.details.find(detail => detail.type === 'phone');
					const whatsappDetail = row.original.details.find(detail => detail.type === 'whatsapp');
					const phoneNumber = phoneDetail ? phoneDetail.value : null;
					const whatsappNumber = whatsappDetail ? whatsappDetail.value : null;

					return (
						<div>
							{phoneNumber && (
								<a href={`tel:${phoneNumber}`} className="actionBtn btn btn-lg  btn-secondary" style={{ margin: '8px', padding: '10px' }}>
									<BsTelephone style={{ fontSize: '20px', fontWeight: '700', }} />
								</a>
							)}
							{whatsappNumber && (
								<a href={`https://wa.me/${whatsappNumber}`} className="actionBtn btn btn-lg btn-success" style={{ margin: '8px', padding: '10px' }}>
									<BsWhatsapp style={{ fontSize: '20px', fontWeight: '700', }} />
								</a>
							)}
							{!phoneNumber && !whatsappNumber && (
								<span>No Contact Info</span>
							)}
						</div>
					);
				}
			},
			{
				accessorKey: 'address',
				header: 'Address',
				Cell: ({ row }) => {
					const address = row.original.address;
					return (
						<span>
							{address.area}, {address.near_by}, {address.city}, {address.state} - {address.pincode}
						</span>
					);
				}
			},
			{
				accessorKey: 'categories',
				header: 'Categories',
				Cell: ({ row, cell }) => {
					const categories = row.original.categories && row.original.categories.length > 0
						?
						row.original.categories.filter(category => category.type === 'category')
						:
						[];
					return (
						<>
							{categories && categories.length > 0 ? categories.map((category, index) => (
								<Link
									key={category.uid}
									to={`/admin/sub-category/list/${category.uid}`}
									style={{ color: 'blue', cursor: 'pointer' }}>
									{category.name}
									{index < categories.length - 1 && <br />}
								</Link>
							)) : ''}
						</>
					);
				},
			},
			{
				accessorKey: 'uid',
				header: 'Sub Categories',
				Cell: ({ row, cell }) => {
					const subcategories = row.original.categories && row.original.categories.length > 0
						?
						row.original.categories.filter(category => category.type === 'subcategory')
						:
						[];
					return (
						<>
							{subcategories && subcategories.length > 0 ? subcategories.map((subcategory, index) => (
								<Link
									key={subcategory.uid}
									to={`/admin/sub-category/list/${subcategory.parent_id}`}
									style={{ color: 'blue', cursor: 'pointer' }}>
									{subcategory.name}
									{index < subcategories.length - 1 && <br />}
								</Link>
							)) : ''}
						</>
					);
				},
			},
			{
				accessorKey: 'uid',
				header: 'Store Products / Services',
				Cell: ({ cell }) => {
					return (
						<>
							<Link className='actionBtn btn btn-lg btn-success' to={`/admin/store/products/${cell.row.original.uid}`}>
								Products {cell.row.original.product_count}
							</Link>
						</>
					);
				}
			},
			{
				accessorKey: 'uid',
				header: 'Store Images',
				Cell: ({ cell }) => {
					return (
						<>
							<Link className='actionBtn btn btn-lg btn-success' to={`/admin/store/images/${cell.row.original.uid}`}>
								Images
							</Link>
						</>
					);
				}
			},
			{
				accessorKey: 'uid',
				header: 'Comments',
				Cell: ({ cell }) => {
					return (
						<>
							<Link className='actionBtn btn btn-lg btn-success' to={`/admin/store/comments/${cell.row.original.uid}`}>
								Comments
							</Link>
						</>
					);
				}
			},
			{
				accessorKey: 'created_at',
				header: 'Created On',
			},
			{
				accessorKey: 'status_updated_at',
				header: 'Last Active / Deactive on',
			},
			{
				accessorKey: 'status',
				header: 'Status',
				Cell: ({ cell }) => {
					return (
						<ToggleButton
							uid={cell.row.original.uid}
							initialStatus={cell.getValue() === 1 ? 1 : 0}
							onUpdate={() => { getStores(selectedOption.value) }}
						/>
					);
				},
			},
			{
				accessorKey: 'valid_till',
				header: 'Valid Till',
				Cell: ({ cell }) => {
					const validTillRaw = cell.row.original.valid_till;
					if (!validTillRaw || validTillRaw === '0000-00-00 00:00:00') {
						return 'Not set';
					}

					const validTillDate = new Date(validTillRaw);
					const currentDate = new Date();
					const differenceInTime = validTillDate.getTime() - currentDate.getTime();
					const remainingDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

					return (
						<>
							<span style={{ color: remainingDays > 0 ? '' : 'red' }}>
								{remainingDays > 0 ? `${validTillRaw}` : 'Expired'}
							</span>
							<br />
							{remainingDays > 0 && (
								<span style={{ color: 'green', fontWeight: '700' }}>
									({remainingDays} days left)
								</span>
							)}
						</>
					);
				}
			},
			{
				accessorKey: 'amount_paid',
				header: 'Amount Paid',
				Cell: ({ row, cell }) => {
					return (
						<>
							<span>{row.original.amount_paid}</span>
						</>
					);
				},
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated on',
			},
			{
				accessorKey: 'uid',
				header: 'Action',
				Cell: ({ row, cell }) => {
					const isHighlighted = row.original.uid === storeId; // Check if store_id matches uid
					return (
						<div
							className={`actionBtn-wrapper ${isHighlighted ? 'highlighted-row' : ''}`} // Add class based on condition
						>
							<div
								className='actionBtn btn btn-lg btn-danger m-2'
								onClick={() => handleDelete(cell.row.original.uid, row.original.position, row.original.posId)}
							>
								<FaRegTrashAlt />
							</div>
							<Link
								className='actionBtn btn btn-lg btn-dark text-light'
								to={`/admin/store/update/${cell.row.original.uid}`}
							>
								<FaEdit />
							</Link>
						</div>
					);
				},
			}
		],
		[selectedOption.value, storesList]
	);

	useEffect(() => {
		getStores(selectedOption.value);
	}, [selectedOption.value, cid]);

	const handleChange = (selectedOption) => {
		setSelectedOption(selectedOption);
		getStores(selectedOption.value);
	};

	return (
		<>
			<div className="body">
				<ToastContainer />
				<div id="wrapper">
					<div id="page" className="">
						<div className="layout-wrap">
							<SectionMenuLeft />
							<div className="section-content-right">
								<div className="main-content" style={{ paddingLeft: isSidebar ? '280px' : '0px' }}>
									<div className="main-content-inner">
										<div className="main-content-wrap">
											<div className="flex items-center flex-wrap gap20 mb-27">
												<h3>
													<span style={{ marginRight: 40 }}>{categoryName} Store Count : <b>{storesCount}</b></span>
												</h3>
												<div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
													<Link to="/admin/store/add">
														<button className='btn btn-lg btn-success' style={{ width: 'fit-content', padding: '10px 15px', fontSize: '14px' }}>
															Add Stores
														</button>
													</Link>
													<CustomSelect
														options={options}
														onChange={handleChange}
														value={options.find(option => option.value === selectedOption.value)}
													/>
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
											</div>
											<ReactTable columns={columns} data={storesList} />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default StoreList