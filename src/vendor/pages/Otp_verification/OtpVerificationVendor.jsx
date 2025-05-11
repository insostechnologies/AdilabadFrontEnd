import React, { useEffect, useRef, useState } from 'react';
import "./otpVerification.css";
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import Toast for notifications
import { config } from "../../../config"; // Assuming you have a config file for your API base URL
import 'react-toastify/dist/ReactToastify.css';
import contact_call_png from '../../components/Assets/Images/contact_call_png.png';
import whatsapp_pnp from '../../components/Assets/Images/whatsapp_pnp.png';
import { useLocation } from 'react-router-dom';
import { formatPhoneNumber } from '../../../utils/helper'

function OtpVerificationVendor() {

    const [siteDetails, setSiteDetails] = useState(null);
    const [counter, setCounter] = useState(30); // Counter state for resend OTP
    const location = useLocation();

    // Parse the query string
    const queryParams = new URLSearchParams(location.search);

    // Get the `n` parameter
    const n = queryParams.get('n');

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
    const socialDetails = siteDetails?.socialDetails || [];

    // Helper to get the social link value
    const getSocialLink = (type) => socialDetails.find(detail => detail.type === type)?.value;


    const length = 4;
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const inputRefs = useRef([]);
    const { uid } = useParams();
    const navigate = useNavigate(); // Initialize useNavigate
    const [searchParams] = useSearchParams();
    const userType = searchParams.get('s');
    const phoneNumber = localStorage.getItem('tempNumber');

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    useEffect(() => {
        if (counter > 0) {
            const timer = setTimeout(() => setCounter(counter - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [counter]);

    const handleChange = (index, e) => {
        const value = e.target.value;

        // Handle paste event
        if (e.nativeEvent.inputType === 'insertText' && value.length > 1) {
            const newOtp = value.split("").slice(0, length); // Get only the first 'length' characters
            setOtp(newOtp);
            newOtp.forEach((_, i) => {
                if (inputRefs.current[i + 1]) {
                    inputRefs.current[i + 1].focus();
                }
            });
            if (newOtp.length === length) {
                onComplete(newOtp.join(""));
            }
            return;
        }

        if (isNaN(value)) return;

        const newOtp = [...otp];
        // only allow the last input in each field
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        const combinedOtp = newOtp.join("");
        if (combinedOtp.length === length && combinedOtp.split("").every((char) => char !== "")) {
            onComplete(combinedOtp);
        }

        // Move to the next input box if the current field is filled
        if (value && index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handlePaste = (index, e) => {
        e.preventDefault(); // Prevent the default paste action
        const pastedData = e.clipboardData.getData('text');
        const newOtp = pastedData.split("").slice(0, length); // Limit to the length of the OTP
        const updatedOtp = [...otp];

        // Fill the OTP inputs based on the pasted data
        newOtp.forEach((digit, i) => {
            if (i < length) {
                updatedOtp[i] = digit; // Update the OTP state
                if (inputRefs.current[i]) {
                    inputRefs.current[i].value = digit; // Set the value of the input directly
                }
            }
        });

        setOtp(updatedOtp);

        // Check if the full OTP has been entered
        if (newOtp.length === length) {
            onComplete(newOtp.join(""));
        }

        // Focus the next input after pasting
        if (newOtp.length > 0 && inputRefs.current[newOtp.length]) {
            inputRefs.current[newOtp.length].focus();
        }
    };

    const handleClick = (index) => {
        inputRefs.current[index].setSelectionRange(1, 1);
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1].focus();
        }
    };

    const onComplete = async (completeOtp) => {
        console.log("OTP entered:", completeOtp);
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/otp/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ otp: completeOtp, user_id: uid }), // Send the OTP in the request body
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            if (result.status) {
                toast.success("OTP verified successfully!", {
                    position: 'top-center',
                });
                let user = result.user;
                let token = result.token;
                localStorage.setItem('vendorAuthToken', token);
                localStorage.setItem('vendor', JSON.stringify(user));
                window.location.href = '/vendor'

            } else {
                toast.error("OTP verification failed: " + result.message || "Unknown error", {
                    position: 'top-center',
                });
            }

        } catch (error) {
            console.error("Error verifying OTP:", error);
            toast.error("Error verifying OTP: " + error.message);
        }
    };

    const handleResendOtp = async () => {
            try {
                const response = await fetch(`${config.backEndBaseUrl}api/user/otp/resend`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id: uid }),
                });
    
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
    
                const result = await response.json();
                if (result.status) {
                    toast.success(result.message, {
                        position: 'top-center',
                    });
                    setCounter(30); // Reset the counter
                } else {
                    toast.error("OTP Not Sent", {
                        position: 'top-center',
                    });
                }
            } catch (error) {
                console.error("Error verifying OTP:", error);
                toast.error("Error Sending OTP: " + error.message);
            }
        }
    return (
        <>
            <ToastContainer />
            <div className="otp_container">
                <h3>Please Verify Your Phone Number</h3>
                <div className="wrapper_con">
                    <div className="title">OTP sent to <b style={{ marginLeft: '5px', color: 'darkred' }}>{n}</b></div>
                    <div className="otp_area">
                        {
                            otp.map((data, index) => {
                                return (
                                    <input
                                        type="text"
                                        key={index}
                                        ref={(input) => (inputRefs.current[index] = input)}
                                        value={data}
                                        onChange={(e) => handleChange(index, e)}
                                        onClick={() => handleClick(index)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={(e) => handlePaste(index, e)} // Handle paste event
                                    />
                                )
                            })
                        }
                    </div>
                </div>
                <div className='btn-wrapper'>
                    <Link to="/vendor/login"> {/* Provide a link to change email */}
                        Change Number
                    </Link>
                    {counter > 0 ? (
                        <Link >
                            {counter} seconds
                        </Link>
                    ) : (
                        <Link onClick={handleResendOtp}> {/* Provide a link to resend OTP */}
                            Resend OTP
                        </Link>
                    )}
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
        </>
    );
}

export default OtpVerificationVendor;