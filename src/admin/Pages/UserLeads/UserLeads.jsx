import React, { useState, useEffect, useMemo, useContext } from 'react';
import SectionMenuLeft from '../../components/SectionMenuLeft/SectionMenuLeft';
import { AdminSidebarContext } from '../../../context/adminSidebarContext';
import { config } from '../../../config';
import { useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-toastify/dist/ReactToastify.css';
import { Chart } from 'react-google-charts';
import "./UserLeads.css";
import ReactTable from '../../components/ReactTable/ReactTable.jsx';

function UserLeads() {
    const { isSidebar } = useContext(AdminSidebarContext);
    const { uid } = useParams();
    const [leads, setLeads] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedTypes, setSelectedTypes] = useState([]);

    // Fetch leads based on user ID
    const getLeads = async (uid) => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/clicks/${uid}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setLeads(result.data);

        } catch (error) {
            console.error('Fetching leads failed', error);
        }
    };

    useEffect(() => {
        getLeads(uid);
    }, [uid]);

    // Filter leads by date range and type
    const filteredLeads = useMemo(() => {
        if (!startDate && !endDate && selectedTypes.length === 0) {
            return leads;
        }

        return leads.filter(lead => {
            const leadDate = new Date(lead.created_at);
            const withinDateRange = (!startDate || leadDate >= startDate) && (!endDate || leadDate <= endDate);
            const matchesType = selectedTypes.length === 0 || selectedTypes.includes(lead.type);

            return withinDateRange && matchesType;
        });
    }, [leads, startDate, endDate, selectedTypes]);

    // Prepare pie chart data
    const pieChartData = useMemo(() => {
        if (filteredLeads.length === 0) return [];

        const typeItemCounts = filteredLeads.reduce((acc, lead) => {
            const label = `${lead.type} - ${lead.item_name}`;
            acc[label] = (acc[label] || 0) + 1;
            return acc;
        }, {});

        const data = [['Visited Item', 'Number of Leads']];
        for (const [label, count] of Object.entries(typeItemCounts)) {
            data.push([`${label} (${count})`, count]);
        }

        return data;
    }, [filteredLeads]);

    // Prepare line chart data
    const dailyActivityData = useMemo(() => {
        if (filteredLeads.length === 0) return [];

        const dateCounts = filteredLeads.reduce((acc, lead) => {
            const date = new Date(lead.created_at).toDateString();
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        const data = [['Date', 'Clicks']];
        for (const [date, count] of Object.entries(dateCounts)) {
            data.push([date, count]);
        }

        data.sort((a, b) => new Date(a[0]) - new Date(b[0]));

        return data;
    }, [filteredLeads]);

    // Define columns for the table
    const columns = useMemo(
        () => [
            {
                accessorKey: 'created_at',
                header: 'Date',
            },
            {
                accessorKey: 'type',
                header: 'Visited',
            },
            {
                accessorKey: 'item_name',
                header: 'Name',
            },
        ],
        []
    );

    // Get unique types
    const allTypes = [...new Set(leads.map(lead => lead.type))];

    // Handle type filter change
    const handleTypeChange = (event) => {
        const { value, checked } = event.target;
        setSelectedTypes(prev => {
            if (checked) {
                return [...prev, value];
            } else {
                return prev.filter(type => type !== value);
            }
        });
    };

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
                                        <div className="type-filter">
                                            <h5>Filter by Type:</h5>
                                            {allTypes.map(type => (
                                                <label key={type} className="type-filter-item">
                                                    <input
                                                        type="checkbox"
                                                        value={type}
                                                        checked={selectedTypes.includes(type)}
                                                        onChange={handleTypeChange}
                                                    />
                                                    {type}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="chart-table-wrapper">
                                        

                                        {filteredLeads.length === 0 ? (
                                            <div className="chart-table-item no-data">
                                                <p>No Data available.</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="chart-table-item chart-container">
                                                    <Chart
                                                        className='chart'
                                                        width={'100%'}
                                                        height={'400px'}
                                                        chartType="PieChart"
                                                        loader={<div>Loading Chart</div>}
                                                        data={pieChartData}
                                                        options={{
                                                            title: 'Total Clicks by Item',
                                                            pieSliceText: 'label',
                                                            legend: { position: 'right' },
                                                            is3D: true,
                                                            tooltip: { text: 'percentage' },
                                                        }}
                                                        rootProps={{ 'data-testid': '1' }}
                                                    />
                                                </div>
                                                <div className="chart-table-item chart-container">
                                                    <Chart
                                                        className='chart'
                                                        width={'100%'}
                                                        height={'400px'}
                                                        chartType="LineChart"
                                                        loader={<div>Loading Chart</div>}
                                                        data={dailyActivityData}
                                                        options={{
                                                            title: 'Daily Activity',
                                                            legend: { position: 'bottom' },
                                                            hAxis: {
                                                                title: 'Date',
                                                                format: 'MMM d, yyyy'
                                                            },
                                                            vAxis: {
                                                                title: 'Number of Clicks per day'
                                                            },
                                                        }}
                                                        rootProps={{ 'data-testid': '2' }}
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
}

export default UserLeads;
