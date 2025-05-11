import React, { useMemo, useState,useEffect } from 'react';
import './Dashboard.css';
import ReactTable from '../../components/ReactTable/ReactTable.jsx';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Chart } from "react-google-charts";
import { config } from '../../../config.js';

function Vendor() {


	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [isClearBtnShown, setIsClearBtnShown] = useState(false)
	const [vendors, setVendors] = useState([])

	const fetchVendors = async () => {
		try {
			const response = await fetch(`${config.backEndBaseUrl}api/user?type=vendor&status=active`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			setVendors(result.data);


		} catch (error) {
			console.error('Error fetching categories:', error);
		}
	};

	useEffect(() => {
		fetchVendors();
	}, []);


	// date filter section start
	const handleDateChange = (newStartDate, newEndDate) => {
		let dates = {
			newStartDate: newStartDate,
			newEndDate: newEndDate
		};
		setIsClearBtnShown(true)
	};

	const handleStartDateChange = (date) => {
		setStartDate(date);
		handleDateChange(date, endDate);
	};

	const handleEndDateChange = (date) => {
		setEndDate(date);
		handleDateChange(startDate, date);
	};

	const hideClearBtn = () => {
		setIsClearBtnShown(false)
		setStartDate(null)
		setEndDate(null)
	}
	// date filter section send

	//   table section start
	const columns = useMemo(
		() => [
			{
				accessorKey: 'Counts',
				header: 'Counts',
			},
			{
				accessorKey: 'Category',
				header: 'Category',
			},
			{
				accessorKey: 'Sub_Category',
				header: 'Sub-Category',
			},
			{
				accessorKey: 'status',
				header: 'Status',
			},
			{
				accessorKey: 'Store_name',
				header: 'Store Name',
			},
			{
				accessorKey: 'Owner_name',
				header: 'Owner Name',
			},
		],
		[]
	);

	// Temporary data
	const data = useMemo(() => [
		{
			Counts: '1',
			Category: 'Category 1',
			Sub_Category: 'Sub-Category 1',
			status: 'Open',
			Store_name: 'Store Name',
			Owner_name: 'Owner Name',
		},
	], []);
	//   table section end

	return (
		<>
			<div className="main-content-wrap">
				<div className="tf-section-7 mb-30">
					{/* new vendor */}
					<div className="wg-box">
						<div className="flex items-center justify-between">
							<h5>New Vendor</h5>
							{/* date filter */}
							<div className="flex items-center flex-wrap gap20 mb-27 date-pick">
								<div className='DatePicker-wrap' style={{
									display: 'flex',
									fontSize: '13px',
									alignItems: 'center',
									gap: '10px',
									zIndex: '10',
									outline: '1px dashed lightgray',
									padding: '15px',
									borderRadius: '5px',
									flexWrap: 'wrap'
								}}>
									<DatePicker
										id="startDate"
										selected={startDate}
										onChange={handleStartDateChange}
										dateFormat="dd MMM yyyy"
										placeholderText="Start Date"
										autoComplete='off'
									/>
									<DatePicker
										id="endDate"
										selected={endDate}
										onChange={handleEndDateChange}
										dateFormat="dd MMM yyyy"
										placeholderText="End Date"
										autoComplete='off'
									/>
									{
										isClearBtnShown
										&&
										<button
											className='btn btn-lg'
											style={{ width: 'fit-content', padding: '4px 10px', fontSize: '12px', backgroundColor: '#505356', color: '#fff' }}
											onClick={() => hideClearBtn()}>
											Clear
										</button>
									}
								</div>
							</div>
						</div>
						{/* Pass both columns and data to ReactTable */}
						<ReactTable columns={columns} data={data} />
					</div>
					{/* /new vendor */}
					{/* top-States */}
					<div className="wg-box">
						<div>
							<h5>Number of Vendor</h5>
							{/* date filter */}
							<div className="flex items-center flex-wrap gap20 mt-5 date-pick">
								<div className='DatePicker-wrap' style={{
									display: 'flex',
									fontSize: '13px',
									alignItems: 'center',
									gap: '10px',
									zIndex: '10',
									outline: '1px dashed lightgray',
									padding: '15px',
									borderRadius: '5px',
									flexWrap: 'wrap'
								}}>
									<DatePicker
										id="startDate"
										selected={startDate}
										onChange={handleStartDateChange}
										dateFormat="dd MMM yyyy"
										placeholderText="Start Date"
										autoComplete='off'
									/>
									<DatePicker
										id="endDate"
										selected={endDate}
										onChange={handleEndDateChange}
										dateFormat="dd MMM yyyy"
										placeholderText="End Date"
										autoComplete='off'
									/>
									{
										isClearBtnShown
										&&
										<button
											className='btn btn-lg'
											style={{ width: 'fit-content', padding: '4px 10px', fontSize: '12px', backgroundColor: '#505356', color: '#fff' }}
											onClick={() => hideClearBtn()}>
											Clear
										</button>
									}
								</div>
							</div>
						</div>
						{/* chart */}
						<Chart
							className="barChart"
							chartType="BarChart"
							data={[["Age", "Weight"], [4, 5.5], [8, 12]]}
							width="100%"  // Keep this
							height="250px"
							options={{
								chartArea: {
									width: '100%'  // This ensures the chart area uses full width
								}
							}}
							legendToggle
							// Manually apply styles to make the chart and parent divs responsive
							chartWrapperParams={{
								chartWrapper: {
									setContainerCssClass: 'customChartContainer',  // Apply custom class
								}
							}}
						/>
						<div className="col-xl-6 mb-20">
							<div>
								<div className="wrap-chart">
									<div id="line-chart-14"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Vendor