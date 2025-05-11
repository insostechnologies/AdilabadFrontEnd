import React, { useEffect, useState } from 'react';
import './EnquiryCard.css';
import './mediaQuery.css';
import { config } from '../../../../config';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { ToastContainer, toast } from 'react-toastify';

const EnquiryCard = ({ title }) => {
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [message, setMessage] = useState('');
	const user_id = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).uid : '';


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
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}

	useEffect(()=>{
		fetchUser(user_id)
	},[user_id])


	// Handle form submission
	const handleSubmit = async (event) => {
		event.preventDefault();
		const userId = JSON.parse(localStorage.getItem('user')).uid

		const enquiryData = {
			userId,
			name,
			phone,
			message,
			storeId : ''
		};

		try {
			const response = await fetch(`${config.backEndBaseUrl}api/user/enquiry/add`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(enquiryData),
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const result = await response.json();
			console.log('Success:', result);
			if(result.status){
				toast.success('Your Enquiry Sent Successfully to Stores Owners', {
                    position: 'top-center',
                });
			}
			setName('');
			setPhone('');
			setMessage('');
			//alert('Your enquiry has been sent successfully!');
		} catch (error) {
			console.error('Error:', error);
			//alert('There was an error sending your enquiry. Please try again later.');
		}
	};

	return (
		<div className='enquiry-card'>
			<ToastContainer />
			<div className="card">
				<h5>{title ? title : "Send Enquiry?"}</h5>
				<form onSubmit={handleSubmit}>
					<input
						className='input-area'
						type="text"
						placeholder='Enter your Name'
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
					<input
						className='input-area'
						type="number"
						placeholder='Enter your Phone'
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						required
					/>
					<textarea
						className='input-area'
						id="message"
						placeholder='Enter your Message'
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						required
					></textarea>
					<button type="submit">Send Enquiry</button>
				</form>
			</div>
		</div>
	);
}

export default EnquiryCard;