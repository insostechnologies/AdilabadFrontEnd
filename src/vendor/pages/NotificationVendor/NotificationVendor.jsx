import React, { useState, useEffect, useContext, useMemo } from 'react';
import SectionMenuLeft from '../../components/SectionMenuLeft/SectionMenuLeft';
import { AdminSidebarContext } from '../../../context/adminSidebarContext';
import { config } from '../../../config';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactTable from '../../components/ReactTable/ReactTable.jsx';
import './NotificationVendor.css';

function NotificationVendor() {
    const { isSidebar } = useContext(AdminSidebarContext);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isClearBtnShown, setIsClearBtnShown] = useState(false);
    const [notificationList, setNotificationList] = useState([]);
    const [storeId, setStoreId] = useState(null);
    const [isAddDisabled, setIsAddDisabled] = useState(false);

    const hideClearBtn = () => {
        setIsClearBtnShown(false);
        setStartDate(null);
        setEndDate(null);
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
        setIsClearBtnShown(true);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        setIsClearBtnShown(true);
    };

    let vendor = JSON.parse(localStorage.getItem('vendor'));
    let vendor_id = vendor?.uid;

    const fetchVendorStore = async (vendor_id) => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/vendor/store/${vendor_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.status) {
                let store_id = result.store_id;
                setStoreId(store_id);
                return store_id;
            }
        } catch (error) {
            console.error('Error fetching vendor store:', error);
        }
    };

    const getNotificationList = async (store_id) => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/promotions/vendor/notifications?store_id=${store_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (data.status) {
                const sortedNotifications = data.data.sort((a, b) => new Date(b.latest_created_at) - new Date(a.latest_created_at));
                setNotificationList(sortedNotifications);
                console.log('Notification list:', sortedNotifications);

                // Check if the last notification was sent less than 24 hours ago
                if (sortedNotifications.length > 0) {
                    const lastNotificationDate = new Date(sortedNotifications[0].latest_created_at);
                    const currentTime = new Date();
                    const timeDifference = currentTime - lastNotificationDate;
                    const hoursDifference = timeDifference / (1000 * 3600);

                    if (hoursDifference < 24) {
                        setIsAddDisabled(true);
                    }
                }
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.error('Error fetching notification list:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const store_id = await fetchVendorStore(vendor_id);
            if (store_id) {
                getNotificationList(store_id);
            }
        };
        fetchData();
    }, [vendor_id]);

    const filteredNotifications = useMemo(() => {
        let filtered = notificationList;

        if (startDate || endDate) {
            filtered = filtered.filter(notification => {
                const notificationDate = new Date(notification.latest_created_at);
                const withinDateRange = (!startDate || notificationDate >= startDate) && (!endDate || notificationDate <= endDate);
                return withinDateRange;
            });
        }

        // Sort by date in descending order (most recent first)
        return filtered.sort((a, b) => new Date(b.latest_created_at) - new Date(a.latest_created_at));
    }, [notificationList, startDate, endDate]);

    const columns = useMemo(
        () => [
            {
                header: 'Date',
                accessorKey: 'latest_created_at',
            },
            {
                header: 'Title',
                accessorKey: 'title',
            },
            {
                header: 'Message',
                accessorKey: 'message',
            },
            {
                header: 'Image',
                accessorKey: 'img_path',
                Cell: ({ row }) => (
                    <img
                        src={`${config.backEndBaseUrl}${row.original.img_path}`}
                        alt="Notification"
                        style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                    />
                ),
            },
            {
                header: 'URL',
                accessorKey: 'url',
                Cell: ({ row }) => <a href={row.original.url} target="_blank" rel="noopener noreferrer">{row.original.url}</a>,
            },
            {
                header: 'Sent To',
                accessorKey: 'count',
                Cell: ({ row }) => <span>{row.original.count} {row.original.count == 1 ? `user` : `users`}</span>,
            },

        ],
        []
    );


    return (
        <div className="body">
            <ToastContainer />
            <div id="wrapper">
                <div id="page">
                    <div className="layout-wrap">
                        <SectionMenuLeft />
                        <div className="section-content-right">
                            <div className="main-content" style={{ paddingLeft: isSidebar ? '280px' : '0px' }}>
                                <div className="main-content-inner">
                                    <div className="main-content-wrap">
                                        <div className="flex items-center flex-wrap gap20 mb-27">
                                            <h3>
                                                <span style={{ marginRight: 40 }}>
                                                    All Notification Count: <b>{filteredNotifications.length}</b>
                                                </span>
                                            </h3>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
                                                <Link
                                                    to={isAddDisabled ? '#' : `/vendor/notification/add`}
                                                    onClick={(e) => {
                                                        if (isAddDisabled) {
                                                            e.preventDefault(); // Prevent navigation
                                                            toast.error('You can only send one notification per day. Please try again tomorrow.', {
                                                                position: 'top-center',
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <button
                                                        className="btn btn-lg btn-success"
                                                        style={{ padding: '10px 15px' }}
                                                        disabled={isAddDisabled}
                                                    >
                                                        Add Notification
                                                    </button>
                                                </Link>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    zIndex: '10',
                                                    outline: '1px solid lightgray',
                                                    padding: '10px',
                                                    borderRadius: '5px',
                                                }}>
                                                    <DatePicker
                                                        selected={startDate}
                                                        onChange={handleStartDateChange}
                                                        dateFormat="dd MMM yyyy"
                                                        placeholderText="Start Date"
                                                    />
                                                    <DatePicker
                                                        selected={endDate}
                                                        onChange={handleEndDateChange}
                                                        dateFormat="dd MMM yyyy"
                                                        placeholderText="End Date"
                                                    />
                                                    {isClearBtnShown && (
                                                        <button
                                                            className="btn btn-lg btn-dark"
                                                            onClick={hideClearBtn}
                                                        >
                                                            Clear
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {filteredNotifications && filteredNotifications.length > 0 ? (
                                            <ReactTable columns={columns} data={filteredNotifications} />
                                        ) : (
                                            <p>No notifications available.</p>
                                        )}
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

export default NotificationVendor;
