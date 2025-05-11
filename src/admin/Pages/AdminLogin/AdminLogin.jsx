import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import './AdminLogin.css'
import { config } from '../../../config'

const Login = () => {
	const { frontEndBaseUrl } = config;
	const [userSeoDetails, setUserSeoDetails] = useState(null)

	const [showPassword, setShowPassword] = useState(false);
	const [userData, setUserData] = useState({
		"email": "",
		"password": ""
	})
	const onChange = (event) => {
		setUserData({ ...userData, [event.target.name]: event.target.value });
	};
	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const response = await fetch(`${config.backEndBaseUrl}api/user/log-in`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					"email": userData.email,
					"password": userData.password,
					"type": 'admin'
				})
			})
			const json = await response.json()



			// let json = { success: false }
			// if (userData.email == 'admin@gmail.com' && userData.password == '123456') {
			// 	json = { success: true, userId: '1', authToken: 'qwerty' }
			// }
			if (json.status) {
				localStorage.setItem('adminAuthToken', json.data.token);
				localStorage.setItem('adminUserId', json.data.user.uid);
				//console.log('Login successful:', config); // Debug log
				//navigate('/')
				window.location.href = '/admin';
			} else {
				console.log('Login failed:', json.message); // Debug log
				toast.error('Wrong Email or Password', {
					position: 'top-center',
				});
			}
		} catch (err) {
			console.log(err)
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
				<div className="login-right">
					<div className="login-right-container">
						<div className="login-logo">
							<img src={`${config.backEndBaseUrl}${userSeoDetails?.logo}`} alt="logo" />
						</div>
						<div className="login-center">
							<h2>Welcome back Admin!</h2>
							<p>Please enter your details</p>
							<form onSubmit={handleSubmit}>
								<input type="text" placeholder="Email" required name="email" value={userData.email} onChange={onChange} />
								<div className="pass-input-div">
									<input type={showPassword ? "text" : "password"} placeholder="Password" required name="password" value={userData.password} onChange={onChange} />
									{showPassword ? <FaEyeSlash onClick={() => { setShowPassword(!showPassword) }} /> : <FaEye onClick={() => { setShowPassword(!showPassword) }} />}

								</div>

								<div className="login-center-options">
									<div className="remember-div">
										<input type="checkbox" id="remember-checkbox" />
										<label htmlFor="remember-checkbox">
											Remember Me
										</label>
									</div>
									<Link href="/" className="forgot-pass-link">
										Forgot password?
									</Link>
								</div>
								<div className="login-center-buttons">
									<button type="submit">Log In</button>
								</div>
							</form>
						</div>

						<p className="login-bottom-p">
							Don't have an account? <Link className="login-bottom-btn" to="/signup">Signup</Link>
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default Login;