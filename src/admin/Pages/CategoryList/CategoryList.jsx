import React, { useState, useEffect, useContext, useMemo } from 'react';
import SectionMenuLeft from '../../components/SectionMenuLeft/SectionMenuLeft';
import { AdminSidebarContext } from '../../../context/adminSidebarContext';
import { config } from '../../../config';
import { Link } from 'react-router-dom';
import CustomSelect from '../../components/CustomSelect/CustomSelect.jsx';
import { CategoryRoundIcon, DynamicFaIcon } from '../../components/CategoryIcon/CategoryIcon';
import { FaEdit, FaRegTrashAlt, FaEye } from "react-icons/fa";
import ReactTable from '../../components/ReactTable/ReactTable.jsx';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import './ToggleButton.css'
import './EditableCell.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CategoryList.css"

function CategoryList() {
    const { isSidebar } = useContext(AdminSidebarContext);
    const [categoryCount, setCategoryCount] = useState(0);
    const [selectedOption, setSelectedOption] = useState({ value: 'all', label: 'All' });
    const [categoryList, setCategoryList] = useState([]);
    const [selectedOptionSubCat, setSelectedOptionSubCat] = useState({ value: 'all', label: 'All' });
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isClearBtnShown, setIsClearBtnShown] = useState(false)

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

    const getCategories = async (status, dates) => {
        let params = '';
        if (status !== 'all') {
            params = `?status=${status}`;
        };

        try {
            const response = await fetch(`${config.backEndBaseUrl}api/category/parents${params}`, {
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

            // Filter based on sub-categories condition
            if (selectedOptionSubCat.value == 1) {
                categoryList = categoryList.filter(item => item.sub_categories > 0);
            } else if (selectedOptionSubCat.value == 0) {
                categoryList = categoryList.filter(item => item.sub_categories == 0);
            }

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
            console.log(categoryList)
            setCategoryList(categoryList);
            setCategoryCount(categoryList.length);

        } catch (error) {
            console.error('Fetching categories failed', error);
        }
    };

    const EditableCell = ({ id, initialValue, onSave }) => {
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
            await onSave(id, value);
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
                            'Update'
                        )}
                    </button>
                )}
            </div>
        );
    };

    useEffect(() => {
        getCategories(selectedOption.value);
    }, [selectedOption.value, selectedOptionSubCat]);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'position',
                header: 'Position',
                Cell: ({ row, cell }) => (
                    <EditableCell
                        id={row.original.uid}
                        initialValue={cell.getValue()}
                        onSave={handleSave}
                    />
                ),
            },
            {
                accessorKey: 'icon',
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
                accessorKey: 'name',
                header: `Categories (${categoryList.length})`,
            },
            {
                accessorKey: 'sub_categories',
                header: `Sub-Categories (${categoryList.reduce((acc, category) => acc + (category.sub_categories || 0), 0)})`,
                Cell: ({ cell }) => (
                    <Link className='btn btn-lg btn-success' to={`/admin/sub-category/list/${cell.row.original.uid}`}>
                        View {cell.getValue()}
                    </Link>
                ),
            },
            {
                accessorKey: 'store',
                header: `Stores (${categoryList.reduce((sum, category) => sum + category.store_count, 0)})`,
                Cell: ({ cell }) => (
                    <Link className='btn btn-lg btn-success' to={`/admin/store/list?cid=${cell.row.original.uid}`}>
                        View {cell.row.original.store_count}
                    </Link>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Hide/Unhide',
                Cell: ({ cell }) => (
                    <ToggleButton
                        uid={cell.row.original.uid}
                        initialStatus={cell.getValue() === 1}
                        onUpdate={() => getCategories(selectedOption.value)}
                    />
                ),
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
                header: 'Action',
                Cell: ({ cell }) => (
                    <>
                        <div className='actionBtn btn btn-lg btn-danger m-2' onClick={() => handleDelete(cell.row.original.uid)}>
                            <FaRegTrashAlt />
                        </div>
                        <Link className='actionBtn btn btn-lg btn-dark text-light' to={`/admin/category/update/${cell.row.original.uid}`}>
                            <FaEdit />
                        </Link>
                    </>
                ),
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

    const options = useMemo(() => [
        { value: 'all', label: 'All' },
        { value: 1, label: 'Active' },
        { value: 0, label: 'Deactive' },
    ], []);

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        getCategories(selectedOption.value);
    };

    const optionSubCat = useMemo(() => [
        { value: 'all', label: 'All' },
        { value: 1, label: 'With sub-category' },
        { value: 0, label: 'Without sub-category' },
    ], []);

    const handleChangeOfSubCat = (selectedOptionSubCat) => {
        setSelectedOptionSubCat(selectedOptionSubCat);
        getCategories(selectedOption.value)
    };

    const handleSave = async (id, value) => {
        if (!value) {
            toast.error('Please Select a value', {
                position: 'top-center',
            });
        } else {
            try {
                const response = await fetch(`${config.backEndBaseUrl}api/category/update/rank/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify({ rank: value }),
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
                                                <span style={{ marginRight: 40 }}>All Category Count : <b>{categoryCount}</b></span>
                                            </h3>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
                                                <Link to="/admin/category/add">
                                                    <button className='btn btn-lg btn-success' style={{ width: 'fit-content', padding: '10px 15px', fontSize: '14px' }}>
                                                        Add Category
                                                    </button>
                                                </Link>
                                                <CustomSelect
                                                    options={options}
                                                    onChange={handleChange}
                                                    value={options.find(option => option.value === selectedOption.value)}
                                                />
                                                <CustomSelect
                                                    options={optionSubCat}
                                                    onChange={handleChangeOfSubCat}
                                                    value={optionSubCat.find(option => option.value === selectedOptionSubCat.value)}
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
    );
}

export default CategoryList;
