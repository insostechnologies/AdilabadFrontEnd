import React, { useContext, useEffect, useMemo, useState } from 'react';
import { config } from '../../../../../config';
import { ToastContainer } from 'react-toastify';
import SectionMenuLeft from '../../../../components/SectionMenuLeft/SectionMenuLeft';
import { AdminSidebarContext } from '../../../../../context/adminSidebarContext';
import { useParams } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-toastify/dist/ReactToastify.css';
import { Chart } from 'react-google-charts';
import ReactTable from '../../../../components/ReactTable/ReactTable.jsx';
import { useLocation } from 'react-router-dom';
import './ChartsAdmin.css'


const ChartsAdmin = () => {
	const { isSidebar } = useContext(AdminSidebarContext);

	const [leads, setLeads] = useState([]);
	const [startDate, setStartDate] = useState(null); // Add startDate
	const [endDate, setEndDate] = useState(null);   // Add endDate
	const [user, setUser] = useState(null);
	const vendor = JSON.parse(localStorage.getItem('vendor')) || {}; // Default to empty object
	const vendor_id = vendor?.uid || null; // Ensure vendor_id is not accessed on null	
	const { uid } = useParams();
	const location = useLocation();

	// Create a URLSearchParams object from the query string
	const queryParams = new URLSearchParams(location.search);

	// Get the 'type' query parameter and split it into an array (if needed)
	const type = queryParams.get('type');

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
				return store_id;
			}
		} catch (error) {
			console.error('Error fetching categories:', error);
		}
	};

	const getLeads = async (store_id) => {
		try {
			const response = await fetch(`${config.backEndBaseUrl}api/user/leads/store?store_id=${store_id}&user_id=${uid}&type=${type}`, {
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
				setUser(result.userData); // Store user data
				const combinedLeads = result.data.flatMap(entry => entry.leads);

				// Add user information to each lead
				const enrichedLeads = combinedLeads.map(lead => ({
					...lead,
					user_name: result.userData?.user_name || '', // Add user name
				}));

				const sortedLeads = enrichedLeads.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

				setLeads(sortedLeads);
				console.log(JSON.stringify(sortedLeads))
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
				accessorKey: 'type',
				header: 'Clicked On',
			},
			{
				accessorKey: 'user_name',
				header: 'Name', // Directly access 'user_name'
			},
		],
		[]
	);


	useEffect(() => {
		const fetchData = async () => {
			if (!vendor_id) {
				console.error("Vendor ID is null, cannot fetch store.");
				return;
			}
			const store_id = await fetchVendorStore(vendor_id);
			if (store_id) {
				getLeads(store_id);
			}
		};
	
		fetchData();
	}, [vendor_id, uid]);

	const filteredLeads = leads.filter(lead => {
		const leadDate = new Date(lead.created_at);
		return (
			(!startDate || leadDate >= startDate) &&
			(!endDate || leadDate <= endDate)
		);
	});

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
									<h4>Analytics</h4>
									{/* <div className="filters">
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
									</div> */}
									<div className="chart-table-wrapper">
										{filteredLeads.length === 0 ? (
											<div className="chart-table-item no-data">
												<p>No Data available.</p>
											</div>
										) : (
											<>
												<div className="chart-table-item chart-container">
													<Chart
														className="chart"
														width={'100%'}
														height={'400px'}
														chartType="ColumnChart"
														loader={<div>Loading Chart</div>}
														data={[
															['Date', 'Clicks'],
															...Object.entries(
																filteredLeads.reduce((acc, lead) => {
																	const date = new Date(lead.created_at).toLocaleDateString(); // Group by date
																	acc[date] = (acc[date] || 0) + 1; // Increment count for the date
																	return acc;
																}, {})
															).map(([date, count]) => [date, count]) // Convert grouped data into chart-friendly format
														]}
														options={{
															title: 'Daily Activity',
															legend: { position: 'bottom' },
															hAxis: {
																title: 'Date',
																format: 'MMM d, yyyy',
																direction: -1, // Reverses the order of dates on the x-axis (most recent on the right)
															},
															vAxis: {
																title: 'Number of Clicks per Day',
															},
															colors: ['#4285F4'],
														}}
														rootProps={{ 'data-testid': '1' }}
													/>
												</div>
											</>
										)}
										<div className="chart-table-item">
											<ReactTable columns={columns} data={filteredLeads} />
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
};

export default ChartsAdmin;
