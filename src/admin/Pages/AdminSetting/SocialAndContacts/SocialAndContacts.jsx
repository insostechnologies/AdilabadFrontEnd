import React, { useRef, useState, useEffect } from 'react';
import { config } from '../../../../config';
import useArrowKeyDisable from '../../../customhook/useArrowKeyDisable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function SocialAndContacts({ user }) {

	const inputRef1 = useRef(null);
	const inputRef2 = useRef(null);
	const [socialDetails, setSocialDetails] = useState(null)
	const [userId, setUserId] = useState(null)

	const [formData, setFormData] = useState({
		email: '',
		facebook: '',
		instagram: '',
		whatsapp: '',
		twitter: '',
		call: '',
		address: '',
		mapLink: '',
		appstore: '',
		playstore: ''
	});

	useEffect(() => {
		if (user && user.socialDetails) {
			setUserId(user.uid)
			setSocialDetails(user.socialDetails);
			const prefillData = {};
			user.socialDetails.forEach(item => {
				prefillData[item.type] = item.value;
			});
			setFormData(prevFormData => ({
				...prevFormData,
				...prefillData
			}));
		}
	}, [user]);

	const handleForm = async (event) => {
		event.preventDefault();
		// console.log(formData)
		// return

		try {
			// Send the request
			const response = await fetch(`${config.backEndBaseUrl}api/user/social/update/${userId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
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
	// 	setFormData({
	// 		email: '',
	// 		facebook: '',
	// 		instagram: '',
	// 		whatsapp: '',
	// 		twitter: '',
	// 		call: '',
	// 		address: '',
	// 		mapLink: ''
	// 	});
	// };

	const onInputChange = (event) => {
		const { name, value } = event.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	// custom hook
	useArrowKeyDisable(inputRef1);
	useArrowKeyDisable(inputRef2);


	return (
		<>
			<ToastContainer />
			<div className="wg-box wg-box-container">
				<form className="form-new-product form-style-1" onSubmit={handleForm}>
					{/* Call */}
					<fieldset className="name">
						<div className="body-title input_label">Phone :</div>
						<input ref={inputRef2} className="flex-grow input_field" type="Number" name="call" placeholder="Enter call number" value={formData.call} onChange={onInputChange} />
					</fieldset>

					{/* WhatsApp */}
					<fieldset className="name">
						<div className="body-title input_label">WhatsApp :</div>
						<input ref={inputRef1} className="flex-grow input_field" type="Number" name="whatsapp" placeholder="Enter WhatsApp number" value={formData.whatsapp} onChange={onInputChange} />
					</fieldset>

					{/* Location (Address and Map Link) */}
					{/* <fieldset className="name">
						<div className="body-title input_label">Address :</div>
						<input className="flex-grow input_field" type="text" name="address" placeholder="Enter address" value={formData.address} onChange={onInputChange} />
					</fieldset> */}
					<fieldset className="name">
						<div className="body-title input_label">Map Link :</div>
						<input className="flex-grow input_field" type="text" name="mapLink" placeholder="Enter map link" value={formData.mapLink} onChange={onInputChange} />
					</fieldset>

					{/* UPI Pay */}
					<fieldset className="name">
						<div className="body-title input_label">UPI Pay :</div>
						<input className="flex-grow input_field" type="text" name="upiPay" placeholder="Enter UPI Pay ID" value={formData.upiPay} onChange={onInputChange} />
					</fieldset>

					{/* Website */}
					<fieldset className="name">
						<div className="body-title input_label">Website :</div>
						<input className="flex-grow input_field" type="text" name="website" placeholder="Enter website link" value={formData.website} onChange={onInputChange} />
					</fieldset>
					{/* App Store */}
					<fieldset className="name">
						<div className="body-title input_label">App Store :</div>
						<input className="flex-grow input_field" type="text" name="appstore" placeholder="Enter App Store link" value={formData.appstore} onChange={onInputChange} />
					</fieldset>
					{/* Play Store */}
					<fieldset className="name">
						<div className="body-title input_label">Play Store :</div>
						<input className="flex-grow input_field" type="text" name="playstore" placeholder="Enter Play Store link" value={formData.playstore} onChange={onInputChange} />
					</fieldset>

					{/* Email */}
					<fieldset className="name">
						<div className="body-title input_label">Email :</div>
						<input className="flex-grow input_field" type="email" name="email" placeholder="Enter admin email" value={formData.email} onChange={onInputChange} />
					</fieldset>

					{/* YouTube */}
					<fieldset className="name">
						<div className="body-title input_label">YouTube :</div>
						<input className="flex-grow input_field" type="text" name="youtube" placeholder="Enter YouTube link" value={formData.youtube} onChange={onInputChange} />
					</fieldset>

					{/* Instagram */}
					<fieldset className="name">
						<div className="body-title input_label">Instagram :</div>
						<input className="flex-grow input_field" type="text" name="instagram" placeholder="Enter Instagram link" value={formData.instagram} onChange={onInputChange} />
					</fieldset>

					{/* Facebook */}
					<fieldset className="name">
						<div className="body-title input_label">Facebook :</div>
						<input className="flex-grow input_field" type="text" name="facebook" placeholder="Enter Facebook link" value={formData.facebook} onChange={onInputChange} />
					</fieldset>

					{/* X (Twitter) */}
					<fieldset className="name">
						<div className="body-title input_label">X (Twitter) :</div>
						<input className="flex-grow input_field" type="text" name="twitter" placeholder="Enter X (Twitter) link" value={formData.twitter} onChange={onInputChange} />
					</fieldset>
					<div className="bot from_btn_wrap">
						<button type="submit" className="tf-button w208 h10 from_btn">Submit</button>
					</div>
				</form>

			</div>
		</>
	);
}

export default SocialAndContacts;
