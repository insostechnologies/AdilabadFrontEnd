import React, { useEffect, useState } from 'react';
import './StoreViewCard.css';
import './mediaQuery.css';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaStar } from 'react-icons/fa6';
import verified from "../Assets/Images/verified.png";
import location from "../Assets/Images/location.png";
import { config } from '../../../config';
import { leadsAdd } from '../../../utils/apiCall'; // Import leadsAdd function

const StoreViewCard = ({ store, saved, categoryId }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [permissions, setPermissions] = useState(null);

    const fetchPermissions = async () => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/store/permissions?t=u`, {
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
                setPermissions(result.data);
            } else {
                throw new Error('Failed to fetch permissions');
            }
        } catch (error) {
            console.error('Error fetching permissions:', error);
            // toast.error('Failed to fetch permissions');
        }
    };

    useEffect(() => {
        fetchPermissions();
    }, []);

    const storeDetail = async (id) => {
        try {
            const result = await leadsAdd(user.uid, id, 'store'); // Assuming id is the store_id
            console.log('Lead added:', result);
        } catch (error) {
            console.error('Error adding lead:', error);
        }
        window.location.href = `/store/${id}`;
    };

    const handleCardClick = (e) => {
        e.stopPropagation(); // Prevent the click event from bubbling up
        storeDetail(store.uid);
    };

    const handleButtonClick = (e) => {
        localStorage.removeItem('cat_uid');
        localStorage.setItem('cat_uid', categoryId);
        e.stopPropagation(); // Prevent the click event from bubbling up
        storeDetail(store.uid);
    };

    let covers = store.images.cover || [];
    let comments = store.comments || [];
    const totalRatings = comments.reduce((sum, comment) => sum + comment.rating, 0);
    const averageRating = comments.length > 0 ? (totalRatings / comments.length).toFixed(1) : 0;
    const storeTime = store.time;

    const isOpenNow = (storeTime) => {
        const currentTime = new Date();
        const currentDay = currentTime.toLocaleString('en-US', { weekday: 'long' });
        const currentHours = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();
        const currentTotalMinutes = currentHours * 60 + currentMinutes;

        const todayHours = storeTime?.find(item => item.day === currentDay);

        if (todayHours) {
            const [fromHours, fromMinutes] = todayHours.from_time.split(':').map(Number);
            const [toHours, toMinutes] = todayHours.to_time.split(':').map(Number);
            const fromTotalMinutes = fromHours * 60 + fromMinutes;
            const toTotalMinutes = toHours * 60 + toMinutes;

            return currentTotalMinutes >= fromTotalMinutes && currentTotalMinutes < toTotalMinutes;
        }

        return false;
    };

    const formatTimeToAMPM = (timeStr) => {
        let [hours, minutes] = timeStr.split(':').map(Number);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? `0${minutes}` : minutes; // add leading zero if needed
        return `${hours}:${minutes} ${ampm}`;
    };

    // const getClosingTime = (storeTime) => {
    //     const currentTime = new Date();
    //     const currentDay = currentTime.toLocaleString('en-US', { weekday: 'long' });

    //     const todayHours = storeTime.find(item => item.day === currentDay);

    //     if (todayHours) {
    //         return formatTimeToAMPM(todayHours.to_time); // Return the closing time in AM/PM format
    //     }

    //     return null; // Store is closed or no hours found for today
    // };

    return (
        <div className="card-1" onClick={handleCardClick}>
            <div className="store-card">
                <div className="store-image">
                    <img
                        src={
                            covers.length > 0 ?
                                (covers[0].path && (permissions?.img_all == '1' || permissions?.img_cover == '1') ? config.backEndBaseUrl + covers[0].path : config.backEndBaseUrl + config.placeHolderImage)
                                : config.backEndBaseUrl + config.placeHolderImage
                        }
                        alt="Store"
                    />
                    {store.is_verified == '1' ? (
                        <div className="store-verified">
                            <img src={verified} alt="" className='icon-shield' />
                            <span>Verified</span>
                        </div>
                    ) : ''}
                </div>
                <div className="store-infos">
                    <h2 className="store-name">{store.name}</h2>
                    <p className="store-location">
                        <img src={location} alt="" className='icon-location' />
                        {store.address.area}, {store.address.city}
                    </p>
                    <div className="store-rating">
                        <div style={{ display: "flex", alignItems: "start", justifyContent: "center" }}>
                            <span className="rating-score">
                                {averageRating} <FaStar />
                            </span>
                            <span className="rating-comments-store">{comments.length} Comments</span>
                        </div>


                        <span className='open-close' style={{ backgroundColor: isOpenNow(storeTime) == 1 ? `green` : 'red' }}>
                            {isOpenNow(storeTime) == 1 ? `Open` : 'Closed'}
                        </span>

                    </div>
                    <div className="store-offers">

                        {store.offer && store.offer.discount && store.offer.title && permissions?.offers == '1' ? (
                            <span className="offer-discount">
                                ✅ {store.offer.title ? store.offer.title : ''} <span className="discount">{store.offer.discount ? store.offer.discount + ' % ' : ''}</span>
                            </span>
                        ) : null}
                        {store.product_count > 0 && (
                            <span className="offer-products">🛒 {store.product_count} Products Available</span>
                        )}
                    </div>
                    <button onClick={handleButtonClick} className="view-details-btn">
                        View Details
                    </button>
                </div>
            </div>
            <div className="card-details">
                <p className='bottom_dets' style={{ display: permissions?.total_views == '0' ? 'none' : '' }}><FaEye />{store.total_views} views</p>
                {permissions?.contact_social_details == '1' ? <p className='bottom_dets' style={{ display: permissions?.call_count == '0' ? 'none' : '' }}>{store.total_calls} calls</p> : null}
                {permissions?.contact_social_details == '1' ? <p className='bottom_dets' style={{ display: permissions?.chat_count == '0' ? 'none' : '' }}>{store.total_chats} chats</p> : null}
                <p className='bottom_dets' style={{ display: permissions?.orders == '0' ? 'none' : '' }}>{store.total_orders} orders</p>
                <p className='bottom_dets' style={{ display: permissions?.enquiry == '0' ? 'none' : '' }}>{store.total_enquiries} enquiry</p>
            </div>
        </div>
    );
}

export default StoreViewCard;