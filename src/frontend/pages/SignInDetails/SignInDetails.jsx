import React, { useState } from "react";
import { Link, useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import './SignInDetails.css';
import { config } from '../../../config';
import brand_logo from '../../components/Assets/Images/brand_logo.png';
import image from '../../components/Assets/Images/image.png';
import { useNavigate } from 'react-router-dom';

const SignInDetails = () => {
    const [userName, setUserName] = useState("");
    const [gender, setGender] = useState(""); // State for gender
    const [loading, setLoading] = useState(false); // State for loading
    const navigate = useNavigate();
    const { uid } = useParams();

    const onChangeUserName = (event) => {
        setUserName(event.target.value);
    };

    const onChangeGender = (event) => {
        setGender(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userName === '') {
            toast.error("Please Add A User Name");
            return false;
        }
        if (gender === '') {
            toast.error("Please Select Your Gender");
            return false;
        }
        setLoading(true); // Set loading to true when the request starts
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/details/add/${uid}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "userName": userName,
                    "gender": gender, // Include gender in the request body
                })
            });
            const json = await response.json();
            if (json.status) {
                window.location.href = '/?s=n'
            } else {
                console.log('Login failed:', json.message); // Debug log
                toast.error('Cannot Add User Name', {
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
                        {/* <div className="login-logo">
                            <img src={brand_logo} alt="logo" />
                        </div> */}
                        <div className="login-center">
                            <h2>Enter Your Full Name</h2>
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    placeholder="User Name"
                                    required
                                    name="user_name"
                                    value={userName}
                                    onChange={onChangeUserName}
                                />
                                <div className="gender-selection">
                                    <h4>Select Your Gender:</h4>
                                    <div className="gender-options">
                                        <label>
                                            <input
                                                type="radio"
                                                value="male"
                                                checked={gender === "male"}
                                                onChange={onChangeGender}
                                            />
                                            Male
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                value="female"
                                                checked={gender === "female"}
                                                onChange={onChangeGender}
                                            />
                                            Female
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                value="other"
                                                checked={gender === "other"}
                                                onChange={onChangeGender}
                                            />
                                            Other
                                        </label>
                                    </div>
                                </div>
                                <div className="login-center-buttons">
                                    <button type="submit" disabled={loading}>
                                        {loading ? "Submitting..." : "Submit"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignInDetails;