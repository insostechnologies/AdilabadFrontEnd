import React, { useEffect, useState, useContext } from 'react';
import './Dashboard.css';
import { Link } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import sample_img from '../../components/Assets/Images/Home_banner.png';
import verified from '../../components/Assets/Images/verified.png';
import location from '../../components/Assets/Images/location.png';
import search_file from '../../components/Assets/Images/search-file.png';
import contact_card from '../../components/Assets/Images/contact-card.png';
import camera from '../../components/Assets/Images/camera.png';
import discount from '../../components/Assets/Images/discount.png';
import order from '../../components/Assets/Images/order.png';
import motorbike from '../../components/Assets/Images/motorbike.png';
import save from '../../components/Assets/Images/save.png';
import seo from '../../components/Assets/Images/seo.png';
import { FaWhatsapp, FaRegEye } from "react-icons/fa";
import { SlUserFollowing } from "react-icons/sl";
import { IoCallOutline } from "react-icons/io5";
import { FaBoxesPacking } from "react-icons/fa6";
import { AdminSidebarContext } from '../../../context/adminSidebarContext';
import { config } from '../../../config';
import SectionMenuLeft from '../../components/SectionMenuLeft/SectionMenuLeft';
import Loading from '../../../Loading/Loading'
import call_icon from '../../components/Assets/Images/phone.png';
import { IoShareSocialSharp } from "react-icons/io5";



import HomeBanner1 from '../../../frontend/pages/Home/HomeBanners/HomeBanner1/HomeBanner1';
import HomeBanner2 from "../../../frontend/pages/Home/HomeBanners/HomeBanner2/HomeBanner2";
import HomeBanner3Rectangle from "../../../frontend/pages/Home/HomeBanners/HomeBanner3Rectangle/HomeBanner3Rectangle";
import HomeBanner4 from "../../../frontend/pages/Home/HomeBanners/HomeBanner4/HomeBanner4";
import HomeBanner5 from "../../../frontend/pages/Home/HomeBanners/HomeBanner5/HomeBanner5";
import HomeBanner7 from "../../../frontend/pages/Home/HomeBanners/HomeBanner7/HomeBanner7";
import Spinner from 'react-bootstrap/Spinner';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { BsChevronRight } from "react-icons/bs";

function Dashboard() {
    const [startDate, setStartDate] = React.useState(new Date());

    const [startDatePick, setStartDatePick] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isClearBtnShown, setIsClearBtnShown] = useState(false)
    const [storeId, setStoreId] = useState('')
    const [store, setStore] = useState(null)
    const [allBannerList, setAllBannerList] = useState([]);
    const [heroBannerList, setHeroBannerList] = useState([]);
    const [loadingBanners, setLoadingBanners] = useState(true);

    const [storeName, setStoreName] = useState('');
    const [storeCreatedAt, setStoreCreatedAt] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [storeState, setStoreState] = useState('');
    const [storeCity, setStoreCity] = useState('');
    const [storeArea, setStoreArea] = useState('');
    const [storeNearBy, setStoreNearBy] = useState('');
    const [storePin, setStorePin] = useState('');
    const [storeShortDesc, setStoreShortDesc] = useState('');
    const [storeLongDesc, setStoreLongDesc] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [isVerified, SetIsVerified] = useState(0)
    const [validityDate, setValidityDate] = useState('')
    const [amountPaid, setAmountPaid] = useState(0)
    const [storeStatus, setStoreStatus] = useState(0)
    const [storeDetails, setStoreDetails] = useState([]);
    const [storeImages, setStoreImages] = useState(null);
    const [storeImagesLogo, setStoreImagesLogo] = useState(null);
    const [storeImagesGallery, setStoreImagesGallery] = useState(null);
    const [storeImagesBanner, setStoreImagesBanner] = useState(null);
    const [storeImagesCover, setStoreImagesCover] = useState(null);
    const [storeOffer, setStoreOffer] = useState(null)
    const [storeProducts, setStoreProducts] = useState(null)
    const [storeDelTitle, setStoreDelTitle] = useState('')
    const [storeDelCharge, setStoreDelCharge] = useState('')
    const [storeGstTitle, setStoreGstTitle] = useState('')
    const [storeGstCharge, setStoreGstCharge] = useState('')
    const [orderCount, setOrderCount] = useState(0)
    const [queriesCount, setQueriesCount] = useState(0)
    const [commentsCount, setCommentsCount] = useState(0)
    const [rating, setRating] = useState(0)
    const [totalViews, setTotalViews] = useState(0)
    const [followers, setFollowers] = useState(0)
    const [calls, setCalls] = useState(0)
    const [chats, setChats] = useState(0)
    const [products, setProducts] = useState(0)
    const [userVendor, setUserVendor] = useState(0)
    const [share, setShare] = useState(0)
    const [storeMeta, setStoreMeta] = useState('')
    const [storeReports, setStoreReports] = useState(0)
    const [storeNotification, setStoreNotification] = useState(0)
    const [isOpened, setIsOpened] = useState(false);
    const [storeTiming, setStoreTiming] = useState([
        { day: 'Sunday', fromTime: '', toTime: '', isEnabled: true },
        { day: 'Monday', fromTime: '', toTime: '', isEnabled: true },
        { day: 'Tuesday', fromTime: '', toTime: '', isEnabled: true },
        { day: 'Wednesday', fromTime: '', toTime: '', isEnabled: true },
        { day: 'Thursday', fromTime: '', toTime: '', isEnabled: true },
        { day: 'Friday', fromTime: '', toTime: '', isEnabled: true },
        { day: 'Saturday', fromTime: '', toTime: '', isEnabled: true },
    ]);
    const [loading, setLoading] = useState(true); // loading state
    const [socialDetails, setSocialDetails] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [notification, setNotification] = useState([])
    const [permissions, setPermissions] = useState(null);


    const handleModal = () => setShowModal(!showModal);
    const toggleShareModal = () => setShowShareModal(!showShareModal);

    const fetchSiteDetails = async () => {
        try {
            // Send the request
            const response = await fetch(`${config.backEndBaseUrl}api/user/site/details`, {
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
                setSocialDetails(result.data.socialDetails)
            } else {
                console.log('Internal server error');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false); // stop loading once data is fetched
        }
    };


    const getSocialLink = (type) => socialDetails.find(detail => detail.type === type)?.value;

    useEffect(() => {
        fetchSiteDetails();
    }, []);

    const handleLinkShare = (url) => {
        if (navigator.share) {
            // Use the Web Share API
            navigator.share({
                title: 'Check this out!',
                url: url,
            })
                .then(() => console.log('Successfully shared'))
                .catch((error) => console.error('Error sharing:', error));
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard
                .writeText(url)
                .then(() => {
                    toast.success('Link copied to clipboard!', {
                        position: 'top-center',
                    });
                })
                .catch((error) => {
                    console.error('Error copying link to clipboard:', error);
                    toast.error('Failed to copy the link.', {
                        position: 'top-center',
                    });
                });
        }
    };

    const updateDefaultArray = (defaultArray, dataArray) => {
        return defaultArray.map(item => {
            const matchedData = dataArray.find(data => data.day === item.day);

            if (matchedData) {
                return {
                    ...item,
                    fromTime: matchedData.from_time,
                    toTime: matchedData.to_time,
                    isEnabled: matchedData.status === 1,
                };
            }

            return item;
        });
    };

    const fetchOrders = async (storeId) => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/order/list?s=${storeId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            setOrderCount(result.data.length);
        } catch (error) {
            console.error('Fetching orders failed', error);
        }
    };

    const fetchQueries = async (storeId) => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/queries?s=${storeId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            setQueriesCount(result.data.length);
        } catch (error) {
            console.error('Fetching orders failed', error);
        }
    };

    const getStoresComments = async (storeId) => {

        try {
            const response = await fetch(`${config.backEndBaseUrl}api/store/comments/${storeId}?status=all`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            let comments = result.data

            setCommentsCount(comments.length);
            setRating(calculateAverageRating(comments))
        } catch (error) {
            console.error('Fetching banners failed', error);
        }
    };

    const calculateAverageRating = (comments) => {
        if (comments.length === 0) return 0; // Avoid division by zero
        const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
        const averageRating = totalRating / comments.length;
        return averageRating.toFixed(1);
    };

    const fetchPermissions = async () => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/store/permissions?t=v`, {
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
            toast.error('Failed to fetch permissions');
        }
    };

    const toggleBusinessStatus = async () => {
        setIsOpened(!isOpened);
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/store/update/time/status/${storeId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ is_opened: !isOpened ? 1 : 0 }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (!result.status) {
                throw new Error('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating business status:', error);
            // Optionally, revert the state change if the API call fails
            setIsOpened(isOpened);
        }
    };

    let vendor = JSON.parse(localStorage.getItem('vendor'))
    let vendor_id = vendor.uid

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
                let store_id = result.store_id
                setStoreId(store_id)
            }

        } catch (error) {
            console.error('Error fetching categories:', error);
            // Handle error state or display error message
        }
    }

    const fetchStore = async (uid) => {
        setIsLoading(true)
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/store/${uid}`, {
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
                let store = result.data
                setStore(store)
                setStoreName(store.name)
                setOwnerName(store.owner_name)
                setStoreShortDesc(store.short_desc)
                setStoreLongDesc(store.long_desc)
                SetIsVerified(store.is_verified)
                setAmountPaid(store.amount_paid)
                setStoreCreatedAt(store.created_at)
                setStoreDetails(store.details)
                setStoreImagesLogo(store.images.logo)
                setStoreImagesGallery(store.images.gallery)
                setStoreImagesBanner(store.images.banner)
                setStoreImagesCover(store.images.cover)
                setStoreOffer(store.offer)
                setStoreProducts(store.products)
                setStoreDelTitle(store.delivery_title)
                setStoreDelCharge(store.delivery_charge)
                setStoreGstTitle(store.gst_title)
                setStoreGstCharge(store.gst_charge)
                setTotalViews(store.total_views)
                setFollowers(store.following_count)
                setCalls(store.total_calls)
                setChats(store.total_chats)
                setStoreMeta(store.metaData)
                setProducts(store.products ? store.products.length : 0)
                setShare(store.total_share)
                setIsOpened(store.is_open == 1 ? true : false)
                setStoreStatus(store.status)

                const originalDate = store.valid_till;
                let formattedDate;
                if (originalDate === null) {
                    formattedDate = '0000-00-00'; // Preserve the original value
                } else {
                    const dateObject = new Date(originalDate);
                    const day = String(dateObject.getDate()).padStart(2, '0');
                    const month = dateObject.toLocaleString('default', { month: 'short' }); // Get abbreviated month name
                    const year = dateObject.getFullYear();
                    formattedDate = `${day} ${month} ${year}`;
                }
                setValidityDate(formattedDate);

                if (store.address) {
                    setStoreState(store.address.state)
                    setStoreCity(store.address.city)
                    setStoreArea(store.address.area)
                    setStoreNearBy(store.address.near_by)
                    setStorePin(store.address.pincode)
                }
                if (store.time) {
                    setStoreTiming(updateDefaultArray(storeTiming, store.time))
                }
            }

        } catch (error) {
            console.error('Error fetching categories:', error);
            // Handle error state or display error message
        } finally {
            setIsLoading(false)
        }
    };


    const fetchVendor = async (vendor_id) => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/${vendor_id}`, {
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
                setUserVendor(result.data)
                setStoreReports(result.data.reports)
                setStoreNotification(result.data.send_notification)
            }

        } catch (error) {
            console.error('Error fetching categories:', error);
            // Handle error state or display error message
        }
    }
    const fetchBanners = async () => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/banner?status=1`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            if (result.status) {
                let banners = result.data;
                banners = banners.filter(item => item.page === 'vendor');
                banners = banners.map(item => ({ ...item, title: '' }));

                setAllBannerList(banners);
                setHeroBannerList(banners.find(item => item.type === 'main banner')?.banners || []);
            }
        } catch (error) {
            console.error('Fetching banners failed', error);
        } finally {
            setLoadingBanners(false);
        }
    };

    useEffect(() => {
        fetchBanners()
        fetchNotificationsFromAPI()
        fetchPermissions()
    }, []);

    useEffect(() => {
        fetchVendorStore(vendor_id)
        fetchVendor(vendor_id)
    }, [vendor_id])

    useEffect(() => {
        if (storeId != '') {
            fetchOrders(storeId)
            fetchStore(storeId)
            fetchQueries(storeId)
            getStoresComments(storeId)
        }
    }, [storeId])

    const handleShare = async (siteTitle) => {

        if (navigator.share) {
            try {
                // Check if the device supports sharing files with the imageFile
                if (navigator.canShare) {
                    await navigator.share({
                        title: siteTitle,
                        text: 'Shop Now',
                        url: `${config.frontEndBaseUrl}store/${storeId}`,
                    });
                    console.log('Content shared successfully with image');
                } else {
                    alert('Your device does not support sharing files or images.');
                }
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            alert('Your device does not support the Web Share API.');
        }


    };


    // date filter section start
    const handleDateChange = (newStartDate, newEndDate) => {
        let dates = {
            newStartDate: newStartDate,
            newEndDate: newEndDate
        };
        setIsClearBtnShown(true)
    };

    const handleStartDateChange = (date) => {
        setStartDatePick(date);
        handleDateChange(date, endDate);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        handleDateChange(startDate, date);
    };

    const hideClearBtn = () => {
        setIsClearBtnShown(false)
        setStartDatePick(null)
        setEndDate(null)
    }
    // date filter section end

    const { isSidebar } = useContext(AdminSidebarContext);
    const [users, setUsers] = useState([]);

    function calculateDaysLeft(date) {
        const today = new Date();
        const targetDate = new Date(date);

        // Calculate the difference in milliseconds
        const differenceInTime = targetDate - today;

        // If the date has already passed, return 0 days left
        if (differenceInTime <= 0) {
            return 0; // Or you can return a specific message like "Expired"
        }

        // Calculate the difference in days
        const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

        return differenceInDays;
    }


    const fetchNotificationsFromAPI = async () => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/notifications/${vendor_id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.status) {
                setNotification(result.data);
            }
        } catch (error) {
            console.error('Fetching notifications failed', error);
        }
    };


    if (isLoading) {
        return (
            <Loading />
        )
    }

    return (
        <>
            <div className="body">
                <div id="wrapper">
                    <div id="page" className="">
                        <div className="layout-wrap">
                            <SectionMenuLeft />
                            <div className="section-content-right">
                                <div className="main-content" style={{ paddingLeft: isSidebar ? '280px' : '0px' }}>
                                    {/* <div className="main-content-inner"> */}
                                    <div className='homeCon'>
                                        <div className="app-container">
                                            {/* Title and Message Section */}
                                            {
                                                notification && notification.length > 0 ?
                                                    <div className="title-message-section">
                                                        <div className="noti-box">
                                                            <h6>Notification</h6>
                                                            {
                                                                notification.map((item) => (
                                                                    <div key={item.id} className="noti-cont" style={{ marginTop: '10px', marginBottom: '10px' }}>
                                                                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                                                                            <div className="noti-cont-inner">
                                                                                <img src={`${config.backEndBaseUrl}${item.img_path}`} alt="noti-img" />
                                                                                <div>
                                                                                    <div style={{ fontSize: '12px', marginBottom: '5px', fontWeight: '700' }}>
                                                                                        {item.title}
                                                                                        {/* {item.is_new === "1" && <span className="new-tag">New</span>} */}
                                                                                    </div>
                                                                                    <div style={{ fontSize: '10px', fontWeight: '400' }}>{item.message}</div>
                                                                                </div>
                                                                            </div>
                                                                        </a>
                                                                    </div>
                                                                ))
                                                            }
                                                            <Link to={`/vendor/notifications`} className="view-all">View More</Link>
                                                        </div>
                                                    </div>
                                                    : ''
                                            }



                                            {/* Image Banner Section */}
                                            {/* <div className="image-banner-section">
                                                <div className="banner">
                                                    <img src={sample_img} alt="noti-img" />
                                                </div>
                                            </div> */}
                                            <div className="image_banner_section">
                                                {loadingBanners ? (
                                                    <div className="spinnerCon">
                                                        <Spinner animation="border" />
                                                    </div>
                                                ) : (
                                                    allBannerList.length > 0 ? allBannerList.map((banner, index) => {
                                                        switch (banner.type) {
                                                            case 'slider':
                                                                return <HomeBanner1 banner={banner} key={index} />;
                                                            case 'card':
                                                                return <HomeBanner2 banner={banner} key={index} />;
                                                            case 'cover':
                                                                return <HomeBanner3Rectangle banner={banner} key={index} />;
                                                            case 'card (small)':
                                                                return banner.text_position === 'bottom' ?
                                                                    <HomeBanner4 banner={banner} key={index} /> :
                                                                    <HomeBanner5 banner={banner} key={index} />;
                                                            case 'carousel':
                                                                return <HomeBanner7 banner={banner} key={index} />;
                                                            default:
                                                                return null;
                                                        }
                                                    }) : (
                                                        <p className="display-msg">No banners found!</p>
                                                    )
                                                )}
                                            </div>

                                            {/* divider */}
                                            <div className="divider">
                                                <div className="end-dots"></div>
                                                <div className="end-dots"></div>
                                                <div className="line-wrap">
                                                    <div className="line"></div>
                                                </div>
                                            </div>
                                            {

                                            }
                                            {
                                                userVendor.vendor_status == 'pending' ?
                                                    <div className="custom-alert">
                                                        <div className="custom-alert-content">
                                                            <p>After adding store details, Please contact admin</p>
                                                            <img onClick={handleModal} src={call_icon} alt="WhatsApp" className="contact-icon" />
                                                        </div>
                                                    </div> :
                                                    userVendor.vendor_status == 'inactive' ? <div className="custom-alert" style={{ marginBottom: '20px' }}>
                                                        <div className="custom-alert-content">
                                                            <p>Your store is set to offline by admin, please contact admin</p>
                                                            <img onClick={handleModal} src={call_icon} alt="WhatsApp" className="contact-icon" />
                                                        </div>
                                                    </div> :
                                                        <>

                                                            {/* Business Header */}
                                                            <header className="business-header">
                                                                <div className="business-name">
                                                                    {storeName}
                                                                    {isVerified == 1 ? <img src={verified} alt="verified" /> : ''}
                                                                    <IoShareSocialSharp onClick={() => handleShare(storeName)} class="shrIcon" />
                                                                </div>
                                                                <div className="business-location"><img src={location} alt="location" />{storeArea}, {storeNearBy}, {storeCity}, {storeState}, {storePin}</div>
                                                            </header>

                                                            {/* Online Business Status */}
                                                            <div className="business-online-status">
                                                                <span className="business-view">
                                                                    <span className={`${isOpened ? 'text-success' : 'text-danger'}`}>{isOpened ? "NOW ONLINE" : "NOW OFFLINE"}</span>
                                                                </span>
                                                                <label className="switch">
                                                                    <input type="checkbox" checked={isOpened} onChange={toggleBusinessStatus} />
                                                                    <span className="slider"></span>
                                                                </label>
                                                                {/* <span> <Link to={`/store/${storeId}`}>view now</Link> </span> */}
                                                            </div>

                                                            {/* Business Dates */}
                                                            <div className="business-dates">
                                                                <div>Live on: {storeCreatedAt}</div>
                                                                <div>
                                                                    {validityDate === '0000-00-00' ? (
                                                                        <strong style={{ color: 'red' }}></strong>
                                                                    ) : (
                                                                        <div>Renewal on: {validityDate}</div>
                                                                    )}
                                                                    <div className="days">
                                                                        {calculateDaysLeft(validityDate) <= 0 ? 'Expired' : `${calculateDaysLeft(validityDate)} days left`}
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </>
                                            }



                                            {

                                                <div className="button-cont mt-2">
                                                    {/* <span className='note'>Note: Please update your business details regularly of get more customers lead.</span> */}
                                                    <h6 className='anal-report' style={{ marginTop: '10px', marginBottom: '10px' }}>{userVendor.vendor_status == 'active' ? 'Update' : 'Add'} Your Store</h6>
                                                    <div className="button-section">
                                                        <Link className="button-icon" to={`/vendor/store/update/${storeId}?p=sd`}>
                                                            <div className={`icons ${storeName ? 'check' : ''} `}>
                                                                {/* <div className="disable-icons"></div> */}
                                                                <img src={search_file} alt="search_file" />
                                                            </div>
                                                            <span>Store Details</span>
                                                        </Link>
                                                        <Link className="button-icon" to={userVendor.vendor_status == 'active' && storeName && ownerName ? `/vendor/store/update/${storeId}?p=cd` : ''}>
                                                            <div className={`icons ${storeDetails.length > 1 ? 'check' : ''} `}>
                                                                {userVendor.vendor_status != 'active' || !storeName || !ownerName ? <div className="disable-icons"></div> : ''}
                                                                <img src={contact_card} alt="search_file" />
                                                            </div>
                                                            <span>Contact Details</span>
                                                        </Link>
                                                        {
                                                            permissions?.img_all == '1' ?
                                                                <Link className="button-icon" to={storeDetails.length > 1 ? `/vendor/store/images/${storeId}` : ''}>
                                                                    <div className={`icons ${store?.images?.logo ? 'check' : ''} `}>
                                                                        {storeDetails.length > 1 && userVendor.vendor_status == 'active' ? '' : <div className="disable-icons"></div>}
                                                                        <img src={camera} alt="search_file" />
                                                                    </div>
                                                                    <span>Add Photos</span>
                                                                </Link> :
                                                                null
                                                        }

                                                        {
                                                            permissions?.product_and_service == '1' ?
                                                                <Link className="button-icon" to={store?.images?.logo ? `/vendor/store/products/${storeId}` : ''}>
                                                                    <div className={`icons ${storeProducts ? 'check' : ''} `}>
                                                                        {store?.images?.logo && userVendor.vendor_status == 'active' ? '' : <div className="disable-icons"></div>}
                                                                        <img src={order} alt="search_file" />
                                                                    </div>
                                                                    <span>Product / Services</span>
                                                                </Link> :
                                                                null
                                                        }
                                                        {
                                                            permissions?.offers == '1' ?
                                                                <Link className="button-icon" to={storeProducts ? `/vendor/store/update/${storeId}?p=of` : ''}>
                                                                    <div className={`icons ${storeOffer ? 'check' : ''} `}>
                                                                        {storeProducts && userVendor.vendor_status == 'active' ? '' : <div className="disable-icons"></div>}
                                                                        <img src={discount} alt="search_file" />
                                                                    </div>
                                                                    <span>Add Offers</span>
                                                                </Link> :
                                                                null
                                                        }
                                                        {
                                                            permissions?.delivery_charge == '1' ?
                                                                <Link className="button-icon" to={storeProducts ? `/vendor/store/update/${storeId}?p=dl` : ''}>
                                                                    <div className={`icons ${storeDelTitle != 'discount' && storeDelCharge != 0 ? 'check' : ''} `}>
                                                                        {storeProducts && userVendor.vendor_status == 'active' ? '' : <div className="disable-icons"></div>}
                                                                        <img src={motorbike} alt="search_file" />
                                                                    </div>
                                                                    <span>Delivery Charges</span>
                                                                </Link> :
                                                                null
                                                        }
                                                        {
                                                            permissions?.gst_charges == '1' ?
                                                                <Link className="button-icon" to={storeProducts ? `/vendor/store/update/${storeId}?p=tx` : ''}>
                                                                    <div className={`icons ${storeGstTitle != 'gst' && storeGstCharge != 0 ? 'check' : ''} `}>
                                                                        {storeProducts && userVendor.vendor_status == 'active' ? '' : <div className="disable-icons"></div>}
                                                                        <img src={save} alt="search_file" />
                                                                    </div>
                                                                    <span>GST Charges</span>
                                                                </Link> :
                                                                null
                                                        }
                                                        {
                                                            permissions?.seo_details == '1' ?
                                                                <Link className="button-icon" to={storeProducts ? `/vendor/store/update/${storeId}?p=sed` : ''}>
                                                                    <div className={`icons ${storeMeta ? 'check' : ''} `}>
                                                                        {storeProducts && userVendor.vendor_status == 'active' ? '' : <div className="disable-icons"></div>}
                                                                        <img src={seo} alt="search_file" />
                                                                    </div>
                                                                    <span>SEO Details</span>
                                                                </Link> :
                                                                null
                                                        }


                                                    </div>
                                                    <p onClick={() => window.location.href = `${config.frontEndBaseUrl}store/${storeId}`} className='view-all' style={{ marginTop: '10px', marginBottom: '10px' }}>View Your Store</p>
                                                </div>

                                            }
                                            {
                                                storeReports == '1' && userVendor.vendor_status == 'active' ?
                                                    <div className="analytics-section">
                                                        <span class="anal-report">Analytical Reports</span>
                                                        <div className="analytics-header">
                                                            <div className="date-pick">
                                                                {/* date filter */}
                                                                <div className='DatePicker-wrap'>
                                                                    <DatePicker id="startDate" selected={startDatePick} onChange={handleStartDateChange} dateFormat="dd MMM yyyy" placeholderText="Start Date" autoComplete='off' className="calendar-picker" />
                                                                    <DatePicker id="endDate" selected={endDate} onChange={handleEndDateChange} dateFormat="dd MMM yyyy" placeholderText="End Date" autoComplete='off' className="calendar-picker" />
                                                                    {
                                                                        isClearBtnShown
                                                                        &&
                                                                        <button className='btn btn-lg'
                                                                            style={{ width: 'fit-content', padding: '2px 8px', fontSize: '10px', backgroundColor: '#505356', color: '#fff' }}
                                                                            onClick={() => hideClearBtn()}>
                                                                            Clear
                                                                        </button>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="analytics-data">
                                                            <Link to={storeStatus == 1 || userVendor.vendor_status != 'pending' ? `/vendor/orders/${storeId}` : `/vendor`} className="box red">My Orders <div style={{ marginTop: '3px' }}>{orderCount}</div></Link>
                                                            <Link to={storeStatus == 1 || userVendor.vendor_status != 'pending' ? `/vendor/enquiries/${storeId}` : `/vendor`} className="box red">Enquiry <div style={{ marginTop: '3px', }}>{queriesCount}</div></Link>
                                                            <Link to={storeStatus == 1 || userVendor.vendor_status != 'pending' ? `/vendor/comments/${storeId}` : `/vendor`} className="box red">
                                                                <span className='box green'> {rating} ★ </span>
                                                                <div className='comments'>
                                                                    {commentsCount} Comments
                                                                </div>
                                                            </Link>
                                                        </div>

                                                        {/* Additional Data */}
                                                        <div className="additional-analytics">
                                                            <div className='data-additional'>
                                                                <div className="data-additional-icon"><FaRegEye className='icons'/></div>Total Views : <span className='count'>{totalViews}</span>
                                                                <div className='arrows'><BsChevronRight /></div>
                                                            </div>
                                                            <Link className='data-additional' to={storeStatus == 1 || userVendor.vendor_status != 'pending' ? `/vendor/leads/followers` : '/vendor'}>
                                                                <div className="data-additional-icon"><SlUserFollowing className='icons'/></div>Followers : <span className='count'>{followers}</span>
                                                                <div className='arrows'><BsChevronRight /></div>
                                                            </Link>
                                                            <Link className='data-additional' to={storeStatus == 1 || userVendor.vendor_status != 'pending' ? `/vendor/leads/chat-call` : '/vendor'}>
                                                                <div className="data-additional-icon"><IoCallOutline className='icons'/></div>Call Received : <span className='count'>{calls}</span>
                                                                <div className='arrows'><BsChevronRight /></div>

                                                            </Link>
                                                            <Link className='data-additional' to={storeStatus == 1 || userVendor.vendor_status != 'pending' ? `/vendor/leads/chat-call` : '/vendor'}>
                                                                <div className="data-additional-icon"><FaWhatsapp className='icons'/></div>WhatsApp : <span className='count'>{chats}</span>
                                                                <div className='arrows'><BsChevronRight /></div>

                                                            </Link>
                                                            <Link className='data-additional' to={storeStatus == 1 || userVendor.vendor_status != 'pending' ? `/vendor/leads/products-services` : '/vendor'}>
                                                                <div className="data-additional-icon"><FaBoxesPacking className='icons'/></div>Product/Services : <span className='count'>{products}</span>
                                                                <div className='arrows'><BsChevronRight /></div>

                                                            </Link>
                                                            <div className='data-additional'>
                                                                <div className="data-additional-icon"><IoShareSocialSharp /></div>Store Share : {share}
                                                                <div className='arrows'><BsChevronRight className='icons'/></div>

                                                            </div>
                                                        </div>
                                                    </div> : null
                                            }
                                            {
                                                storeNotification == '1' && userVendor.vendor_status == 'active' ?
                                                    <Link className='sendNotBtn' to={storeStatus == 1 || userVendor.vendor_status != 'pending' ? `/vendor/notification` : '/vendor'}>
                                                        <span>Send Notification</span>
                                                        <span><BsChevronRight /></span>
                                                    </Link>
                                                    : null
                                            }

                                        </div>
                                    </div>
                                    {/* </div> */}
                                    {showModal && (
                                        <div className="modal-overlay" onClick={handleModal}>
                                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                                {/* <h3>Contact Options</h3> */}
                                                <div className='btnBx'>
                                                    <button onClick={() => window.open(`https://wa.me/${getSocialLink('whatsapp')}`, '_blank')}>
                                                        <img src={'https://cdn3.iconfinder.com/data/icons/social-media-chamfered-corner/154/whatsapp-512.png'} alt="WhatsApp" className="contact-icon" />
                                                        WhatsApp
                                                    </button>
                                                    <button onClick={() => window.location.href = `tel:+${getSocialLink('call')}`}>
                                                        <img src={'https://i.pinimg.com/originals/8e/a0/83/8ea08365d331d8ae9bd93ba5f50528d4.png'} alt="Call" className="contact-icon" />
                                                        Call
                                                    </button>
                                                </div>
                                                <button onClick={handleModal} className="close-button">Close</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}

export default Dashboard;