import React, { useState, useEffect, useMemo } from 'react';
import { useContext } from 'react';
import ReactTable from '../../../../components/ReactTable/ReactTable.jsx';
import { config } from '../../../../../config.js';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import CustomSelect from '../../../../components/CustomSelect/CustomSelect.jsx';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './ToggleButton.css'
import './EditableCell.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './Comments.css'
import { FaStar } from 'react-icons/fa';
import { AiFillMessage } from "react-icons/ai";


function Comments() {
    const [storesCommentCount, setStoresCommentCount] = useState(0);
    const [selectedOption, setSelectedOption] = useState({ value: 'all', label: 'All' });
    const [storesCommentList, setStoresCommentList] = useState([]);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isClearBtnShown, setIsClearBtnShown] = useState(false)


    const { uid } = useParams()
    const handleDelete = (uid) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this Comment?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            const response = await fetch(`${config.backEndBaseUrl}api/store/comment/delete/${uid}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            });
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            getStoresComments(selectedOption.value);
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

    let navigate = useNavigate()

    const handleReply = (comment_id) => {
        navigate(`/admin/store/comments/reply/${comment_id}`)
    }

    const getStoresComments = async (status, dates) => {

        let params = '';
        if (status !== 'all') {
            params += `?status=${status}`;
        }
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/store/comments/${uid}${params}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            let storeList = result.data
            if (dates) {
                const { newStartDate, newEndDate } = dates;
                if (newStartDate && newEndDate) {
                    storeList = storeList.filter(item => {
                        const createdAt = new Date(item.created_at);
                        return createdAt >= newStartDate && createdAt <= newEndDate;
                    });
                }
            }
            // console.log(storeList)
            setStoresCommentList(storeList);
            setStoresCommentCount(storeList.length);

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
                const response = await fetch(`${config.backEndBaseUrl}api/store/comment/update/status/${uid}`, {
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


    const handleDateChange = (newStartDate, newEndDate) => {
        // console.log(newStartDate, newEndDate);
        let dates = {
            newStartDate: newStartDate,
            newEndDate: newEndDate
        };
        getStoresComments(selectedOption.value, dates);
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
        getStoresComments(selectedOption.value);
    }


    const columns = useMemo(
        () => [
            {
                accessorKey: 'user_name',
                header: 'User',
            },
            {
                accessorKey: 'rating',
                header: 'Rating',
                Cell: ({ cell }) => {
                    const rating = cell.row.original.rating;

                    return (
                        <div className="comment-rating">
                            {[...Array(5)].map((_, idx) => (
                                <FaStar
                                    key={idx}
                                    className={`star-icon ${idx < rating ? 'selected' : 'unselected'}`}
                                />
                            ))}
                        </div>
                    );
                }
            },
            {
                accessorKey: 'comment',
                header: 'Comment',
            },
            {
                accessorKey: 'reply',
                header: 'Reply',
            },
            {
                accessorKey: 'uid',
                header: 'Add Reply',
                Cell: ({ row, cell }) => {
                    return (
                        <>
                            <div
                                className='actionBtn btn btn-lg btn-success text-light m-2'
                                onClick={() => handleReply(cell.row.original.uid)}>
                                <AiFillMessage />
                            </div>
                        </>
                    );
                },
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
                            initialStatus={cell.getValue() === 1 ? 1 : 0}
                            onUpdate={() => { getStoresComments(selectedOption.value) }} // Refresh data after status update
                        />
                    );
                },
            },
            // {
            //     accessorKey: 'uid',
            //     header: 'Action',
            //     Cell: ({ row, cell }) => {
            //         return (
            //             <>
            //                 <div
            //                     className='actionBtn btn btn-lg btn-danger m-2'
            //                     onClick={() => handleDelete(cell.row.original.uid, row.original.position, row.original.posId)}>
            //                     <FaRegTrashAlt />
            //                 </div>
            //             </>
            //         );
            //     },
            // }
        ],
        [selectedOption.value, storesCommentList]
    );

    useEffect(() => {
        getStoresComments(selectedOption.value);
    }, [selectedOption.value, uid]);


    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        getStoresComments(selectedOption.value)
    };

    return (
        <>

            <ToastContainer />
            <div className="wg-box wg-box-container">

                <div className="section-content-right">

                    <div className="flex items-center flex-wrap gap20 mb-27">
                        <h3>
                            <span style={{ marginRight: 40 }}>Comments Count : <b>{storesCommentCount}</b></span>
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
                            {/* <Link to="/admin/store/add">
														<button className='btn btn-lg btn-success' style={{ width: 'fit-content', padding: '10px 15px', fontSize: '14px' }}>
															Add Stores
														</button>
													</Link> */}
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
                    <ReactTable columns={columns} data={storesCommentList} />
                </div>
            </div>


        </>
    )
}

export default Comments