import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Chart } from "react-google-charts";

function CustomerGrowth() {

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isClearBtnShown, setIsClearBtnShown] = useState(false)

    // date filter section start
    const handleDateChange = (newStartDate, newEndDate) => {
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
    // date filter section end

    // Pie Chart data
    const pieChartData = [
        ["Month", "Customers"],
        ["January", 400],
        ["February", 300],
        ["March", 350],
        ["April", 500],
    ];

    const pieChartOptions = {
        pieHole: 0.4,  // for doughnut effect
        is3D: false,   // toggle to true for 3D chart
    };

    return (
        <>
            <div className="wg-box">
                <div className="flex items-center justify-between">
                    <h5>Customer Growth</h5>
                </div>
                {/* date filter */}
                <div className="flex items-center flex-wrap gap20 mt-2 date-pick">
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
                {/* chart */}
                <div className="chart-container" style={{ marginTop: '20px' }}>
                    <Chart
                        chartType="PieChart"
                        data={pieChartData}
                        options={pieChartOptions}
                        width={"100%"}
                        height={"200px"}
                    />
                </div>
            </div>
        </>
    );
}

export default CustomerGrowth;
