import React, { useState, useRef,useEffect } from 'react';
import './accountForm.css';
import { config } from '../../../../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { readFileAsBase64 } from '../../../../utils/fileHandle'
import { FaEyeSlash, FaEye } from "react-icons/fa6";


function AccountForm({user}) {
	const [file, setFile] = useState(null);
	const [preview, setPreview] = useState(null);
	const [filePath, setFilePath] = useState(null)
	const [userId, setUserId] = useState(null);
	const [name, setName] = useState(null);
	const [email, setEmail] = useState(null);
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const fileInputRef = useRef(null);

	useEffect(() => {
        if (user) {
            setName(user.user_name || '');
            setEmail(user.email || '');
            setUserId(user.uid || '');
            setPreview(user.profile_image == '' ? config.backEndBaseUrl + config.placeHolderImage : config.backEndBaseUrl + user.profile_image || '');
			setFilePath(user.profile_image || '')
        }
    }, [user]);


	const handleForm = async (event) => {
		event.preventDefault();

		let jsonData;

		try {
			if (file) {
				// Convert file to Base64 string and wait for the result
				const fileData = await readFileAsBase64(file);

				// Create JSON object with file as base64 string
				jsonData = {
					file: fileData,
					name: name,
					email: email,
					password: password
				};
			} else {
				jsonData = {
					name: name,
					email: email,
					password: password,
					path: filePath	
				};
			}

			// Send the request
			const response = await fetch(`${config.backEndBaseUrl}api/user/update/${userId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(jsonData),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			if (!result.status) {
				toast.error(result.errors[0].msg, {
					position: 'top-center',
				});
			} else {
				toast.success(result.message, {
					position: 'top-center',
				});
				// resetForm();
			}

		} catch (error) {
			console.error('Error update data:', error);
		}
	};



	// const resetForm = () => {
	// 	setFile(null);
	// 	setPreview(null);
	// 	setName('');
	// 	setEmail('');
	// 	setPassword('');
	// 	if (fileInputRef.current) {
	// 		fileInputRef.current.value = '';
	// 	}
	// };

	const onNameChange = (event) => {
		setName(event.target.value);
	};
	const onEmailChange = (event) => {
		setEmail(event.target.value);
	};
	const onPasswordChange = (event) => {
		setPassword(event.target.value);
	};

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		setFile(selectedFile);

		if (selectedFile) {
			const fileReader = new FileReader();
			fileReader.onloadend = () => {
				setPreview(fileReader.result);
			};
			fileReader.readAsDataURL(selectedFile);
		} else {
			setPreview(null);
		}
	};



	return (
		<>
			<ToastContainer />
			<div className="wg-box wg-box-container">
				<form className="form-new-product form-style-1" onSubmit={handleForm}>
					<fieldset className="name">
						<div className="body-title input_label">Name :</div>
						<input className="flex-grow input_field" type="text" placeholder="Enter admin name" value={name} onChange={onNameChange} />
					</fieldset>
					<fieldset className="name">
						<div className="body-title input_label">Email :</div>
						<input className="flex-grow input_field" type="email" placeholder="Enter admin email" value={email} onChange={onEmailChange} />
					</fieldset>
					<fieldset>
						<div className="body-title input_label">Profile Image :</div>
						<div className="upload-image flex-grow input_field">
							<div className="item up-load">
								<label className="uploadfile" htmlFor="myFile">
									<span className="icon">
										<i className="icon-upload-cloud"></i>
									</span>
									<span className="body-text">Drop your images here or select <span className="tf-color">click to browse</span></span>
									<input type="file" id="myFile" onChange={handleFileChange} ref={fileInputRef} />
									{preview && (
										<div className="image-preview">
											<img src={preview} alt="Image_Preview" className='prvImg' />
										</div>
									)}
								</label>
							</div>
						</div>
					</fieldset>
					<fieldset className="name pass_input_div">
						<div className="body-title input_label">Password :</div>
						<input className="flex-grow input_field pasInput" type={showPassword ? "text" : "password"} placeholder="Enter password" value={password} onChange={onPasswordChange} />
						{showPassword ? <FaEyeSlash onClick={() => { setShowPassword(!showPassword) }} /> : <FaEye onClick={() => { setShowPassword(!showPassword) }} />}
					</fieldset>
					<div className="bot from_btn_wrap">
						<button type="submit" className="tf-button w208 h10 from_btn">Submit</button>
					</div>
				</form>
			</div>
		</>
	);
}

export default AccountForm;
