import React, { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { config } from '../../../config';
import { Link } from 'react-router-dom';


function TopDefaultCharts() {
	const [stats, setStats] = useState({});

	const getStats = async () => {
		try {
			const response = await fetch(`${config.backEndBaseUrl}api/admin/dashboard-data`, {
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'GET',
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			console.log(result);
			if (result.status) {
				setStats(result.data);
			}
		} catch (error) {
			console.error('Fetching users failed', error);
		}
	};

	useEffect(() => {
		getStats();
	}, []);



	return (
		<>
			<div className="chart-cards-container">

				{/* All chart card */}
				<div className="main-content-wrap">
					<div className="tf-section-4 mb-30">
						{/* USERS */}
						<div className="wg-chart-default chart-default" >
							<Link to={`/admin/customers`} style={{ cursor: 'pointer' }}>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap14">
										<div className="image">
											<i className="fas fa-users"></i> {/* Unique icon for Users */}
										</div>
										<div>
											<div className="body-text mb-2">All Time Users</div>
											<h4>{stats?.user?.allTime}</h4>
										</div>
									</div>

								</div>
								<div className="wrap-chart">
									<div id="line-chart-1"></div>
								</div>
							</Link>
						</div>

						<div className="wg-chart-default chart-default" >
							<Link to={`/admin/customers`} style={{ cursor: 'pointer' }}>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap14">
										<div className="image">
											<i className="fas fa-user-clock"></i> {/* Unique icon for 24 Hours Users */}
										</div>
										<div>
											<div className="body-text mb-2">24 Hours Users</div>
											<h4>{stats?.user?.today}</h4>
										</div>
									</div>

								</div>
								<div className="wrap-chart">
									<div id="line-chart-2"></div>
								</div>
							</Link>
						</div>

						{/* Vendor/store */}
						<div className="wg-chart-default chart-default">
							<Link to={`/admin/vendors`} style={{ cursor: 'pointer' }}>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap14">
										<div className="image">
											<i className="fas fa-store"></i> {/* Unique icon for Vendors */}
										</div>
										<div>
											<div className="body-text mb-2">All Time Vendor/store</div>
											<h4>{stats?.vendor?.allTime}</h4>
										</div>
									</div>
								</div>
								<div className="wrap-chart">
									<div id="line-chart-2"></div>
								</div>
							</Link>
						</div>

						<div className="wg-chart-default chart-default">
							<Link to={`/admin/vendors`} style={{ cursor: 'pointer' }}>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap14">
										<div className="image">
											<i className="fas fa-store-alt"></i> {/* Unique icon for 24 Hours Vendors */}
										</div>
										<div>
											<div className="body-text mb-2">24 Hours New vendor/store</div>
											<h4>{stats?.vendor?.today}</h4>
										</div>
									</div>
								</div>
								<div className="wrap-chart">
									<div id="line-chart-3"></div>
								</div>
							</Link>
						</div>

						{/* Orders */}
						<div className="wg-chart-default chart-default">
							<Link to={`/admin/store/orders`} style={{ cursor: 'pointer' }}>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap14">
										<div className="image">
											<i className="fas fa-shopping-cart"></i> {/* Unique icon for Orders */}
										</div>
										<div>
											<div className="body-text mb-2">Total Orders</div>
											<h4>{stats?.orders?.allTime}</h4>
										</div>
									</div>
								</div>
								<div className="wrap-chart">
									<div id="line-chart-3"></div>
								</div>
							</Link>
						</div>

						<div className="wg-chart-default chart-default">
							<Link to={`/admin/store/orders`} style={{ cursor: 'pointer' }}>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap14">
										<div className="image">
											<i className="fas fa-cart-plus"></i> {/* Unique icon for 24 Hours Orders */}
										</div>
										<div>
											<div className="body-text mb-2">24 hours Orders</div>
											<h4>{stats?.orders?.today}</h4>
										</div>
									</div>
								</div>
								<div className="wrap-chart">
									<div id="line-chart-3"></div>
								</div>
							</Link>
						</div>
						{/* Enquiries */}
						<div className="wg-chart-default chart-default">
							<Link to={`/admin/queries`} style={{ cursor: 'pointer' }}>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap14">
										<div className="image">
											<i className="fas fa-question-circle"></i> {/* Unique icon for Enquiries */}
										</div>
										<div>
											<div className="body-text mb-2">Total Enquiries</div>
											<h4>{stats?.enquiries?.allTime}</h4>
										</div>
									</div>
								</div>
								<div className="wrap-chart">
									<div id="line-chart-3"></div>
								</div>
							</Link>
						</div>

						<div className="wg-chart-default chart-default">
							<Link to={`/admin/queries`} style={{ cursor: 'pointer' }}>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap14">
										<div className="image">
											<i className="fas fa-info-circle"></i> {/* Unique icon for 24 Hours Enquiries */}
										</div>
										<div>
											<div className="body-text mb-2">24 hours Enquiries</div>
											<h4>{stats?.enquiries?.today}</h4>
										</div>
									</div>
								</div>
								<div className="wrap-chart">
									<div id="line-chart-3"></div>
								</div>
							</Link>
						</div>

						{/* Comments */}
						<div className="wg-chart-default chart-default">
							<Link to={`/admin/store/comments`} style={{ cursor: 'pointer' }}>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap14">
										<div className="image">
											<i className="fas fa-comments"></i> {/* Unique icon for Comments */}
										</div>
										<div>
											<div className="body-text mb-2">Total Rating / Comments</div>
											<h4>{stats?.comments?.allTime}</h4>
										</div>
									</div>
								</div>
								<div className="wrap-chart">
									<div id="line-chart-3"></div>
								</div>
							</Link>
						</div>

						<div className="wg-chart-default chart-default">
							<Link to={`/admin/store/comments`} style={{ cursor: 'pointer' }}>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap14">
										<div className="image">
											<i className="fas fa-comment-dots"></i> {/* Unique icon for 24 Hours Comments */}
										</div>
										<div>
											<div className="body-text mb-2">24 hours Rating / Comments</div>
											<h4>{stats?.comments?.today}</h4>
										</div>
									</div>
								</div>
								<div className="wrap-chart">
									<div id="line-chart-3"></div>
								</div>
							</Link>
						</div>

						{/* calls */}
						<div className="wg-chart-default chart-default">
							<Link to={`/admin/store/call-chats`} style={{ cursor: 'pointer' }}>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap14">
										<div className="image">
											<i className="fas fa-phone"></i> {/* Unique icon for Calls */}
										</div>
										<div>
											<div className="body-text mb-2">Total Calls</div>
											<h4>{stats?.calls?.allTime}</h4>
										</div>
									</div>
								</div>
								<div className="wrap-chart">
									<div id="line-chart-3"></div>
								</div>
							</Link>
						</div>

						<div className="wg-chart-default chart-default">
							<Link to={`/admin/store/call-chats`} style={{ cursor: 'pointer' }}>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap14">
										<div className="image">
											<i className="fas fa-phone-alt"></i> {/* Unique icon for 24 Hours Calls */}
										</div>
										<div>
											<div className="body-text mb-2">24 hours Calls</div>
											<h4>{stats?.calls?.today}</h4>

										</div>
									</div>
								</div>
								<div className="wrap-chart">
									<div id="line-chart-3"></div>
								</div>
							</Link>
						</div>

						{/* Chats */}
						<div className="wg-chart-default chart-default">
							<Link to={`/admin/store/call-chats`} style={{ cursor: 'pointer' }}>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap14">
										<div className="image">
											<i className="fas fa-comments"></i> {/* Unique icon for Chats */}
										</div>
										<div>
											<div className="body-text mb-2">Total Chats</div>
											<h4>{stats?.chat?.allTime}</h4>

										</div>
									</div>
								</div>
								<div className="wrap-chart">
									<div id="line-chart-3"></div>
								</div>
							</Link>
						</div>

						<div className="wg-chart-default chart-default">
							<Link to={`/admin/store/call-chats`} style={{ cursor: 'pointer' }}>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap14">
										<div className="image">
											<i className="fas fa-comment-alt"></i> {/* Unique icon for 24 Hours Chats */}
										</div>
										<div>
											<div className="body-text mb-2">24 hours Chats</div>
											<h4>{stats?.chat?.today}</h4>

										</div>
									</div>
								</div>
								<div className="wrap-chart">
									<div id="line-chart-3"></div>
								</div>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default TopDefaultCharts