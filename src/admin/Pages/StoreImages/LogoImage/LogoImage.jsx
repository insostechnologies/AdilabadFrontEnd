import React, { useState, useEffect, useMemo } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import '../ToggleButton.css'
import '../EditableCell.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { config } from '../../../../config';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LogoImage.css'
import { FaRegTrashAlt } from "react-icons/fa";
import CustomSelect from '../../../components/CustomSelect/CustomSelect.jsx';
import ReactTable from '../../../components/ReactTable/ReactTable.jsx';
import { useParams } from 'react-router-dom';

function LogoImage({ category }) {
    const [logoCount, setLogoCount] = useState(0);
    const [selectedOption, setSelectedOption] = useState({ value: 'all', label: 'All' });
    const [logoList, setLogoList] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isClearBtnShown, setIsClearBtnShown] = useState(false)
    const { uid } = useParams();
    
    
    const [categoryName, setcategoryName] = useState('')
    useEffect(() => {
        if (category) {
            setcategoryName(category.name || '');
        }
    }, [category]);

    const handleDateChange = (newStartDate, newEndDate) => {
        // console.log(newStartDate, newEndDate);
        let dates = {
            newStartDate: newStartDate,
            newEndDate: newEndDate
        };
        getBanners(selectedOption.value, dates);
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
        getBanners(selectedOption.value);
    }

    const handleDelete = (uid) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this category?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            const response = await fetch(`${config.backEndBaseUrl}api/store/image/delete/${uid}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            });
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            getBanners(selectedOption.value); // Refresh data after delete
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

    const getBanners = async (status, dates) => {
        let params = '?type=logo';
        if (status !== 'all') {
            params += `&status=${status}`;
        }
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/store/images/${uid}${params}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            let covers = result.data

            if (dates) {
                const { newStartDate, newEndDate } = dates;
                if (newStartDate && newEndDate) {
                    covers = covers.filter(item => {
                        const createdAt = new Date(item.created_at);
                        return createdAt >= newStartDate && createdAt <= newEndDate;
                    });
                }
            }

            console.log(covers)
            setLogoList(covers);
            setLogoCount(covers.length);

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
                const response = await fetch(`${config.backEndBaseUrl}api/store/image/update/status/${uid}`, {
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
                const response = await fetch(`${config.backEndBaseUrl}api/banner/update/rank/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        rank: value,
                        page: page
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
                    await getBanners(selectedOption.value);
                }
            } catch (error) {
                console.error('Updating category rank failed', error);
            }
        }
    };

    const columns = useMemo(
        () => [
            // {
            //     accessorKey: 'position',
            //     header: 'Position',
            //     Cell: ({ row, cell }) => (
            //         <EditableCell
            //             id={row.original.uid}
            //             initialValue={cell.getValue()}
            //             onSave={handleSave}
            //             page={row.original.page}
            //         />
            //     ),
            // },
            {
                accessorKey: 'path',
                header: 'Image',
                Cell: ({ cell }) => {
                    return (
                        <Link to={`${config.backEndBaseUrl}${cell.row.original.path}`} >
                            <img alt=''
                                style={{ "height": "100px", "cursor": "pointer" }}
                                src={`${config.backEndBaseUrl}${cell.row.original.path}`}
                            />
                        </Link>
                    );
                },
            },
            // {
            //     accessorKey: 'cover_title',
            //     header: 'Title',
            // },
            // {
            //     accessorKey: 'type',
            //     header: 'Type',
            // },
            {
                accessorKey: 'created_by',
                header: 'Created By',
            },
            {
                accessorKey: 'created_at',
                header: 'Created On',
            },
            {
                accessorKey: 'status',
                header: 'Status',
                Cell: ({ cell }) => {
                    return (
                        <ToggleButton
                            uid={cell.row.original.uid}
                            initialStatus={cell.getValue() === 1}
                            onUpdate={() => { getBanners(selectedOption.value) }} // Refresh data after status update
                        />
                    );
                },
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
                            {/* <Link className='actionBtn btn btn-lg btn-dark text-light' to={`/admin/banner/update/${cell.row.original.uid}`}>
                                <FaEdit />
                            </Link> */}
                        </>
                    );
                },
            }
        ],
        [selectedOption.value, logoList]
    );

    useEffect(() => {
        getBanners(selectedOption.value);
    }, [selectedOption.value]);


    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption); // set selectedOption directly, no need for selectedOption.value
        getBanners(selectedOption.value)
    };



    return (
        <>
            <div className="main-content-wrap">
                <div className="flex items-center flex-wrap gap20 mb-27">
                    <h3>
                        <span style={{ marginRight: 40 }}><Link to={'/admin/store/list'} style={{color: 'blue', cursor: 'pointer'}}>{categoryName}</Link> Logo Image Count : <b>{logoCount}</b></span>
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
                        <Link to={`/admin/store/logo/add/${uid}`}>
                            <button className='btn btn-lg btn-success' style={{ width: 'fit-content', padding: '10px 15px', fontSize: '14px' }}>
                                Add Logo
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
                <ReactTable columns={columns} data={logoList} />
            </div>
        </>
    )
}

export default LogoImage