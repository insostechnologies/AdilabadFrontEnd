import React, { useEffect, useState } from 'react';
import MobileHeader from '../../components/MobileHeader/MobileHeader';
import chat from '../../components/Assets/Images/Chat.png';
import NotiCard from './NotiCard/NotiCard.jsx';
import './notification.css';
import './mediaQuery.css';
import { config } from '../../../config.js';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const user_id = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')).uid
        : '';

    // Utility: Calculate time since notification creation
    // Utility: Calculate time since notification creation
    const timeSince = (dateString) => {
        // Parse date string in "DD MMM YYYY hh:mm A" format
        const [day, month, year, time, meridian] = dateString.split(/[\s:]+/);
        const months = {
            Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
            Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
        };

        const hours = parseInt(time, 10) % 12 + (meridian === 'PM' ? 12 : 0); // Adjust for AM/PM
        const date = new Date(year, months[month], day, hours, time.split(':')[1]);

        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 },
            { label: 'second', seconds: 1 },
        ];

        for (const interval of intervals) {
            const count = Math.floor(seconds / interval.seconds);
            if (count > 0) {
                return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
            }
        }
        return 'just now';
    };


    // Fetch notifications from API
    const fetchNotificationsFromAPI = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/notifications/${user_id}`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch notifications: ${response.status}`);
            }

            const result = await response.json();
            if (result.status) {
                setNotifications(result.data);
            } else {
                setNotifications([]);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Remove notification and update state
    const removeNotification = async (uid) => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/notifications/delete/${uid}`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Failed to delete notification: ${response.status}`);
            }

            const result = await response.json();
            if (result.status) {
                setNotifications((prev) => prev.filter((notif) => notif.uid !== uid));
            }
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const removeVendorNotification = async (uid) => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/vendor/notifications/delete/${uid}`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Failed to delete notification: ${response.status}`);
            }

            const result = await response.json();
            if (result.status) {
                setNotifications((prev) => prev.filter((notif) => notif.uid !== uid));
            }
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    }

    useEffect(() => {
        fetchNotificationsFromAPI();
    }, []);

    return (
        <div>
            <MobileHeader title="Notifications" />
            {loading ? (
                <div className="loading">Loading...</div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : notifications.length > 0 ? (
                <div className="notification-body">
                    {notifications.map(({ uid, img_path, title, message, url, created_at, store_id }) => (
                        <NotiCard
                            key={uid}
                            image={img_path}
                            title={title}
                            message={message}
                            url={url}
                            time={timeSince(created_at)}
                            onRemove={() => store_id ? removeVendorNotification(uid) : removeNotification(uid)}
                        />
                    ))}
                </div>
            ) : (
                <div className="no-Notification">
                    <img src={chat} alt="No notifications" />
                    <h4>No Notifications</h4>
                    <p>We’ll let you know when there will be something to update you.</p>
                </div>
            )}
        </div>
    );
};

export default Notification;
