import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import NotiCard from './NotiCard/NotiCard.jsx';
import chat from '../../components/Assets/Images/Chat.png';
import './Notifications.css';
import './mediaQuery.css';
import SectionMenuLeft from '../../components/SectionMenuLeft/SectionMenuLeft';
import { AdminSidebarContext } from '../../../context/adminSidebarContext';
import { config } from '../../../config'; // Assuming the config contains the base API URL

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isSidebar } = useContext(AdminSidebarContext);
    let vendor = JSON.parse(localStorage.getItem('vendor'))
    let vendor_id = vendor.uid
    // Fetch notifications from the API
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch(`${config.backEndBaseUrl}api/user/notifications/${vendor_id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                if (result.status) {
                    setNotifications(result.data);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

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
                                            <h3>Push Notification</h3>
                                        </div>
                                        <div className="notifications">
                                            {loading ? (
                                                <div>Loading...</div>
                                            ) : notifications.length > 0 ? (
                                                <div className="notification-body">
                                                    {notifications.map((item) => (
                                                        <NotiCard 
                                                            image={`${config.backEndBaseUrl}${item.img_path}`} 
                                                            title={item.title} 
                                                            time={item.created_at} 
                                                            details={item.message} 
                                                            url={item.url}
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="no-Notification">
                                                    <img src={chat} alt="No Notifications" />
                                                    <h4>No Notifications</h4>
                                                    <p>We’ll let you know when there will be something to update you.</p>
                                                </div>
                                            )}
                                        </div>
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

export default Notifications;
