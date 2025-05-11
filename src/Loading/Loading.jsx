import React, { useEffect, useState } from 'react';
import './Loading.css';
import './mediaQuery.css'
import { config } from '../config';

const Loading = ({ type }) => {
	const [userSeoDetails, setUserSeoDetails] = useState(null)
	const [vendorDetails, setVendorDetails] = useState(null)


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
		<div className="loading-container">
			<div className="loading-circle">
				<div className="loading-text">{type == 'vendor' ? vendorDetails?.name : userSeoDetails?.name}</div>
			</div>
		</div>
	);
};

export default Loading;
