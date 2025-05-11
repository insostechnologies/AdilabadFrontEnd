import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { config } from '../../../config';
import { AdminSidebarContext } from '../../../context/adminSidebarContext';
import { useContext } from 'react';
import './Navbar.css';

function Header() {
	const navigate = useNavigate();
	const [userData, setUserData] = useState(null);
	const { frontEndBaseUrl } = config;
	const { toggle, isSidebar } = useContext(AdminSidebarContext);
	const [logo, setLogo] = useState('');
	const [userImage, setUserImage] = useState('');
	const [visible, setVisible] = useState(false);
	const dropdownRef = useRef(null);

	const handleLogout = () => {
		localStorage.removeItem('adminUserId');
		localStorage.removeItem('adminAuthToken');
		window.location.href = '/admin';
	};

	let uid = localStorage.getItem('adminUserId');
	const fetchAdmin = async (uid) => {
		try {
			const response = await fetch(`${config.backEndBaseUrl}api/user/${uid}`, {
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
				setUserData(result.data);
				setLogo(
					result.data.seoDetails.logo === ''
						? config.backEndBaseUrl + config.placeHolderImage
						: config.backEndBaseUrl + result.data.seoDetails.logo || ''
				);
				setUserImage(
					result.data.profile_image === ''
						? config.backEndBaseUrl + config.placeHolderImage
						: config.backEndBaseUrl + result.data.profile_image || ''
				);
			} else {
				console.log('Internal server error');
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	useEffect(() => {
		fetchAdmin(uid);
	}, [uid]);

	// Handle clicks outside of the dropdown
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setVisible(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<>
			<div className="header-dashboard" style={{ width: isSidebar ? 'calc(100% - 280px)' : '100%' }}>
				<div className="wrap">
					<div className="header-left">
						<Link to="/admin/home" style={{ display: isSidebar ? 'none' : 'block' }}>
							<img className="" id="logo_header_mobile" alt="logo_header" src={`${logo}`} />
						</Link>
						<div className="button-show-hide" style={{ display: isSidebar ? 'none' : 'block' }} onClick={toggle}>
							<i className="icon-menu-left"></i>
						</div>
					</div>

					<div className="header-grid">
						<div className="popup-wrap user type-header" ref={dropdownRef}>
							<div className="dropdown">
								<button
									className="btn btn-secondary dropdown-toggle"
									type="button"
									onClick={() => setVisible(!visible)}
								>
									<span className="header-user wg-user">
										<span className="image">
											<img src={`${userImage}`} className="userImage" alt="avatar_img" />
										</span>
										<span className="flex flex-column">
											<span className="body-title mb-2">Admin</span>
										</span>
									</span>
								</button>
								<ul className="dropdown-menu dropdown-menu-end has-content" style={{ display: visible ? 'flex' : 'none' }} id="drop_menu">
									<li>
										<Link to="setting" className="user-item" onClick={() => setVisible(!visible)}>
											<div className="icon">
												<i className="icon-user"></i>
											</div>
											<div className="body-title-2">Setting</div>
										</Link>
									</li>
									<li>
										<Link to="" className="user-item" onClick={() => { handleLogout()}}>
											<div className="icon">
												<i className="icon-log-out"></i>
											</div>
											<div className="body-title-2">Log out</div>
										</Link>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Header;
