import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import './VendorSignUp.css';
import brand_logo from '../../components/Assets/Images/brand_logo.png';
import image from '../../components/Assets/Images/image.png';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { config } from "../../../config";
import contact_call_png from '../../components/Assets/Images/contact_call_png.png';
import whatsapp_pnp from '../../components/Assets/Images/whatsapp_pnp.png';
import { formatPhoneNumber } from '../../../utils/helper'


const VendorSignUp = () => {
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [storeName, setStoreName] = useState('')
    const [loading, setLoading] = useState(false); // Loading state
    const [logo, setLogo] = useState('')
    const [siteDetails, setSiteDetails] = useState(null);
    const [vendorDetails, setVendorDetails] = useState(null)

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
        fetchSiteDetails();
        fetchAdmin()
    }, []);
    const socialDetails = siteDetails?.socialDetails || [];
    const getSocialLink = (type) => socialDetails.find(detail => detail.type === type)?.value;



    const validateInputs = () => {
        if (!username) {
            toast.error("Owner Name is required");
            return false;
        }
        if (!storeName) {
            toast.error("Business Name is required");
            return false;
        }
        if (!/^\d{10}$/.test(phoneNumber)) {
            toast.error("Phone number must be 10 digits");
            return false;
        }
        return true;
    };
    const navigate = useNavigate();
    const handleSignup = async (e) => {
        e.preventDefault(); // Prevent the default form submission
        setLoading(true); // Set loading to true

        if (!validateInputs()) {
            setLoading(false); // Reset loading state if validation fails
            return;
        }

        const userData = {
            name: username,
            phone: phoneNumber,
            storeName: storeName,
        };

        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/vendor/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();

            if (result.status) {
                toast.success('Account Created! Now Verify Otp', {
                    position: 'top-center',
                });
                navigate(`/vendor/verify-otp/${result.data.user_id}?n=${phoneNumber}`)

            } else {
                console.log(result);
                toast.error("Signup failed: " + result.message || "Internal Server Error", {
                    position: 'top-center',
                });
            }

        } catch (error) {
            console.log(error);
            toast.error("Signup failed: " + error.message, {
                position: 'top-center',
            });
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    const handleLoginRedirect = () => {
        window.location.href = config.frontEndBaseUrl + 'vendor/login';
    };

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
                            <p>Get Started By Adding Your Business / Store</p>
                            <form>
                                <input
                                    type="text"
                                    placeholder="Enter Business / Store Name"
                                    value={storeName}
                                    onChange={(e) => setStoreName(e.target.value)}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Enter Owner Name"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Enter Phone Number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    required
                                />
                                <div className="login-center-options">
                                    <div className="remember-div">
                                        <input type="checkbox" id="remember-checkbox" checked />
                                        <label htmlFor="remember-checkbox" className="remember-checkbox">
                                            By Adding Your Business, You agree to our T&C & Privacy Policy
                                        </label>
                                    </div>
                                </div>
                                <div className="login-center-buttons">
                                    <button type="button" onClick={handleSignup} disabled={loading}>
                                        {loading ? "Loading..." : "Add Business"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <p className="login-bottom-p">
                            Already have an account? <span className="text-danger" onClick={handleLoginRedirect}>Login</span>
                        </p>
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

export default VendorSignUp;