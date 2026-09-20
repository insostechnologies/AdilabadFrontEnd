import React, { useState, useRef, useEffect } from 'react';
import './StoreDetail.css';
import './mediaQuery.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import image1 from '../../components/Assets/Images/card1.png';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from "react-icons/io";
import { FaEye, FaHeart, FaStar } from 'react-icons/fa6';
import { IoShareSocialSharp } from "react-icons/io5";
import { MdOutlinePeopleOutline, MdVerifiedUser } from 'react-icons/md';
import { HiArrowNarrowLeft, HiArrowNarrowRight } from "react-icons/hi";
import { FaClockRotateLeft, FaAngleRight } from "react-icons/fa6";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { LuCalendarClock } from "react-icons/lu";
import location from "../../components/Assets/Images/location.png";
import { useParams } from 'react-router-dom';
import { config } from '../../../config.js';
import Spinner from 'react-bootstrap/Spinner';
import MobileHeader from '../../components/MobileHeader/MobileHeader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Comments from '../../components/Comments/Comments.jsx';
import { Modal, Button } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { AiOutlineHeart } from "react-icons/ai";
import StoreViewCard from '../../components/StoreViewCard/StoreViewCard.jsx';
import EnquiryCard from '../StoresView/EnquiryCard/EnquiryCard.jsx';
import { AiOutlineClockCircle } from "react-icons/ai";
import { AiOutlineClose, AiFillFacebook, AiFillPhone, AiOutlineArrowRight, AiOutlineMail, AiOutlineWhatsApp, AiFillYoutube, AiFillPushpin, AiFillInstagram, AiOutlineWifi, AiFillDollarCircle, AiFillTwitterCircle } from "react-icons/ai";
import { CiImageOn } from "react-icons/ci";
import { leadsAdd } from '../../../utils/apiCall'; // Import leadsAdd function
import { AiOutlineShop } from "react-icons/ai";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { WhatsAppChatButton, GoogleMapsDirectionsButton, CallNowButton, ShareMerchantButton, VerifiedMerchantBadge } from '../../../components/MerchantEnrichments.jsx';

const StoreDetail = () => {
	const [showImage, setShowImage] = useState(false);
	const navigate = useNavigate();
	const listRefProducts = useRef(null);
	const listRefGallery = useRef(null);
	const listRef = useRef(null);

	const { id } = useParams();
	const [store, setStore] = useState([]);
	const [loadingStores, setLoadingStores] = useState(true);
	const [error, setError] = useState(null);
	const [banners, setBanners] = useState([])
	const [logo, setLogo] = useState([])
	const [gallery, setGallery] = useState([])
	const [videos, setVideo] = useState([]);
	const [products, setProducts] = useState([])
	const [offer, setOffers] = useState(null)
	const [address, setAddress] = useState(null)
	const [details, setDetails] = useState(null)
	const [time, setTime] = useState(null)
	const [followedStores, setFollowedStores] = useState([])
	const [isFollowed, setIsFollowed] = useState(false);
	const [followingCount, setFollowingCount] = useState(0)
	const [comments, setComments] = useState([])
	const [avgComment, setAvgComment] = useState(0)
	const [savedStores, setSavedStores] = useState([])
	const [selectedType, setSelectedType] = useState(null); // For tracking selected type (e.g., 'phone', 'whatsapp')
	const [modalOpen, setModalOpen] = useState(false); // For tracking modal state
	const [selectedImage, setSelectedImage] = useState(null);

	const [isExpended, SetIsExpended] = useState(false);
	const [isLongExpended, SetIsLongExpended] = useState(false);

	const [showComments, setShowComments] = useState(false);
	const [show, setShow] = useState(false);

	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [message, setMessage] = useState('');

	const [storeList, setStoreList] = useState([]);

	const [currentIndex, setCurrentIndex] = useState(0);
	const [currentBIndex, setCurrentBIndex] = useState(0);
	const [siteTitle, setSiteTitle] = useState('')
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
			toast.error('Failed to fetch permissions');
		}
	};

	const fetchSiteDetails = async () => {
		try {
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
				setSiteTitle(result.data.seoDetails.name);
			} else {
				console.log('Internal server error');
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	useEffect(() => {
		fetchSiteDetails();
		fetchPermissions()
	}, [])

	let user = JSON.parse(localStorage.getItem('user'));

	const user_id = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).uid : '';
	const cat_id = localStorage.getItem('cat_uid');

	const handleLeads = async () => {
		try {
			const result = await leadsAdd(user.uid, id, 'product'); // Assuming id is the store_id
			console.log('Lead added:', result);
		} catch (error) {
			console.error('Error adding lead:', error);
		}
		// navigate(`/store/${id}`);
	};

	const getYoutubeEmbedUrl = (youtubeLink) => {
		let videoId;

		// Check if the link is a standard YouTube link
		if (youtubeLink.includes("youtube.com/watch?v=")) {
			videoId = youtubeLink.split('v=')[1].split('&')[0]; // Get the video ID and remove any additional parameters
		}
		// Check if the link is a shortened YouTube link
		else if (youtubeLink.includes("youtu.be/")) {
			videoId = youtubeLink.split('youtu.be/')[1].split('?')[0]; // Get the video ID and remove any additional parameters
		} else {
			// throw new Error("Invalid YouTube link");
		}

		return `https://www.youtube.com/embed/${videoId}`;
	};

	const settingsVid = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
	};


	const fetchStores = async (uid) => {
		try {
			const response = await fetch(`${config.backEndBaseUrl}api/store?cid=${uid}&status=1`, {
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
				let stores = result.data;

				// Filter stores where status is 1 and uid is not equal to the given id
				const filteredStores = stores.filter(store => store.status == 1 && store.uid !== id);

				setStoreList(filteredStores);
			} else {
				setStoreList([]);
			}
		} catch (error) {
			console.error('Fetching stores failed', error);
		}
	};


	useEffect(() => {
		fetchStores(cat_id);
	}, [cat_id]);

	const fetchUser = async (user_id) => {
		try {
			const response = await fetch(`${config.backEndBaseUrl}api/user/${user_id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const result = await response.json();
			if (result.status) {
				let user = result.data
				setName(user.user_name)
				setPhone(user.phone)
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}

	useEffect(() => {
		fetchUser(user_id)
	}, [user_id])


	const handleIconClick = async (type) => {
		setSelectedType(type);
		setModalOpen(true);
	};
	function getFormattedDateTime() {
		const date = new Date();

		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
		const day = String(date.getDate()).padStart(2, '0');

		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const seconds = String(date.getSeconds()).padStart(2, '0');

		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	}
	const handleContactClick = async (type) => {
		const leadsData = {
			userId: user.uid,
			storeId: id,
			type: type,
			date: getFormattedDateTime()
		};

		try {
			const response = await fetch(`${config.backEndBaseUrl}api/store/leads/add`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(leadsData),
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

		} catch (error) {
			console.error('Error:', error);
			//alert('There was an error sending your enquiry. Please try again later.');
		}
	}


	const handleCloseModal = () => {
		setModalOpen(false);
		setSelectedType(null);
	};

	const pad = (n) => n.toString().padStart(2, '0');
	const now = new Date();

	const createdAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

	// Handle form submission
	const handleSubmit = async (event) => {
		event.preventDefault();

		const enquiryData = {
			userId: user.uid,
			name,
			phone,
			message,
			storeId: id,
			createdAt: createdAt,
		};

		
		try {
			const response = await fetch(`${config.backEndBaseUrl}api/user/enquiry/add`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(enquiryData),
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const result = await response.json();
			// console.log('Success:', result);
			if (result.status) {
				toast.success('Enquiry Submitted', {
					position: 'top-center',
				});
			}
			handleClose()
			setName('');
			setPhone('');
			setMessage('');
			//alert('Your enquiry has been sent successfully!');
		} catch (error) {
			console.error('Error:', error);
			//alert('There was an error sending your enquiry. Please try again later.');
		}
	};

	const iconMapping = {
		facebook: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShE432V2K8x-pkqSVX_dWQQ0rMTEYlYVYjYg&s',
		twitter: 'https://toppng.com/uploads/preview/twitter-x-new-logo-round-icon-png-11692480241tdbz6jparr.webp',
		instagram: 'https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-instagram-new-circle-512.png',
		website: 'https://icons.veryicon.com/png/o/miscellaneous/smart-icon-library/internet-61.png',
		upi: 'https://cdn.iconscout.com/icon/free/png-256/free-upi-logo-icon-download-in-svg-png-gif-file-formats--unified-payments-interface-payment-money-transfer-logos-icons-1747946.png?f=webp&w=256',
		mail: 'https://www.freeiconspng.com/uploads/email-icon--circle-iconset--martz90-8.png',
		youtube: 'https://static.vecteezy.com/system/resources/thumbnails/023/986/480/small_2x/youtube-logo-youtube-logo-transparent-youtube-icon-transparent-free-free-png.png',
		map: 'https://cdn-icons-png.flaticon.com/512/235/235861.png',
		phone: 'https://cdn-icons-png.freepik.com/512/5585/5585856.png',
		whatsapp: 'https://cdn2.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-whatsapp-circle-512.png',
		others: 'https://cdn-icons-png.flaticon.com/512/341/341077.png',
	};

	const handleSave = async () => {
		try {
			const response = await fetch(`${config.backEndBaseUrl}api/store/save/${id}`, {
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'put',
				body: JSON.stringify({ userId: user.uid })
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const result = await response.json();
			if (result.status) {
				if (result.type === 'added') {
					setSavedStores(prevStores => [...prevStores, id]);
					toast.success('Store saved successfully! It will be featured on the homepage shortly.', {
						position: 'top-center',
					});
				} else if (result.type === 'removed') {
					toast.info('Store has been removed from your saved list.', {
						position: 'top-center',
					});
					setSavedStores(prevStores => prevStores.filter(storeId => storeId !== id));
				}
			}
		} catch (error) {
			setError('Failed to load stores. Please try again later.');
			console.log(error)
		} finally {
			setLoadingStores(false);
		}
	}

	const fetchStore = async (uid) => {
		try {
			const response = await fetch(`${config.backEndBaseUrl}api/store/${uid}`, {
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
				let store = result.data;
				let images = store.images || {}; // Default to empty object if images is null/undefined

				const sortedProducts = store.products && store.products.length > 0
					? store.products.sort((a, b) => {
						// Null values first
						if (!a.updated_at) return -1;
						if (!b.updated_at) return 1;
						// Sort by date, recent first
						return new Date(b.updated_at) - new Date(a.updated_at);
					})
					: []; // Return an empty array if store.products is null or empty


				setStore(store);
				setDetails(store.details || null);
				setTime(store.time || null);
				setAddress(store.address || null);
				setOffers(store.offer || []);
				setProducts(sortedProducts || []);
				setBanners(images.banner || []);
				setLogo(images.logo || []);
				setGallery(images.gallery || []);
				setVideo(images.video || []);
				setFollowingCount(store.following_count || 0);
				setComments(store.comments || []);

				// Safely calculate the average rating
				const totalRatings = (store.comments || []).reduce((sum, comment) => sum + (comment.rating || 0), 0);
				const averageRating =
					store.comments && store.comments.length > 0
						? (totalRatings / store.comments.length).toFixed(1)
						: "0.0";

				console.log(averageRating);

				setAvgComment(averageRating);
			} else {
				setStore(null); // Set store to null if the response status is false
			}
		} catch (error) {
			console.error("Fetching stores failed", error);
			setError("Failed to load stores. Please try again later.");
		} finally {
			setLoadingStores(false);
		}
	};

	function getTimeSince(dateString) {
		const today = new Date();
		const targetDate = new Date(dateString);

		// Adjust targetDate by adding 20 hours to compensate for the server time difference
		targetDate.setHours(targetDate.getHours() + 20);
		targetDate.setMinutes(targetDate.getMinutes() + 22);

		const diffMs = today - targetDate;
		const oneMinute = 60 * 1000;
		const oneHour = 60 * oneMinute;
		const oneDay = 24 * oneHour;
		const oneWeek = 7 * oneDay;

		let remainingTime = diffMs;

		// Calculate weeks
		const weeks = Math.floor(remainingTime / oneWeek);
		remainingTime %= oneWeek;

		// Calculate days
		const days = Math.floor(remainingTime / oneDay);
		remainingTime %= oneDay;

		// Calculate hours
		const hours = Math.floor(remainingTime / oneHour);
		remainingTime %= oneHour;

		// Calculate minutes
		const minutes = Math.floor(remainingTime / oneMinute);

		// Return only the first relevant time unit
		if (weeks > 0) {
			return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
		}
		if (days > 0) {
			return `${days} day${days > 1 ? 's' : ''} ago`;
		}
		if (hours > 0) {
			return `${hours} hour${hours > 1 ? 's' : ''} ago`;
		}
		if (minutes > 0) {
			return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
		}

		return 'just now';
	}




	const fetchUserSavedStores = async () => {
		try {
			const response = await fetch(`${config.backEndBaseUrl}api/user/stores/${user.uid}`, {
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
				let stores = result.data;
				setSavedStores(stores)
			} else {
				setSavedStores([]);
			}
		} catch (error) {
			console.error('Fetching stores failed', error);
			setError('Failed to load stores. Please try again later.');
		}
	}

	useEffect(() => {
		fetchUserSavedStores()

	}, []);

	// timing section
	const convertTo12HourFormat = (time) => {
		let [hours, minutes] = time.split(':');
		hours = parseInt(hours);
		const ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12 || 12; // Convert to 12-hour format
		return `${hours}:${minutes} ${ampm}`;
	};

	const isOpenNow = (fromTime, toTime) => {
		let currentTime = new Date();
		let currentHours = currentTime.getHours();
		let currentMinutes = currentTime.getMinutes();

		// Convert 'fromTime' and 'toTime' to hours and minutes
		let [fromHours, fromMinutes] = fromTime.split(':').map(Number);
		let [toHours, toMinutes] = toTime.split(':').map(Number);

		// Compare current time with opening and closing hours
		let currentTotalMinutes = currentHours * 60 + currentMinutes;
		let fromTotalMinutes = fromHours * 60 + fromMinutes;
		let toTotalMinutes = toHours * 60 + toMinutes;

		return currentTotalMinutes >= fromTotalMinutes && currentTotalMinutes < toTotalMinutes;
	};

	const dayOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

	const checkStoreStatus = (time) => {
		let currentDay = dayOrder[new Date().getDay()]; // Get the current day
		let currentDaySchedule = time.find(t => t.day === currentDay); // Find today's schedule

		// If no schedule is found for today
		if (!currentDaySchedule) return 'Closed';

		let { from_time, to_time } = currentDaySchedule;

		// Check if the store operates 24 hours
		if (from_time === '00:00' && to_time === '23:59') {
			return '24 Hours';
		}

		// Check if the store is open now
		if (isOpenNow(from_time, to_time)) {
			// Return Open along with the closing time (to_time)
			return `Open, till ${convertTo12HourFormat(to_time)}`;
		}

		return 'Closed';
	};

	// end

	// const toggleImage = (image) => {
	// 	setSelectedImage(image);
	// 	setShowImage(prevShowImage => !prevShowImage);
	// };

	const toggleImage = (imagePath = null) => {
		if (imagePath) {
			setSelectedImage(imagePath);
			setCurrentIndex(gallery.findIndex(item => item.path === imagePath));
		}
		setShowImage(prevShowImage => !prevShowImage);
	};
	const goBack = () => {
		navigate(-1);
	};

	const handleScrollProducts = (direction) => {
		if (direction === 'left') {
			listRefProducts.current.scrollBy({ left: -300, behavior: 'smooth' });
		} else {
			listRefProducts.current.scrollBy({ left: 300, behavior: 'smooth' });
		}
	};

	const handleScrollGallery = (direction) => {
		if (direction === 'left') {
			setCurrentIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : gallery.length - 1));
		} else {
			setCurrentIndex(prevIndex => (prevIndex < gallery.length - 1 ? prevIndex + 1 : 0));
		}
	};

	const handleScroll = (direction) => {
		if (direction === 'left') {
			listRef.current.scrollBy({ left: -300, behavior: 'smooth' });
		} else {
			listRef.current.scrollBy({ left: 300, behavior: 'smooth' });
		}
	};
	const handleShare = async () => {
		const leadsData = {
			userId: user.uid,
			storeId: id,
			type: 'share',
			date: getFormattedDateTime()
		};

		try {
			const response = await fetch(`${config.backEndBaseUrl}api/store/leads/add`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(leadsData),
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

		} catch (error) {
			console.error('Error:', error);
			//alert('There was an error sending your enquiry. Please try again later.');
		} finally {

			// Customize the message format
			const shareTitle = siteTitle;
			const shareUrl = `${config.frontEndBaseUrl}store/${id}`; // Use the current page's URL
			const customMessage = `Hi, Link: ${shareUrl}\n\nPlease reply...\n\nMessage from ${siteTitle}`;

			const shareData = {
				title: shareTitle,
				text: customMessage,
			};

			if (navigator.share) {
				navigator.share(shareData)
					.then(() => console.log('Share successful'))
					.catch((error) => console.error('Error sharing:', error));
			} else {
				// Fallback for browsers that do not support the Web Share API
				alert('Sharing is not supported in this browser. Copy the link: ' + customMessage);
			}
		};


	};

	useEffect(() => {
		// Set the page title
		document.title = store.metaData ? store.metaData.title : 'Adilabad Store';

		// Set meta description
		const metaDescription = document.querySelector("meta[name='description']");
		if (metaDescription) {
			metaDescription.setAttribute("content", store.metaData ? store.metaData.desc : '');
		} else {
			const meta = document.createElement("meta");
			meta.name = store.metaData ? store.metaData.title : 'Adilabad Store';;
			meta.content = store.metaData ? store.metaData.desc : '';
			document.head.appendChild(meta);
		}
	}, []);

	const settings = {
		dots: true,
		infinite: banners && banners.length > 1, // Disable infinite loop if there's only one slide
		speed: 1000,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 4000,
		afterChange: (current) => setCurrentBIndex(current),
	};
	const settings2 = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		initialSlide: currentIndex,
		afterChange: index => setCurrentIndex(index),
	};

	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen);
	};

	const fetchUserFollowedStores = async () => {
		try {
			const response = await fetch(`${config.backEndBaseUrl}api/user/stores/followes/${user.uid}`, {
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
				let stores = result.data;
				setFollowedStores(stores)

			} else {
				setFollowedStores([]);
			}
		} catch (error) {
			console.error('Fetching stores failed', error);
			setError('Failed to load stores. Please try again later.');
		}
	}
	useEffect(() => {
		fetchStore(id);
	}, [id]);

	useEffect(() => {
		async function fetchData() {
			await fetchUserFollowedStores();  // Ensure this is async and sets followedStores correctly
		}
		fetchData();
	}, []);

	useEffect(() => {
		if (followedStores && followedStores.length > 0) {
			setIsFollowed(followedStores.includes(id));
		} else {
			setIsFollowed(false);
		}
	}, [followedStores, id]);


	const handleStoreFollowing = async (store_id, user_id) => {
		try {
			const response = await fetch(`${config.backEndBaseUrl}api/store/follow/${store_id}`, {
				method: 'put',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ userId: user_id }),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();

			if (result.status) {
				setIsFollowed(prevIsFollowed => !prevIsFollowed);
				if (isFollowed) {
					setFollowingCount(prevfollowingCount => prevfollowingCount - 1)
				} else {
					setFollowingCount(prevfollowingCount => prevfollowingCount + 1)
				}
				if (isFollowed) {
					toast.success('Unfollowed Successfully.', {
						position: 'top-center',
						duration: 5000,
					});
				} else {
					toast.success('Followed Successfully.', {
						position: 'top-center',
						duration: 5000,
					});
				}
			} else {
				toast.error('Failed to save store. Please try again.', {
					position: 'top-center',
					duration: 5000,
				});
			}
		} catch (error) {
			console.error('Error saving store:', error);
			toast.error('An error occurred while saving the store.', {
				position: 'top-center',
				duration: 5000,
			});
		}
	};

	if (loadingStores) {
		return (
			<>
				<MobileHeader title={"Store"} />
				<div className='loading-container'>
					<Spinner animation="border" />
				</div>;
			</>
		)
	}

	// Call , WhatsApp, Location, UPI Pay, Website, Email, YouTube, Instagram, Facebook, X, Other Links.
	const sequenceOrder = ['phone', 'whatsapp', 'map', 'upi', 'website', 'mail', 'youtube', 'instagram', 'facebook', 'twitter', 'other'];


	// Sort the details array based on the sequence order
	const sortedDetails = details
		? [...details].sort((a, b) => {
			const indexA = sequenceOrder.indexOf(a.type);
			const indexB = sequenceOrder.indexOf(b.type);

			// If type is not found in sequenceOrder, push to the end
			const finalIndexA = indexA === -1 ? sequenceOrder.length : indexA;
			const finalIndexB = indexB === -1 ? sequenceOrder.length : indexB;

			return finalIndexA - finalIndexB;
		})
		: []; // Return an empty array if details is null or undefined

	// Group items by type
	const groupedItems = sortedDetails
		.filter(item => item.status !== 0) // Filter out items with status 0
		.reduce((acc, item) => {
			if (!acc[item.type]) acc[item.type] = [];
			acc[item.type].push(item);
			return acc;
		}, {});

	// Store Description handle section
	const StoreDefault4LineDes1 = store?.short_desc
		? store.short_desc.split(' ').slice(0, 22).join(" ")
		: "";

	const desLenghtCheck1 = store?.short_desc
		? store.short_desc.split(' ').filter(word => word !== '').length
		: 0;

	const StoreDefault4LineDes2 = store?.long_desc
		? store.long_desc.split(' ').slice(0, 27).join(" ")
		: "";

	const desLenghtCheck2 = store?.long_desc
		? store.long_desc.split(' ').filter(word => word !== '').length
		: 0;


	const toggleDes = () => {
		SetIsExpended(!isExpended);
	}
	const toggleLongDes = () => {
		SetIsLongExpended(!isLongExpended);
	}

	// Comments popup
	const handleToggleComments = () => {
		setShowComments(prevState => !prevState);
	};

	// query form modal
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	// Create & Update
	const CreateAt = store?.created_at || "N/A";
	const UpdatedAt = store?.updated_at || "N/A";



	const formatCount = (count) => {
		if (count >= 1000000) {
			return (count / 1000000).toFixed(1) + 'M'; // Format to millions
		} else if (count >= 1000) {
			return (count / 1000).toFixed(1) + 'K'; // Format to thousands
		}
		return count; // Return the original count if less than 1000
	};

	if (!store?.status || Object.keys(store || {}).length === 0) {
		return (
			<>
				<MobileHeader title={`Store`} />
				<div style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					height: "80vh",
					textAlign: "center",
					color: "#555",
				}}>
					<AiOutlineShop size={80} color="#ccc" />
					<h2 style={{ marginTop: "20px", fontSize: "24px", color: "#333" }}>
						Store is Currently Offline
					</h2>
					<p style={{ marginTop: "10px", fontSize: "16px", color: "#777" }}>
						The store is unavailable right now. Please check back later.
					</p>
				</div>
			</>
		);
	}


	const formatPhoneNumber = (phoneNumber) => {
		// Trim whitespace
		phoneNumber = phoneNumber.trim();

		// Check if it starts with "+91" or "91"
		if (!phoneNumber.startsWith('+91')) {
			if (phoneNumber.startsWith('91')) {
				// Add "+" if it starts with "91"
				phoneNumber = '+' + phoneNumber;
			} else {
				// Add "+91" if it doesn't start with either
				phoneNumber = '+91' + phoneNumber;
			}
		}
		return phoneNumber;
	}

	return (
		<>
			<ToastContainer />
			<div className='store-detail'>
				{
					((banners && banners.length <= 0) && (permissions.img_banner == '1' || permissions.img_all == '1')) && (
						<div className="top-header" ><MobileHeader title={`View Details`} shareCount={`${1}`} /></div>
					)
				}

				{
					banners && banners.length > 0 && (

						<div className="slider" style={{ display: permissions.img_banner == '0' || permissions.img_all == '0' ? 'none' : '' }}>
							<Slider {...settings}>
								{
									banners && banners.length > 0 ? banners.map((item, index) => (
										<Link className="image image-container" key={index} to={item.link}>
											<img src={item.path != config.placeHolderImage ? config.backEndBaseUrl + item.path : `https://st2.depositphotos.com/51474876/47758/i/450/depositphotos_477583906-stock-photo-texture-plastic-folder-cover-white.jpg`} alt="banner_img" />
											{item.title == '' ? '' : <span className={`img-title ${item.path == config.placeHolderImage ? 'center' : ''}`}>{item.title}</span>}
										</Link>
									)) :
										<div className="image">
											<img src={`https://st2.depositphotos.com/51474876/47758/i/450/depositphotos_477583906-stock-photo-texture-plastic-folder-cover-white.jpg`} alt="banner_img" />
										</div>
								}

							</Slider>
							<span className='bannerCount galleryCount'>{currentBIndex + 1}/{banners.length} <span><CiImageOn /></span></span>
						</div>
					)
				}
				<IoMdArrowBack onClick={goBack} className='arrow' />


				<div className="store-info">
					<div className="desk-screen-size">
						<div className="head">
							<div className="head-detail">
								{/* <div className="bg-style"></div> */}
								<div className='profile-logo'>
									<img src={(logo && logo.length > 0) && (permissions.img_logo == '1' || permissions.img_all == '1') ? config.backEndBaseUrl + logo[0].path : config.backEndBaseUrl + config.placeHolderImage} className='profile-pic' alt='profile_img' />
								</div>
								<div className="name-detail">
									<h4>{store.owner_name}</h4>
									<p style={{ display: permissions.followers_count == '0' ? 'none' : '' }} >{followingCount} Followers</p>
								</div>
							</div>

							<button
								style={{ backgroundColor: isFollowed ? 'gray' : '#1549e6', display: permissions.followers_count == '0' ? 'none' : '' }}
								className='follow-btn'
								onClick={() => handleStoreFollowing(store.uid, user.uid)}>
								{isFollowed && <span>Following</span>}
								{!isFollowed && <span style={{ fontWeight: '600' }}>Follow +</span>}
							</button>
						</div>
						<div className="store-actions">
							<div className="details" >
								<p className='views-num'>
									<span style={{ display: permissions.total_views == '0' ? 'none' : '' }}><FaEye /> {store.total_views} views &#8226;</span>
									<span>{getTimeSince(store.created_at)}</span>
								</p>
							</div>
							<div className="actions">
								<span className='countBx'>
									<IoShareSocialSharp onClick={handleShare} />
									<span className='count' style={{ display: permissions.share == '0' ? 'none' : '' }}>{store.total_share == 0 ? '' : store.total_share}</span>
								</span>
								<span className='countBx'>
									{
										savedStores.includes(id) ? (
											<FaHeart className='heart' onClick={() => handleSave()} />
										) : <AiOutlineHeart onClick={() => handleSave()} />
									}
									<span className='count'>{store.total_saves == 0 ? '' : store.total_saves}</span>
								</span>
							</div>
						</div>
						<div className="store-detail-des" >
							<h2 className='store-name-title'>{store.name} {store.is_verified == 1 ? <MdVerifiedUser className='verified-icon' /> : ''} </h2>
							<div className="store-detail-enrichments-bar" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', margin: '12px 0 16px 0', alignItems: 'center' }}>
								<VerifiedMerchantBadge isVerified={store.is_verified == 1} rating={store.average_rating || 4.5} totalReviews={store.comments?.length || 0} />
								<CallNowButton phone={store.phone || store.whatsapp} />
								<WhatsAppChatButton phone={store.phone || store.whatsapp} storeName={store.name} />
								<GoogleMapsDirectionsButton address={address?.area} city={address?.city || 'Adilabad'} storeName={store.name} latitude={store.lat} longitude={store.lng} />
								<ShareMerchantButton storeName={store.name} />
							</div>
							<div className="description" style={{ display: permissions.store_details == '0' ? 'none' : '' }}>
								<div className="des-wrapper">
									<div className='store-des main-store-des' dangerouslySetInnerHTML={{ __html: isExpended ? store.short_desc : StoreDefault4LineDes1 + `${desLenghtCheck1 >= 22 ? '' : ''}` }}></div>
									{store.short_desc && desLenghtCheck1 >= 22 && (
										<span className='view-des-btn' onClick={toggleDes}>
											{isExpended ? 'Read Less ▲' : 'Read More...▼'}
										</span>
									)}
								</div>
								<p className='location'>
									<img src={location} alt="" className='icon-location' />
									{address ? `${address.area}, ${address.near_by}, ${address.city}, ${address.state}, ${address.pincode}` : null}
								</p>
							</div>
							{
								offer.title ? (
									<div className="discount" style={{ display: permissions.offers == '0' ? 'none' : '' }}>
										<div className="discount-box">
											{/* <div className="border-style-wrapper">
												<span className="border-style"></span>
												<span className="border-style"></span>
											</div> */}
											<p>✅ {offer.title ? offer.title : ''} <span>{offer.discount ? offer.discount + '%' : ''}</span></p>
										</div>
									</div>
								) : null
							}

							<div className="rating-comments-area" >
								<div className='ratings-comment' style={{ display: permissions.comments == '0' ? 'none' : '' }}>
									<div className="store-rating">
										<span className="rating-score">{avgComment} <FaStar /> </span>
										<span className="rating-comments" onClick={() => setShowComments(!showComments)}>{comments ? comments.length : 0} Comments ▼</span>
									</div>
								</div>
								<div className="enquiries">
									<div>
										<button onClick={handleShow}>Send Enquiry</button>
										<h6 className='enquired-text'> <MdOutlinePeopleOutline className='enquired-icon' /> {store.total_enquiries} people enquired </h6>
									</div>
								</div>
							</div>
							{/* Modal */}
							<Modal show={show} onHide={handleClose} centered>
								<Modal.Header closeButton>
									<Modal.Title className="modal-title-custom">
										Send your queries
									</Modal.Title>
								</Modal.Header>
								<Modal.Body>
									<form >
										<input
											className='input-area-custom'
											type="text"
											placeholder='Enter your Name'
											value={name}
											onChange={(e) => setName(e.target.value)}
										/>
										<input
											className='input-area-custom'
											type="number"
											placeholder='Enter your Phone'
											value={phone}
											onChange={(e) => setPhone(e.target.value)}
										/>
										<textarea
											className='input-area-custom'
											name=""
											id="message"
											placeholder='Enter your Message'
											onChange={(e) => setMessage(e.target.value)}
										></textarea>
										<Button variant="danger" onClick={handleSubmit} className='submit-button-custom'>
											Send Enquiry
										</Button>
									</form>
								</Modal.Body>
							</Modal>
							{/* modal end */}


							<div className="icons-action" style={{ display: permissions.contact_social_details == '0' ? 'none' : '' }}>
								{Object.keys(groupedItems).map((type, index) => {
									const imgSrc = iconMapping[type] || ''; // Use the icon mapping
									const firstLeadCount = groupedItems[type][0]?.leads || 0; // Get leads from the first item, default to 0 if not available

									return (
										<div key={index} className="icon-box-social" onClick={() => handleIconClick(type)}>
											<img src={imgSrc} alt={type} />
											<p>{type == 'phone' ? 'call' : (type == 'map' ? 'location' : (type == 'youtube' ? 'video' : type))}</p>
											{store.details_is_show == 1 ? (firstLeadCount == 0 ? "" : <div className="counting">{formatCount(firstLeadCount)}</div>) : ''}
										</div>
									);
								})}
							</div>


							{/* Modal for showing multiple items */}
							{modalOpen && (
								<div className="modal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
									<div className="modal-content ">
										<ul className='modal-content-social'>
											{groupedItems[selectedType].map((item, index) => {

												let link = item.value;
												let icon = ''
												switch (item.type) {
													case 'phone':
														icon = <AiFillPhone className='icons' />
														link = `tel:${formatPhoneNumber(item.value)}`;
														break;
													case 'mail':
														icon = <AiOutlineMail className='icons' />
														link = `mailto:${item.value}`;
														break;
													case 'whatsapp':
														icon = <AiOutlineWhatsApp className='icons' />
														// const message = `Hi, ${store.owner_name}, ${store.name}, seen on AdilabadApp. Link- *${config.frontEndBaseUrl}store/${store.uid}*.please reply...**Message from Adilabad**}`;
														const message = `Hi,${store.owner_name}

${store.name}
Link- ${config.frontEndBaseUrl}store/${store.uid}
Please reply ...

*Message from ${siteTitle}*`
														link = `https://wa.me/${item.value}?text=${encodeURIComponent(message)}`;
														break;
													case 'facebook':
														icon = <AiFillFacebook className='icons' />
														break;
													case 'youtube':
														icon = <AiFillYoutube className='icons' />
														break;
													case 'map':
														icon = <AiFillPushpin className='icons' />
														break;
													case 'instagram':
														icon = <AiFillInstagram className='icons' />
														break;
													case 'website':
														icon = <AiOutlineWifi className='icons' />
														break;
													case 'upi':
														icon = <AiFillDollarCircle className='icons' />;
														return (
															<li key={index} className="social-link-wrapper btn btn-sm btn-primary" style={{ listStyle: 'disc' }}>
																<button onClick={() => {
																	navigator.clipboard.writeText(item.value)
																		.then(() => toast.success(`UPI ID copied to clipboard: ${item.value}`, {
																			position: 'top-center',
																		}))
																		.catch(err => alert('Failed to copy UPI ID. Please try again.'));
																}}>
																	{icon}
																	Copy UPI ID
																	<AiOutlineArrowRight />
																</button>
															</li>
														);
														break
													case 'twitter':
														icon = <AiFillTwitterCircle className='icons' />
														break;

													default:
														link = item.value;
												}

												return (
													<>

														{
															item.type == 'phone' || item.type == 'whatsapp' || item.type == 'mail' ?
																<a href={link} target="_blank" rel="noopener noreferrer" className='social-link' 	>
																	<li key={index} className='social-link-wrapper' style={{ listStyle: 'disc' }} onClick={() => handleContactClick(item.type)}>
																		{icon}
																		<span style={{ color: 'blue' }}>{item.value == 'youtube' ? 'video' : (item.value != 'phone' ? formatPhoneNumber(item.value) : item.value)}</span>
																	</li>
																</a>
																:
																<a href={link} target="_blank" rel="noopener noreferrer" className='social-link '>
																	<li key={index} className='social-link-wrapper btn btn-sm btn-primary' style={{ listStyle: 'disc' }} onClick={() => handleContactClick(item.type)}>
																		<button>
																			{icon}
																			View
																			<AiOutlineArrowRight />
																		</button>
																	</li>
																</a>

														}


													</>
												);
											})}
										</ul>
										<button className='btn btn-danger btn-sm' onClick={handleCloseModal} style={{ width: '100%', marginTop: '10px' }}>Close</button>
									</div>
								</div>
							)}

						</div>

						{
							products && products.length > 0 ?
								<div className="product-list blurry-eff-sm-cards" style={{ display: permissions.product_and_service == '0' ? 'none' : '' }}>
									<div className='title'>
										{
											products && products.length > 0 ? <p className='Products-title'>Products/Services ({products ? products.length : 0})</p> : ''
										}
										{
											products && products.length > 0 ? <Link className='see-more' to={`/product/service/${id}`} onClick={() => handleLeads()}>See all <FaAngleRight /></Link> : ''
										}
									</div>
									<div className="products" ref={listRefProducts}>
										{products && products.length > 0 ? (
											products.map((item, index) => (
												<a
													key={index}
													href={`/product/service/${id}`}
													onClick={() => { handleLeads() }}
													className="product-item"
												>
													<img
														src={item.images && item.images.length > 0
															? config.backEndBaseUrl + item.images[0].path
															: config.backEndBaseUrl + config.placeHolderImage}
														alt={item.name}
													/>
													<span className="product-name">{item.name}</span>
													<div className='ptBx'>
														<p className="pt-discount">
															<LiaRupeeSignSolid /> {item.price}
														</p>
														<p className="pt-discount-amount">
															{item.discount > 0 ? `(${item.discount}% OFF)` : ''}
														</p>
													</div>
												</a>
											))
										) : null}
									</div>

									{
										products && products.length > 0 ? <div className="navigation-buttons">
											<button className="button" onClick={() => handleScrollProducts('left')}><HiArrowNarrowLeft /></button>
											<button className="button" onClick={() => handleScrollProducts('right')}>< HiArrowNarrowRight /></button>
										</div> : ''
									}

								</div>
								: null
						}
						{
							gallery && gallery.length > 0 ? (
								<div className="gallery blurry-eff-sm-cards" style={{ display: permissions.img_gallery == '0' || permissions.img_all == '0' ? 'none' : '' }}>
									<div className="title">
										{gallery && gallery.length > 0 && (
											<>
												<p>Gallery ({gallery.length})</p>
												<Link className="see-more" onClick={() => toggleImage()}>
													See all <FaAngleRight />
												</Link>
											</>
										)}
									</div>
									<div className="gallery-box" ref={listRefGallery} style={{ display: permissions.img_gallery == '0' || permissions.img_all == '0' ? 'none' : '' }}>
										<div className="gallery-images">
											{gallery && gallery.length > 0 ? (
												gallery.map((item, index) => (
													<div
														key={index}
														onClick={() => toggleImage(item.path)} // Pass image path for the selected image
														className="image-show"
													>
														{item.path !== config.placeHolderImage ? (
															<img
																src={`${config.backEndBaseUrl}${item.path}`}
																alt={`Gallery image ${index + 1}`}
															/>
														) : (
															<div className="title-card">
																<span>{item.title || "No Title Available"}</span>
															</div>
														)}
													</div>
												))
											) : null}
										</div>
									</div>

									{gallery && gallery.length > 0 && (
										<div className="navigation-buttons">
											<button className="button" onClick={() => handleScrollGallery("left")}>
												<HiArrowNarrowLeft />
											</button>
											<button className="button" onClick={() => handleScrollGallery("right")}>
												<HiArrowNarrowRight />
											</button>
										</div>
									)}

									{/* Image Viewer Modal */}
									{showImage && (
										<div className="image-showing">
											<div className="slider gallery-slider">
												<Slider {...settings2} initialSlide={currentIndex}>
													{gallery.map((item, index) => (
														<div key={index} className="modal-content">
															{item.path !== "uploads/placeholder/placeholder.jpg" ? (
																<>
																	<Zoom>
																		<img
																			src={`${config.backEndBaseUrl}${item.path}`}
																			alt={`Large view ${index + 1}`}
																			style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
																		/>
																	</Zoom>
																	{item.title && <p className="modal-title">{item.title}</p>}
																</>
															) : (
																<div className="placeholder-title">
																	<p>{item.title || "No Title Available"}</p>
																</div>
															)}
														</div>
													))}
												</Slider>
												<button onClick={() => toggleImage()} className="btn btn-sm btn-danger w-100 p-1">
													Close
												</button>
												<span className="bannerCount galleryCount">
													{currentIndex + 1}/{gallery.length}{" "}
													<span>
														<CiImageOn />
													</span>
												</span>
												<div onClick={() => toggleImage()} className="header-image">
													<AiOutlineClose />
												</div>
											</div>
										</div>
									)}

								</div>
							) : null
						}


						{
							videos && videos.length > 0 ? (
								<div className="video-slider-container" style={{ display: permissions.img_video == '0' && permissions.img_all == '1' ? 'none' : '' }}>
									<p>Watch Video ({videos.length})</p>
									<div
										className={`video-slider ${videos.length === 1 ? "single-video" : "multiple-videos"}`}
									>
										{videos.map((video) => (
											<div key={video.id} className={`video-item ${videos.length === 1 ? "full-cover" : ""}`}>
												<iframe
													width={videos.length === 1 ? "100%" : "100%"}
													height={videos.length === 1 ? "100%" : "150"}
													src={getYoutubeEmbedUrl(video.link)}
													allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
													allowFullScreen
													title={video.title}
												></iframe>
											</div>
										))}
									</div>
								</div>
							) : null
						}



						<div className="opening-hours">
							{time && time.length > 0 ? (
								<h5 onClick={toggleDropdown} style={{ fontSize: '16px' }}>
									<AiOutlineClockCircle /> Timing:
									<span style={{ marginLeft: '5px', color: checkStoreStatus(time).includes('Open') ? 'green' : checkStoreStatus(time) === '24 Hours' ? 'blue' : 'red' }}>
										{checkStoreStatus(time)}
									</span>
									{isDropdownOpen ? '▲' : '▼'}
								</h5>
							) : ''}


							{isDropdownOpen && (
								<ul className="opening-hours-list">
									{time && time.length > 0
										? time
											.sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day))
											.map((item, index) => {
												const isOpen = isOpenNow(item.from_time, item.to_time);
												if (item.status == 1) {
													return (
														<li key={index}>
															<strong>{item.day} :</strong>
															<span>
																<span style={{ marginRight: '10px' }}>
																	<span style={{ color: isOpen ? 'green' : 'red' }}>
																		{isOpen ? 'Open' : 'Closed'}
																	</span>
																</span>
																<b>{convertTo12HourFormat(item.from_time)}</b> - <b>{convertTo12HourFormat(item.to_time)}</b> {' '}
															</span>
														</li>
													);
												}
											})
										: null}
								</ul>
							)}
							<div dangerouslySetInnerHTML={{
								__html: isLongExpended
									? store.long_desc
									: (store.long_desc ? StoreDefault4LineDes2 + (desLenghtCheck1 >= 22 ? '...' : '') : StoreDefault4LineDes2)
							}} style={{ display: permissions.store_details == '0' ? 'none' : '' }}></div>

							{store.long_desc && desLenghtCheck2 >= 27 && (
								<span className='view-des-btn' onClick={toggleLongDes}>
									{isLongExpended ? 'Read Less ▲' : 'Read More...▼'}
								</span>
							)}


							<div className='store-create'>
								<span className='store-listing'><LuCalendarClock /> Listed on: <span className='time'>{CreateAt}</span></span>
								<span className='store-listing'><LuCalendarClock /> last  Update: <span className='time' >{getTimeSince(UpdatedAt)}</span></span>
							</div>
						</div>
					</div>


					{
						storeList.length > 0 && permissions.similar_stores == '1'
							?
							<div className="similar-store-wrap">
								<div className="heading">
									<h4>View Similar</h4>
									<Link to={`/stores/view/${cat_id}`} className='see-all'>See all <FaAngleRight /></Link>
								</div>
								{loadingStores ? (
									<div className='loading-container'>
										<Spinner animation="border" />
									</div>
								) : error ? (
									<div className='error-container'>
										<p>{error}</p>
									</div>
								) : storeList.length == 0 ? (
									<div className='no-data-container'>
										<p>No stores found.</p>
									</div>
								) : (
									<>
										<div className='sub-category-wrapper'>
											<div className='sub-category-inner'>
												{storeList.slice(0, 4).map((store, i) => (
													<div className='sub-category-card'>
														<StoreViewCard store={store} key={i} saved={savedStores} categoryId={cat_id} />
													</div>
												))}
												{/* Only show EnquiryCard if there are 4 or more filtered stores */}
												{storeList.length >= 4 && <EnquiryCard />}
												{storeList.slice(4).map((store, i) => (
													<StoreViewCard store={store} key={i + 3} saved={savedStores} categoryId={cat_id} />
												))}
											</div>
										</div>
										{/* Modify sub-category for desktop screen layout */}
										<div className='sub-category-desktop-only'>
											<div className='card1-container'>
												{storeList.slice(0, 4).map((store, i) => (
													<StoreViewCard store={store} key={i} saved={savedStores} categoryId={cat_id} />
												))}
												{storeList.slice(4).map((store, i) => (
													<StoreViewCard store={store} key={i + 3} saved={savedStores} categoryId={cat_id} />
												))}
											</div>
											<div className='enquiry-card-container'>
												{/* Only show EnquiryCard if there are 4 or more filtered stores */}
												{storeList && storeList.length >= 4 ? <EnquiryCard /> : ''}
											</div>
										</div>
									</>
								)}
							</div>
							:
							''


					}

					{/* Similar store section end */}

				</div>

			</div >
			<Comments isShown={showComments} onClose={handleToggleComments} comments={comments} averageRating={avgComment} />
		</>
	);
};

export default StoreDetail;