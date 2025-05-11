import React, { useState, useEffect, useContext } from 'react';
import SectionMenuLeft from '../../components/SectionMenuLeft/SectionMenuLeft';
import { AdminSidebarContext } from '../../../context/adminSidebarContext';
import { config } from '../../../config';
import { useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Chart } from 'react-google-charts'; // Import Chart component
import DatePicker from "react-datepicker"; // Import DatePicker component
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles
import 'react-toastify/dist/ReactToastify.css';
import "./Leads.css";

function Leads() {
    const { isSidebar } = useContext(AdminSidebarContext);
    const { uid } = useParams();
    const [leads, setLeads] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const getLeads = async (uid) => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/leads/${uid}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setLeads(result.data); // Set leads data to state

        } catch (error) {
            console.error('Fetching leads failed', error);
        }
    };

    useEffect(() => {
        getLeads(uid);
    }, [uid]);

    // Prepare data for the chart
    const chartData = [['Date', 'Leads']];

    // Group leads by day
    const leadsByDate = leads.reduce((acc, lead) => {
        const date = new Date(lead.created_at).toLocaleDateString(); // Format date to 'MM/DD/YYYY'
        acc[date] = (acc[date] || 0) + 1; // Count leads per date
        return acc;
    }, {});

    // Convert the grouped data into an array for the chart
    for (const [date, count] of Object.entries(leadsByDate)) {
        chartData.push([date, count]);
    }

    // Filter leads based on date range
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
                                    <h4>analytics</h4>
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
                                    {filteredLeads.length === 0 ? ( // Check if filtered leads array is empty
                                        <div className="no-data">
                                            <p>No Data available.</p>
                                        </div>
                                    ) : (
                                        <div className="chart-container" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                            <Chart
                                                width={'auto'}
                                                height={'600px'}
                                                chartType="ColumnChart"
                                                loader={<div>Loading Chart</div>}
                                                data={chartData}
                                                options={{
                                                    title: 'Clicks Per Day',
                                                    hAxis: {
                                                        title: 'Date',
                                                        slantedText: true, // Slant the text for better visibility
                                                        slantedTextAngle: 45,
                                                    },
                                                    vAxis: {
                                                        title: 'Number of Leads',
                                                        format: '0', // Ensures that the y-axis does not show decimals
                                                    },
                                                    legend: 'none',
                                                }}
                                                rootProps={{ 'data-testid': '1' }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Leads;