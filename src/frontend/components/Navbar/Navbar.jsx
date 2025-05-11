import React, { useEffect, useState } from 'react';
import './navbar.css';
import { Link, NavLink } from 'react-router-dom';
import home from '../Assets/icons/Home.svg';
import notification from '../Assets/icons/Notification.svg';
import order from '../Assets/icons/MyOrders.svg';
import profile from '../Assets/icons/MyProfile.svg';
import profile_img from '../Assets/Images/profile_img.png';
import { config } from '../../../config';

function Navbar() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [logo, setLogo] = useState('');
	const [title, setTitle] = useState('');
	const [loading, setLoading] = useState(true); // Loading state for logo
	const [newNotifications, setNewNotifications] = useState(false); // Track new notifications
	const user_id = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).uid : '';

	const fetchNotificationsFromAPI = async () => {
		try {
			const response = await fetch(`${config.backEndBaseUrl}api/user/notifications/${user_id}`, {
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
				setNewNotifications(true);
			}
		} catch (error) {
			console.error('Fetching notifications failed', error);
		}
	};

	const fetchSiteDetails = async (uid) => {
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
				const logoUrl = result.data.seoDetails.logo
					? config.backEndBaseUrl + result.data.seoDetails.logo
					: config.backEndBaseUrl + config.placeHolderImage;
				setLogo(logoUrl);
				setTitle(result.data.seoDetails.name);
			} else {
				console.log('Internal server error');
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchSiteDetails();
		fetchNotificationsFromAPI(); // Fetch notifications when component loads
	}, []);

	useEffect(() => {
		window.onscroll = () => {
			setIsScrolled(window.scrollY === 0 ? false : true);
		};
		return () => {
			window.onscroll = null;
		};
	}, []);

	return (
		<header className={`${'desktop_mobile_navbar'} ${isScrolled ? 'onScroll' : ''}`} id="desktop_mobile_navbar">
			{/* DESKTOP NAVBAR */}
			<nav className="desktop_navbar">
				<div>
					<Link to="/" className="brand_logo header_brand_logo">
						<div className="brand">
							{loading ? (
								<img src={config.backEndBaseUrl + config.placeHolderImage} className="brand_logo" alt="brand_logo" />
							) : (
								<img src={logo} className="brand_logo" alt="brand_logo" />
							)}
							<span>{title}</span>
						</div>
					</Link>
				</div>

				<div className="nav__menu">
					<ul className="nav__list">
						<li className="nav__item">
							<NavLink to="/" className="nav__link">
								<img src={home} className="nav_logo" alt='nav_logo' />
								<span>Home</span>
							</NavLink>
						</li>
						<li className="nav__item">
							<NavLink to="/notifications" className="nav__link" onClick={() => setNewNotifications(false)}>
								<img src={notification} className="nav_logo" alt='nav_logo' />
								<div className='Notification'>
									<span>Notification</span>
									{newNotifications && <span className="badge">New</span>} {/* Badge display */}
								</div>
							</NavLink>
						</li>
						<li className="nav__item">
							<NavLink to="/stores/view/:id" className="nav__link">
								<span className='desktop_only'>Store</span>
							</NavLink>
						</li>
						<li className="nav__item">
							<NavLink to="/all-categories" className="nav__link">
								<span className='desktop_only'>Category</span>
							</NavLink>
						</li>
					</ul>
				</div>

				<div className='contact_btn'>
					<button>Contact Us</button>
				</div>

				<div>
					<Link to="/profile">
						<img src={profile_img} className="profile_img" alt="profile_img" />
					</Link>
				</div>
			</nav>

			{/* MOBILE NAVBAR */}
			<nav className="mobile_navbar">
				<div className="nav__menu">
					<ul className="nav__list">
						<li className="nav__item">
							<NavLink to="/" className="nav__link">
								<img src={home} className="nav_logo" alt='nav_logo' />
								<span>Home</span>
							</NavLink>
						</li>
						<li className="nav__item">
							<NavLink
								to="/notifications"
								className="nav__link"
								onClick={() => setNewNotifications(false)}
							>
								{newNotifications && <span className="badgeNoti">new</span>}
								<img src={notification} className="nav_logo notification_logo" alt="nav_logo" />
								<div className="Notification">
									<span>Notification</span>
								</div>
							</NavLink>
						</li>

						<li className="nav__item">
							<NavLink to="/order/history" className="nav__link">
								<img src={order} className="nav_logo" alt='nav_logo' />
								<span className="mob_only">My Orders</span>
							</NavLink>
						</li>
						<li className="nav__item">
							<NavLink to="/profile" className="nav__link">
								<img src={profile} className="nav_logo" alt='nav_logo' />
								<span className="mob_only">My Profile</span>
							</NavLink>
						</li>
					</ul>
				</div>
			</nav>
		</header>
	);
}

export default Navbar;
