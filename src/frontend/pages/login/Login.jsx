import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import './login.css';
import { config } from '../../../config';
import brand_logo from '../../components/Assets/Images/brand_logo.png';
import image from '../../components/Assets/Images/image.png';
import { useNavigate } from 'react-router-dom';
import { formatPhoneNumber } from '../../../utils/helper'
import contact_call_png from '../../components/Assets/Images/contact_call_png.png';
import whatsapp_pnp from '../../components/Assets/Images/whatsapp_pnp.png';

const Login = () => {
    const [userData, setUserData] = useState({
        "phoneNumber": "", // Changed to phoneNumber
    });
    const [loading, setLoading] = useState(false); // State for loading
    const navigate = useNavigate();
    const [userSeoDetails, setUserSeoDetails] = useState(null)
    const [siteDetails, setSiteDetails] = useState(null);

    const onChange = (event) => {
        setUserData({ ...userData, [event.target.name]: event.target.value });
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!/^\d{10}$/.test(userData.phoneNumber)) {
            toast.error("Phone number must be 10 digits");
            return false;
        }
        setLoading(true); // Set loading to true when the request starts
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/sign-in`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "phoneNumber": userData.phoneNumber,
                    "type": 'user'
                })
            });
            const json = await response.json();
            if (json.status) {
                console.log(json);
                localStorage.setItem('tempNumber', userData.phoneNumber)

                let data = json.data;
                if (data.type === 'oldUser') {
                    navigate(`/sign-in/verify-otp/${data.user.uid}?s=o`)
                } else {
                    navigate(`/sign-in/verify-otp/${data.user_id}?s=n`)
                }

                // console.log(data)



                // Uncomment and implement the following lines as needed
                // let user = json.data.user;
                // let token = json.data.token;
                // localStorage.setItem('userAuthToken', token);
                // localStorage.setItem('user', JSON.stringify(user));
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
    const socialDetails = siteDetails?.socialDetails || [];

    // Helper to get the social link value
    const getSocialLink = (type) => socialDetails.find(detail => detail.type === type)?.value || '';

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
                setUserSeoDetails(result.data.seoDetails)
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
                            <img src={`${config.backEndBaseUrl}${userSeoDetails?.logo}`} alt="logo" />
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
                                        {loading ? "Signing In..." : "Sign In"}
                                    </button>
                                </div>
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

export default Login;