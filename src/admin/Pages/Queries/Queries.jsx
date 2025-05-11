import React, { useMemo, useState, useEffect, useContext } from 'react';
import './Queries.css';
import ReactTable from '../../components/ReactTable/ReactTable.jsx';
import SectionMenuLeft from '../../components/SectionMenuLeft/SectionMenuLeft';
import { AdminSidebarContext } from '../../../context/adminSidebarContext';
import { config } from '../../../config.js';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Queries = () => {
	const { isSidebar } = useContext(AdminSidebarContext);
	const [queries, setQueries] = useState([]);
	const [filteredQueries, setFilteredQueries] = useState([]);
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [isClearBtnShown, setIsClearBtnShown] = useState(false);

	const fetchQueries = async () => {
		try {
			const response = await fetch(`${config.backEndBaseUrl}api/user/queries`, {
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'GET',
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const result = await response.json();
			const sortedQueries = result.data.sort((a, b) => new Date(b.formatted_created_at) - new Date(a.formatted_created_at));
			setQueries(sortedQueries);
			setFilteredQueries(sortedQueries);
		} catch (error) {
			console.error('Fetching queries failed', error);
		}
	};

	useEffect(() => {
		fetchQueries();
	}, []);

	// Normalize start and end dates for filtering
	const normalizeDate = (date) => {
		const d = new Date(date);
		d.setHours(0, 0, 0, 0);
		return d;
	};

	const normalizeEndDate = (date) => {
		const d = new Date(date);
		d.setHours(23, 59, 59, 999);
		return d;
	};

	// Apply filters when dates change
	useEffect(() => {
		let filtered = queries;

		if (startDate) {
			filtered = filtered.filter(query => new Date(query.formatted_created_at) >= normalizeDate(startDate));
		}
		if (endDate) {
			filtered = filtered.filter(query => new Date(query.formatted_created_at) <= normalizeEndDate(endDate));
		}

		setFilteredQueries(filtered);
	}, [startDate, endDate, queries]);

	const handleStartDateChange = (date) => {
		setStartDate(date);
		setIsClearBtnShown(true);
	};

	const handleEndDateChange = (date) => {
		setEndDate(date);
		setIsClearBtnShown(true);
	};

	const hideClearBtn = () => {
		setIsClearBtnShown(false);
		setStartDate(null);
		setEndDate(null);
		setFilteredQueries(queries);
	};

	const columns = useMemo(() => [
		{ accessorKey: 'name', header: 'User' },
		{ accessorKey: 'formatted_created_at', header: 'Created On' },
		{ accessorKey: 'store_name', header: 'Store' },
		{ accessorKey: 'phone', header: 'Phone' },
		{ accessorKey: 'message', header: 'Message' }
	], []);

	return (
		<>
			<div className="body">
				<div id="wrapper">
					<div id="page">
						<div className="layout-wrap">
							<SectionMenuLeft />
							<div className="section-content-right">
								<div className="main-content" style={{ paddingLeft: isSidebar ? '280px' : '0px' }}>
									<div className="main-content-inner">
										<div className="flex items-center flex-wrap justify-between gap20 mb-27">
											<h3>Queries</h3>
											<h3>Total Queries: {filteredQueries.length}</h3>
										</div>

										{/* Date Filters */}
										<div className="date-filter">
											<div style={{ display: 'flex', fontSize: '13px', alignItems: 'center', gap: '10px', outline: '1px solid lightgray', padding: '10px', borderRadius: '5px', flexWrap: 'wrap' }}>
												<DatePicker selected={startDate} onChange={handleStartDateChange} dateFormat="dd MMM yyyy" placeholderText="Start Date" autoComplete='off' />
												<DatePicker selected={endDate} onChange={handleEndDateChange} dateFormat="dd MMM yyyy" placeholderText="End Date" autoComplete='off' />
												{isClearBtnShown && <button className='btn btn-lg btn-dark' style={{ width: 'fit-content', padding: '10px 15px', fontSize: '14px' }} onClick={hideClearBtn}>Clear</button>}
											</div>
										</div>

										{/* Queries Table */}
										<ReactTable columns={columns} data={filteredQueries} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Queries;
