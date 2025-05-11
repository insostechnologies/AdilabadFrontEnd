import React, { useState, useEffect, useMemo, useContext } from 'react';
import SectionMenuLeft from '../../../components/SectionMenuLeft/SectionMenuLeft';
import { AdminSidebarContext } from '../../../../context/adminSidebarContext';
import { config } from '../../../../config';
import { ToastContainer } from 'react-toastify';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-toastify/dist/ReactToastify.css';
import ReactTable from '../../../components/ReactTable/ReactTable.jsx';
import "./FollowersLeads.css";
import { Link } from 'react-router-dom';
import { BsWhatsapp, BsTelephone } from "react-icons/bs";
import { formatPhoneNumber } from '../../../../utils/helper';

function FollowersLeads() {
	const { isSidebar } = useContext(AdminSidebarContext);
	const vendor = JSON.parse(localStorage.getItem('vendor'));
	const vendor_id = vendor.uid;
	const [followers, setFollowers] = useState([]);  // Ensure it's initialized as an empty array
	const [filteredFollowers, setFilteredFollowers] = useState([]);  // For filtered followers
	const [storeId, setStoreId] = useState('');
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [vendorUser, setVendorUser] = useState(null)

	const fetchVendorStore = async (vendor_id) => {
		try {
			const response = await fetch(`${config.backEndBaseUrl}api/user/vendor/store/${vendor_id}`, {
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
				let store_id = result.store_id;
				setStoreId(store_id);
				return store_id;
			}
		} catch (error) {
			console.error('Error fetching categories:', error);
		}
	};



	const fetchVendorUser = async () => {
		try {
			const response = await fetch(`${config.backEndBaseUrl}api/user/${vendor_id}`, {
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
				setVendorUser(result.data)
			}
		} catch (error) {
			console.error('Error fetching categories:', error);
		}
	};

	const getFollowers = async (store_id) => {
		try {
			const response = await fetch(`${config.backEndBaseUrl}api/store/followers/${store_id}`, {
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'GET',
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			if (result.status) {
				// Sort followers by created_at in descending order (most recent first)
				const sortedFollowers = result.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
				setFollowers(sortedFollowers);
				setFilteredFollowers(sortedFollowers);  // Initialize filteredFollowers
			}

		} catch (error) {
			console.error('Fetching leads failed', error);
		}
	};

	const columns = useMemo(
		() => [
			{
				accessorKey: 'created_at',
				header: 'Date',
			},
			{
				accessorKey: 'user.user_name',  // Access user_name from the user object
				header: 'Name',
			},
			{
				accessorKey: 'user.phone', // Access phone from the user object
				header: 'Number',
				Cell: ({ cell }) => {
					const phoneNumber = cell.getValue(); // Get the phone number
					const isDisabled = vendorUser?.view_calls !== "1";
					// Display all but the last 4 digits
					const maskedNumber = phoneNumber
						? `${phoneNumber.slice(0, -4)}****`
						: 'N/A';
					return <span>{isDisabled ? maskedNumber : phoneNumber}</span>;
				},
			},
			{
				accessorKey: 'user',  // The full user object, for contacts
				header: 'Contact',
				Cell: ({ cell }) => {
					const user = cell.getValue();  // Access the user object
					const phoneNumber = user?.phone;  // Access phone number from user object
					const isDisabled = vendorUser?.view_calls !== "1"; // Determine if the button should be disabled
					return (
						<div>
							{phoneNumber && (
								<>
									<a href={isDisabled ? '#' : `tel:${formatPhoneNumber(phoneNumber)}`} className={`actionBtn btn btn-lg btn-secondary ${isDisabled ? 'disabled' : ''}`} style={{ margin: '8px', padding: '10px' }} >
										<BsTelephone style={{ fontSize: '20px', fontWeight: '700' }} />
									</a>
									<a href={isDisabled ? '#' : `https://wa.me/${formatPhoneNumber(phoneNumber)}`} className={`actionBtn btn btn-lg btn-success ${isDisabled ? 'disabled' : ''}`} style={{ margin: '8px', padding: '10px' }} >
										<BsWhatsapp style={{ fontSize: '20px', fontWeight: '700' }} />
									</a>
								</>
							)}
						</div>
					);
				},
			},
			{
				accessorKey: 'user.phone',
				header: 'Notification Sent',
				Cell: ({ cell }) => {
					const phoneNumber = cell.getValue();  // Assuming phone number is available in the cell
					return (
						<div>
							{phoneNumber && (
								<>
									<Link className="actionBtn btn btn-lg btn-success text-light">
										<span></span> views
									</Link>
								</>
							)}
						</div>
					);
				},
			},
		],
		[vendorUser] // Add vendorUser as a dependency to ensure it updates correctly
	);

	// Filter followers based on selected date range
	useEffect(() => {
		const filterFollowersByDate = () => {
			if (!startDate && !endDate) {
				setFilteredFollowers(followers); // No filter, show all
				return;
			}

			const filteredData = followers.filter(follower => {
				const createdAt = new Date(follower.created_at);
				const isAfterStart = !startDate || createdAt >= new Date(startDate);
				const isBeforeEnd = !endDate || createdAt <= new Date(endDate);
				return isAfterStart && isBeforeEnd;
			});

			setFilteredFollowers(filteredData);
		};

		filterFollowersByDate(); // Call filter function
	}, [startDate, endDate, followers]);

	useEffect(() => {
		const fetchData = async () => {
			const store_id = await fetchVendorStore(vendor_id);
			if (store_id) {
				getFollowers(store_id);
			}
		};

		fetchData();
		fetchVendorUser()
	}, [vendor_id]);

	return (
		<div className="body">
			<ToastContainer />
			<div id="wrapper">
				<div id="page" className="">
					<div className="layout-wrap">
						<SectionMenuLeft />
						<div className="section-content-right">
							<div className="main-content" style={{ paddingLeft: isSidebar ? '280px' : '0px' }}>
								<div className="main-content-inner">
									<div className='totals'>
										<h5>Total Followers: {filteredFollowers.length}</h5>
									</div>
									<div className="filters">
										<div className="date-filter">
											<DatePicker
												selected={startDate}
												onChange={(date) => setStartDate(date)}
												placeholderText="From"
												dateFormat="MM/dd/yyyy"
												className="date-input"
											/>
											<DatePicker
												selected={endDate}
												onChange={(date) => setEndDate(date)}
												placeholderText="To"
												dateFormat="MM/dd/yyyy"
												className="date-input"
											/>
										</div>
									</div>

									<div className="chart-table-wrapper">
										<div className="chart-table-item">
											<ReactTable columns={columns} data={filteredFollowers} />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default FollowersLeads;
