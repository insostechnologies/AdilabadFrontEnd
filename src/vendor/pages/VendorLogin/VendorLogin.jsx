import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import './AdminLogin.css'
import { config } from '../../../config'
import image from '../../components/Assets/Images/image.png';
import contact_call_png from '../../components/Assets/Images/contact_call_png.png';
import whatsapp_pnp from '../../components/Assets/Images/whatsapp_pnp.png';
import { formatPhoneNumber } from '../../../utils/helper'


const VendorLogin = () => {
	const [siteDetails, setSiteDetails] = useState(null);
	const [loading, setLoading] = useState(false);
	const [logo, setLogo] = useState('')
	const [vendorDetails, setVendorDetails] = useState(null)

	const [userData, setUserData] = useState({
		"phoneNumber": "",
	});
	const navigate = useNavigate();
	const onChange = (event) => {
		setUserData({ ...userData, [event.target.name]: event.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!/^\d{10}$/.test(userData.phoneNumber)) {
			toast.error("Phone number must be 10 digits");
			return false;
		}
		setLoading(true);
		try {
			const response = await fetch(`${config.backEndBaseUrl}api/user/sign-in`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					"phoneNumber": userData.phoneNumber,
					"type": 'vendor'
				})
			});
			const json = await response.json();
			if (json.status) {
				if (json.data.type == "newUser") {
					toast.error('Wrong Phone Number', {
						position: 'top-center',
					});
				} else {
					localStorage.setItem('tempNumber', userData.phoneNumber)
					navigate(`/vendor/verify-otp/${json.data.user.uid}?n=${userData.phoneNumber}`)
				}
			} else {
				console.log('Login failed:', json.message); // Debug log
				toast.error('Wrong Phone Number', {
					position: 'top-center',
				});
			}
		} catch (err) {
			console.log(err);
			toast.error('An error occurred. Please try again.', {
				position: 'top-center',
			});
		} finally {
			setLoading(false); // Set loading to false when the request completes
		}
	}

	const handleSignUpRedirect = () => {
		window.location.href = config.frontEndBaseUrl + 'vendor/sing-up';
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
				setSiteDetails(result.data);
				setLogo(config.backEndBaseUrl + result.data.seoDetails.logo)
			} else {
				console.log('Internal server error');
			}

		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	useEffect(() => {
		fetchSiteDetails();
	}, []);
	const socialDetails = siteDetails?.socialDetails || [];

	// Helper to get the social link value
	const getSocialLink = (type) => {
		const value = socialDetails.find(detail => detail.type === type)?.value || '';
		if (!value) return '';
		if (value.startsWith('+91')) {
			return value; // Already has the correct format
		} else if (value.startsWith('91')) {
			return `+${value}`; // Add "+" if only "91" exists
		} else {
			return `+91${value}`; // Prepend "+91" if missing
		}
	};
	const fetchAdmin = async () => {
		try {

			// Send the request
			const response = await fetch(`${config.backEndBaseUrl}api/user/${'8bf0589fef541a20'}?q=v`, {
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
				setVendorDetails(result.data.seoVendorDetails)
			} else {
				console.log('internal server error')
			}

		} catch (error) {
			console.error('Error update data:', error);
		}
	}

	useEffect(() => {
		fetchAdmin()
	}, [])

	return (
		<>
			<ToastContainer />
			<div className="login-main">
				<div className="login-left">
					<img src={image} alt="img" />
				</div>
				<div className="login-right">
					<div className="login-right-container">
						<div className="login-logo">
							<img src={`${config.backEndBaseUrl}${vendorDetails?.logo}`} alt="logo" />
						</div>
						<div className="login-center">
							<h2>Login</h2>
							<p>Please Enter Your Phone Number</p>
							<form onSubmit={handleSubmit}>
								<input
									type="text"
									placeholder="Phone Number"
									required
									name="phoneNumber"
									value={userData.phoneNumber}
									onChange={onChange}
								/>
								{/* Password input can be added here if needed */}
								<div className="login-center-buttons">
									<button type="submit" disabled={loading}>
										{loading ? "Verifying..." : "Verify"}
									</button>
								</div>
								<button type="button" className="btn btn-lg signUpBtn" onClick={handleSignUpRedirect}>
									New User ? <span className="text-danger">Sign Up</span>
								</button>
							</form>
						</div>
						<div className='helpCon'>
							<h4>Need Help ?</h4>
							<p>
								Contact Us :
								<div className='social'>
									<a href={`tel:${formatPhoneNumber(getSocialLink('call'))}`}><img src={contact_call_png} className='call_icon' alt="call_icon" /></a>
									<a href={`https://wa.me/${formatPhoneNumber(getSocialLink('whatsapp'))}`}><img src={whatsapp_pnp} alt="whatsapp_icon" /></a>
								</div>
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default VendorLogin;