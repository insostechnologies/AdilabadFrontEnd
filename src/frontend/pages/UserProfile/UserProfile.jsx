import React, { useRef, useState, useEffect } from 'react';
import './UserProfile.css';
import './mediaQuery.css';
import MobileHeader from '../../components/MobileHeader/MobileHeader.jsx';
import image from '../../components/Assets/Images/card2.png';
import { sub_category_data } from '../../../ftdSubCatData.js';
import { IoCartOutline } from 'react-icons/io5';
import { HiArrowNarrowLeft, HiArrowNarrowRight } from 'react-icons/hi';
import SaveCard from '../../components/SaveCard/SaveCard.jsx';
import { BsFillPersonXFill } from "react-icons/bs";
import { BsCardText } from "react-icons/bs";
import { BsFillStarFill } from "react-icons/bs";
import { TiDelete } from "react-icons/ti";
import { BsShareFill } from "react-icons/bs";
import { GoPeople } from "react-icons/go";
import { GoListUnordered } from "react-icons/go";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { config } from '../../../config.js';
import { readFileAsBase64 } from '../../../utils/fileHandle'
import { AiFillCopyrightCircle } from "react-icons/ai";
import { formatPhoneNumber } from '../../../utils/helper.jsx';




const UserProfile = () => {
	const listRefHistory = useRef(null);
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [photo, setPhoto] = useState('');
	const [localArea, setLocalArea] = useState('');
	const [saveStores, setSaveStores] = useState([]);
	const [followStores, setFollowStores] = useState([]);
	const [city, setCity] = useState('');
	const [state, setState] = useState('');
	const [landMark, setLandMark] = useState('');
	const [pincode, setPincode] = useState('');
	const [show, setShow] = useState(false);
	const [path, setPath] = useState('')
	const [gender, setGender] = useState('')
	const [socialDetails, setSocialDetails] = useState([])
	const [showShareModal, setShowShareModal] = useState(false);
	const [showListModal, setShowListModal] = useState(false);
	const [showShareAppModal, setShowShareAppModal] = useState(false);
	const [showServiceModel, setShowServiceModel] = useState(false);
	const [vendorSeo, setVendorSeo] = useState({});
	const toggleShareModal = () => setShowShareModal(!showShareModal);
	const toggleListModal = () => setShowListModal(!showListModal);
	const toggleAppShareModal = () => setShowShareAppModal(!showShareAppModal);
	const toggleServiceModel = () => setShowServiceModel(!showServiceModel);


	let uid = '8bf0589fef541a20'

	const fetchAdmin = async (uid) => {
		try {
			console.log(`Fetching admin data for UID: ${uid}`); // Debug log
			const response = await fetch(`${config.backEndBaseUrl}api/user/${uid}?q=v`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			console.log('Admin data fetched:', result); // Debug log

			if (result.status) {
				setVendorSeo(result?.data?.seoVendorDetails);
			} else {
				console.log('Internal server error');
			}

		} catch (error) {
			console.error('Error fetching admin data:', error);
		}
	}

	const user_id = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).uid : '';

	const handleFileChange = async (e) => {
		const selectedFile = e.target.files[0];
		if (selectedFile) {
			try {
				const base64 = await readFileAsBase64(selectedFile);
				setPhoto(base64); // Store the base64 representation of the image
			} catch (error) {
				console.error('Error reading file:', error);
			}
		} else {
			setPhoto('');
		}
	};

	const handleLogout = () => {
		localStorage.removeItem('userAuthToken')
		localStorage.removeItem('user')
		window.location.href = '/';
	}



	const fetchSaveStores = async () => {
		try {
			const response = await fetch(`${config.backEndBaseUrl}api/user/stores/list/${user_id}`, {
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
				// Sort by created_at in descending order (recent first)
				const sortedStores = result.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
				setSaveStores(sortedStores);
			}
		} catch (error) {
			console.error('Fetching stores failed', error);
		}
	};


	const fetchFollowedStores = async () => {
		try {
			const response = await fetch(`${config.backEndBaseUrl}api/user/stores/followes/${user_id}`, {
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
				// Sort by created_at in descending order (recent first)
				const sortedStores = result.stores.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
				setFollowStores(sortedStores);
			}
		} catch (error) {
			console.error('Fetching stores failed', error);
		}
	};


	// Handle form submission
	const handleSubmit = async (event) => {
		event.preventDefault();

		const profileData = {
			name,
			phone,
			localArea,
			city,
			landMark,
			state,
			pincode,
			gender
		};

		if (photo) {
			profileData.file = photo
		} else {
			profileData.path = path
		}

		try {
			const response = await fetch(`${config.backEndBaseUrl}api/user/update/details/${user_id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(profileData),
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const result = await response.json();
			if (result.status) {
				toast.success('Profile updated successfully', {
					position: 'top-center',
				});
			}
			fetchUser(user_id)
			handleClose();
		} catch (error) {
			console.error('Error updating profile:', error);
		}
	};
	useEffect(() => {
		fetchSaveStores();
		fetchFollowedStores();
	}, []);


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
				setLocalArea(user.address.area)
				setCity(user.address.city)
				setState(user.address.state)
				setPincode(user.address.pin)
				setPath(user.profile_image)
				setGender(user.gender)
				setLandMark(user.address.landmark)
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}

	useEffect(() => {
		fetchUser(user_id)
	}, [user_id])

	// query form modal
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);


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
		}
	};

	const getSocialLink = (type) => socialDetails.find(detail => detail.type === type)?.value;

	useEffect(() => {
		fetchSiteDetails();
		if (uid) {
			fetchAdmin(uid);
		}
	}, [uid]);
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






	return (
		<div className='profile'>
			<MobileHeader title={'Profile'} />

			<div className='body-profile' >
				<div className='profile-card' onClick={handleShow}>
					<div className='details'>
						<p className='pf-detail'>Name = {name}</p>
						<p className='pf-detail'>Phone = {phone}</p>
						<p className='pf-detail'>Address = {localArea}, {city}, {state} pin: {pincode}</p>
					</div>
					<div>
						<div className='profile-pic'>
							<img src={path != '' ? `${config.backEndBaseUrl}${path}` : image} alt='' />
						</div>
					</div>
					<button onClick={handleShow} className='pf-edit-btn'>Edit Profile</button>
				</div>
				{/* Modal */}
				<Modal show={show} onHide={handleClose} centered>
					<Modal.Header closeButton>
						<Modal.Title className="modal-title-custom">Profile Update</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<form>
							{/* Display current profile picture if available */}
							{path && (
								<>
									<p>profile picture</p>
									<div className="current-profile-pic">
										<img
											src={`${config.backEndBaseUrl}${path}`}
											alt="Current Profile"
											className="profile-img-preview"
										/>
									</div>
								</>
							)}

							{/* Allow file upload */}

							<input
								className="input-area-custom"
								type="file"
								accept="image/*"
								onChange={handleFileChange}
							/>
							{/* Other fields */}
							<input
								value={name}
								className="input-area-custom"
								type="text"
								placeholder="Enter your name"
								onChange={(e) => setName(e.target.value)}
							/>
							<input
								value={phone}
								className="input-area-custom"
								type="number"
								placeholder="Enter your phone no."
								readOnly
								onChange={(e) => setPhone(e.target.value)}
							/>
							<input
								value={localArea}
								className="input-area-custom"
								placeholder="Enter local area"
								onChange={(e) => setLocalArea(e.target.value)}
							/>
							<input
								value={landMark}
								className="input-area-custom"
								placeholder="Enter Landmark"
								onChange={(e) => setLandMark(e.target.value)}
							/>
							<input
								value={city}
								className="input-area-custom"
								placeholder="Enter your city"
								onChange={(e) => setCity(e.target.value)}
							/>
							<input
								value={state}
								className="input-area-custom"
								placeholder="Enter your state"
								onChange={(e) => setState(e.target.value)}
							/>
							<input
								value={pincode}
								className="input-area-custom"
								type="number"
								placeholder="Enter area pin code"
								onChange={(e) => setPincode(e.target.value)}
							/>

							{/* Gender Selection */}
							<div className="gender-container">
								<label>
									<input
										type="radio"
										value="male"
										checked={gender === "male"}
										onChange={(e) => setGender(e.target.value)}
									/>
									Male
								</label>
								<label>
									<input
										type="radio"
										value="female"
										checked={gender === "female"}
										onChange={(e) => setGender(e.target.value)}
									/>
									Female
								</label>
							</div>
						</form>
					</Modal.Body>
					<Modal.Footer>
						<Button className='pf-edit-btn-modal' onClick={handleSubmit}>Save</Button>
					</Modal.Footer>
				</Modal>
				{/* modal end */}

				{
					saveStores.length ? <SaveCard storeData={saveStores} setStoreData={setSaveStores} /> : ''
				}

				{
					followStores.length ? <SaveCard storeData={followStores} follow={true} /> : ''
				}



				<Link to={'/order/history'}>
					<div className='my-order-history list-profile'>
						<IoCartOutline className='icon' />
						<p>
							My Order History {'>>'}
						</p>
					</div>
				</Link>

				<div className='list-profile-wrapper'>
					<div className='list-profile list-profile-shadow' onClick={toggleListModal}>
						<GoListUnordered className='icon' />
						<p>
							List My Business {'>>'}
						</p>
					</div>
					<div className='list-profile list-profile-shadow' onClick={toggleServiceModel}>
						<GoPeople className='icon' />
						<p>
							Customer Service {'>>'}
						</p>
					</div>
					<Link className='list-profile list-profile-shadow' to={'/terms'}>
						<AiFillCopyrightCircle className='icon' />
						<p>
							Terms & Conditions {'>>'}
						</p>
					</Link>
					<div className='list-profile list-profile-shadow' onClick={toggleAppShareModal}>
						<BsShareFill className='icon' />
						<p>
							Share the App {'>>'}
						</p>
					</div>
					<div className='list-profile list-profile-shadow' onClick={toggleShareModal}>
						<BsFillStarFill className='icon' />
						<p>
							Rate Us {'>>'}
						</p>
					</div>
					<Link className='list-profile list-profile-shadow' to={'/about'}>
						<BsCardText className='icon' />
						<p>
							About Us {'>>'}
						</p>
					</Link>
					<div className='list-profile list-profile-shadow' onClick={() => handleLogout()}>
						{/* <IoCartOutline className='icon' /> */}
						<BsFillPersonXFill className='icon' />

						<p>
							Logout
						</p>
					</div>
				</div>
			</div>
			{showShareModal && (
				<div className="modal-overlay" onClick={toggleShareModal}>
					<div className="modal-content" onClick={(e) => e.stopPropagation()}>
						{/* Modal Content */}
						<div className="btnBx">
							{getSocialLink('playstore') && (

								<button
									onClick={() => { window.location.href = getSocialLink('playstore') }}
								>
									<img
										src={'https://cdn-icons-png.flaticon.com/512/732/732208.png'}
										alt="Play Store"
										className="contact-icon"
									/>
									Play Store
								</button>
							)}
							{getSocialLink('appstore') && (

								<button
									onClick={() => { window.location.href = getSocialLink('appstore') }}
								>
									<img
										src={'https://cdn.prod.website-files.com/5e3b3ad7af6930fad8539619/5f2890f2688f1156c5b8da7e_appstore.png'}
										alt="App Store"
										className="contact-icon"
									/>
									App Store
								</button>
							)}
						</div>
						<button onClick={toggleShareModal} className="close-button">Close</button>
					</div>
				</div>
			)}
			{showListModal && (
				<div className="modal-overlay" onClick={toggleListModal}>
					<div className="modal-content" onClick={(e) => e.stopPropagation()}>
						{/* Modal Content */}
						<div className="btnBx">
							<button
								onClick={() => {
									const url = vendorSeo?.play_store_link?.startsWith("http")
										? vendorSeo.play_store_link
										: `https://${vendorSeo?.play_store_link}`;

									window.location.href = url;
								}}
							>
								<img
									src={'https://cdn-icons-png.flaticon.com/512/732/732208.png'}
									alt="Play Store"
									className="contact-icon"
								/>
								Play Store
							</button>

							<button
								onClick={() => {
									const url = vendorSeo?.app_store_link?.startsWith("http")
										? vendorSeo.app_store_link
										: `https://${vendorSeo?.app_store_link}`;

									window.location.href = url;
								}}
							>
								<img
									src={'https://cdn.prod.website-files.com/5e3b3ad7af6930fad8539619/5f2890f2688f1156c5b8da7e_appstore.png'}
									alt="App Store"
									className="contact-icon"
								/>
								App Store
							</button>

						</div>
						<button onClick={toggleListModal} className="close-button">Close</button>
					</div>
				</div>
			)}

			{showShareAppModal && (
				<div className="modal-overlay" onClick={toggleAppShareModal}>
					<div className="modal-content" onClick={(e) => e.stopPropagation()}>
						{/* Modal Content */}
						<div className="btnBx">
							{getSocialLink('playstore') && (

								<button
									onClick={() => handleLinkShare(getSocialLink('playstore'))}
								>
									<img
										src={'https://cdn-icons-png.flaticon.com/512/732/732208.png'}
										alt="Play Store"
										className="contact-icon"
									/>
									Play Store
								</button>
							)}
							{getSocialLink('appstore') && (

								<button
									onClick={() => handleLinkShare(getSocialLink('appstore'))}
								>
									<img
										src={'https://cdn.prod.website-files.com/5e3b3ad7af6930fad8539619/5f2890f2688f1156c5b8da7e_appstore.png'}
										alt="App Store"
										className="contact-icon"
									/>
									App Store
								</button>
							)}
							{getSocialLink('websiter') && (
								<button
									onClick={() => handleLinkShare(getSocialLink('websiter'))}>
									<img
										src={'https://cdn-icons-png.flaticon.com/512/5339/5339184.png'}
										alt="Share Website"
										className="contact-icon"
									/>
									Website
								</button>

							)}
						</div>
						<button onClick={toggleAppShareModal} className="close-button">Close</button>
					</div>
				</div>
			)}

			{(showServiceModel && getSocialLink('whatsapp') && getSocialLink('call')) && (
				<div className="modal-overlay" onClick={toggleServiceModel}>
					<div className="modal-content" onClick={(e) => e.stopPropagation()}>
						{/* <h3>Contact Options</h3> */}
						<div className='btnBx'>
							{getSocialLink('whatsapp') && (
								<button onClick={() => window.open(`https://wa.me/${formatPhoneNumber(getSocialLink('whatsapp'))}`, '_blank')}>
									<img src={'https://cdn3.iconfinder.com/data/icons/social-media-chamfered-corner/154/whatsapp-512.png'} alt="WhatsApp" className="contact-icon" />
									WhatsApp
								</button>
							)}
							{getSocialLink('call') && (
								<button onClick={() => window.location.href = `tel:+${formatPhoneNumber(getSocialLink('call'))}`}>
									<img src={'https://i.pinimg.com/originals/8e/a0/83/8ea08365d331d8ae9bd93ba5f50528d4.png'} alt="Call" className="contact-icon" />
									Call
								</button>
							)}
						</div>
						<button onClick={toggleServiceModel} className="close-button">Close</button>
					</div>
				</div>
			)}



		</div>
	);
};

export default UserProfile;
