import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import './signup.css';
import brand_logo from '../../components/Assets/Images/brand_logo.png';
import image from '../../components/Assets/Images/image.png';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { config } from "../../../config";
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Loading state

    const validateInputs = () => {
        if (!username) {
            toast.error("Username is required");
            return false;
        }
        if (!/^\d{10}$/.test(phoneNumber)) {
            toast.error("Phone number must be 10 digits");
            return false;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long");
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
            username,
            phoneNumber,
            password,
        };

        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/sign-up`, {
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
                navigate(`/verify-otp/${result.data.user_id}`)
                
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
                            <img src={brand_logo} alt="logo" />
                        </div>
                        <div className="login-center">
                            <p>Please enter your details</p>
                            <form>
                                <input
                                    type="text"
                                    placeholder="User Name"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Phone Number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    required
                                />
                                <div className="pass-input-div">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    {showPassword ?
                                        <FaEyeSlash onClick={() => setShowPassword(!showPassword)} /> :
                                        <FaEye onClick={() => setShowPassword(!showPassword)} />
                                    }
                                </div>

                                <div className="login-center-options">
                                    <div className="remember-div">
                                        <input type="checkbox" id="remember-checkbox" />
                                        <label htmlFor="remember-checkbox">
                                            Privacy & Terms
                                        </label>
                                    </div>
                                </div>
                                <div className="login-center-buttons">
                                    <button type="button" onClick={handleSignup} disabled={loading}>
                                        {loading ? "Signing Up..." : "Sign Up"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <p className="login-bottom-p">
                            Already have an account? <Link className="login-bottom-btn" to="/login">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signup;