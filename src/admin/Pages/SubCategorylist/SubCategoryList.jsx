import React, { useState, useEffect, useMemo } from 'react';
import SectionMenuLeft from '../../components/SectionMenuLeft/SectionMenuLeft';
import ReactTable from '../../components/ReactTable/ReactTable.jsx';
import { AdminSidebarContext } from '../../../context/adminSidebarContext';
import { useContext } from 'react';
import { config } from '../../../config';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import CustomSelect from '../../components/CustomSelect/CustomSelect.jsx';
import { CategoryRoundIcon, DynamicFaIcon } from '../../components/CategoryIcon/CategoryIcon';
import { FaEdit, FaRegTrashAlt, FaEye } from "react-icons/fa";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import './ToggleButton.css'
import './EditableCell.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
function SubCategoryList() {
	const { isSidebar } = useContext(AdminSidebarContext);
	const [subCategoryCount, setSubCategoryCount] = useState(0);
	const { uid } = useParams();
	const [selectedOption, setSelectedOption] = useState({ value: 'all', label: 'All' });
	const [categoryList, setCategoryList] = useState([]);
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [isClearBtnShown, setIsClearBtnShown] = useState(false)
	const [parentName, setParentName] = useState('All')

	const handleDelete = (uid) => {
		confirmAlert({
			title: 'Confirm to delete',
			message: 'Are you sure you want to delete this category?',
			buttons: [
				{
					label: 'Yes',
					onClick: async () => {
						try {
							const response = await fetch(`${config.backEndBaseUrl}api/category/delete/${uid}`, {
								method: 'DELETE',
								headers: {
									'Content-Type': 'application/json',
								},
							});
							if (!response.ok) {
								throw new Error('Network response was not ok');
							}
							getCategories(selectedOption.value);
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



	const options = useMemo(() => [
		{ value: 'all', label: 'All' },
		{ value: 1, label: 'Active' },
		{ value: 0, label: 'Deactive' },
	], []);

	const getCategories = async (status, dates) => {
		let params = '';
		if (status !== 'all') {
			params = `?status=${status}`;
		}
		try {
			const response = await fetch(uid ? `${config.backEndBaseUrl}api/category/sub-category/${uid}${params}` : `${config.backEndBaseUrl}api/category/childrens${params}`, {
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'GET',
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			let categoryList = result.data;
			// Filter based on dates
			if (dates) {
				const { newStartDate, newEndDate } = dates;
				if (newStartDate && newEndDate) {
					categoryList = categoryList.filter(item => {
						const createdAt = new Date(item.created_at);
						return createdAt >= newStartDate && createdAt <= newEndDate;
					});
				}
			}
			if (categoryList[0]) {
				setParentName(uid ? categoryList[0].parent_name : 'All')
			}
			// console.log(categoryList);
			setCategoryList(categoryList)
			setSubCategoryCount(categoryList.length);

		} catch (error) {
			console.error('Fetching categories failed', error);
		}
	};

	const ToggleButton = ({ uid, initialStatus, onUpdate }) => {
		const [status, setStatus] = useState(initialStatus);

		const handleToggleChange = async () => {
			const newStatus = !status;
			try {
				const response = await fetch(`${config.backEndBaseUrl}api/category/update/status/${uid}`, {
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
				if (onUpdate) {
					onUpdate();
				}
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

	const EditableCell = ({ id, initialValue, onSave, parent_id }) => {
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
			await onSave(id, value, parent_id);
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

	const handleSave = async (id, value, parent_id) => {
		if (!value) {
			toast.error('Please Select a value', {
				position: 'top-center',
			});
		} else {
			try {
				const response = await fetch(`${config.backEndBaseUrl}api/category/sub-category/update/rank/${id}`, {
					method: 'PUT',
					body: JSON.stringify({
						rank: value,
						parent_id: parent_id
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
					await getCategories(selectedOption.value);
				}
			} catch (error) {
				console.error('Updating category rank failed', error);
			}
		}
	};

	const columns = useMemo(
		() => [
			{
				accessorKey: 'position',
				header: 'Position',
				Cell: ({ row, cell }) => (
					uid
						?
						<EditableCell
							id={row.original.uid}
							initialValue={cell.getValue()}
							onSave={handleSave}
							parent_id={row.original.parent_id}
						/>
						:
						row.index + 1

				),
			},
			{
				accessorKey: 'icon', // Assuming 'icon' is a property in your data
				header: 'Icon / Image',
				Cell: ({ cell }) => {
					const { icon_type, icon_img_path } = cell.row.original;
					return icon_type === 'icon' ? (
						<DynamicFaIcon iconName={cell.getValue()} />
					) : (
						<CategoryRoundIcon imgPath={config.backEndBaseUrl + icon_img_path} />
					);
				},
			},
			{
				accessorKey: 'bg_image',
				header: 'Bg Image',
				Cell: ({ cell }) => {
					return cell.row.original.cover_img_path ? (
						<Link to={`${config.backEndBaseUrl}${cell.row.original.cover_img_path}`}>
							<img
								style={{ height: "100px", cursor: "pointer" }}
								src={`${config.backEndBaseUrl}${cell.row.original.cover_img_path}`}
								alt='' />
						</Link>
					) : 'Unset';
				},
			},
			{
				accessorKey: 'name', // Assuming 'icon' is a property in your data
				header: 'Sub Categories',
			},
			{
				accessorKey: 'parent_name',
				header: 'Category',
				Cell: ({ cell }) => (
					<Link to={`/admin/category/list/`} className='link' style={{ cursor: 'pointer' , "color": 'blue'}}>
						{cell.getValue()}
					</Link>
				)
			},
			{
				accessorKey: 'store',
				header: 'Stores',
				Cell: ({ cell }) => (
					<Link className='btn btn-lg btn-success' to={`/admin/store/list?cid=${cell.row.original.uid}`}>
                        View {cell.row.original.store_count}
                    </Link>
				),
			},
			{
				accessorKey: 'status',
				header: 'Hide/Unhide',
				Cell: ({ cell }) => {
					return (
						<ToggleButton
							uid={cell.row.original.uid}
							initialStatus={cell.getValue()}
							onUpdate={() => { getCategories(selectedOption.value) }} // Refresh data after status update
						/>
					);
				},
			},
			{
				accessorKey: 'meta_title',
				header: 'Meta Title',
			},
			{
				accessorKey: 'meta_description',
				header: 'Meta Description',
			},
			{
				accessorKey: 'new_tag_text',
				header: 'New Tag Text',
			},
			{
				accessorKey: 'created_by',
				header: 'Created By',
			},
			{
				accessorKey: 'created_at',
				header: 'Created On',
			},
			{
				accessorKey: 'uid',
				header: 'action',
				Cell: ({ cell }) => {
					return (
						<>
							<div
								className='actionBtn btn btn-lg btn-danger m-2'
								onClick={() => handleDelete(cell.row.original.uid)}>
								<FaRegTrashAlt />
							</div>
							<Link className='actionBtn btn btn-lg btn-dark text-light' to={`/admin/sub-category/update/${cell.row.original.uid}`}>
								<FaEdit />
							</Link>
						</>
					);
				},
			},
			{
                accessorKey: 'uid',
                header: 'analytics',
                Cell: ({ cell }) => (
                    <>
                        <Link className='actionBtn btn btn-lg btn-success' to={`/admin/leads/${cell.row.original.uid}`}>
                            <FaEye /> {cell.row.original.total_leads}
                        </Link>
                    </>
                ),
            },
		],
		[selectedOption.value, categoryList]
	);

	useEffect(() => {
		getCategories(selectedOption.value);
	}, [selectedOption.value, uid]);


	const handleChange = (selectedOption) => {
		setSelectedOption(selectedOption);
		getCategories(selectedOption.value);
	};

	const handleDateChange = (newStartDate, newEndDate) => {
		// console.log(newStartDate, newEndDate);
		let dates = {
			newStartDate: newStartDate,
			newEndDate: newEndDate
		};
		getCategories(selectedOption.value, dates);
		setIsClearBtnShown(true)
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
		setIsClearBtnShown(false)
		setStartDate(null)
		setEndDate(null)
		getCategories(selectedOption.value);
	}

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
													<span style={{ marginRight: 40 }}>{parentName} Sub-category Count : <b>{subCategoryCount}</b></span>
												</h3>
												<div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
													<Link to={`/admin/sub-category/add${uid ? '/' + uid : ''}`}>
														<button className='btn btn-lg btn-success' style={{ padding: '10px 15px', fontSize: '14px' }}>
															Add Sub Category
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
											<ReactTable columns={columns} data={categoryList} />
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

export default SubCategoryList