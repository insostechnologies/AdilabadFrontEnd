import React, { useState, useEffect, useMemo, useContext } from 'react';
import SectionMenuLeft from '../../components/SectionMenuLeft/SectionMenuLeft';
import { AdminSidebarContext } from '../../../context/adminSidebarContext';
import ReactTable from '../../components/ReactTable/ReactTable.jsx';
import { config } from '../../../config';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";
import { Link, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';

function StoreAnalitycs() {
    const { isSidebar } = useContext(AdminSidebarContext);
    const storeId = useParams().uid;
    const [analitycData, setAnalitycData] = useState([]);
    const [totalViews, setTotalViews] = useState(0);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const getAnalitycData = async () => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/store/analitycs/${storeId}`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.status) {
                setAnalitycData(result.data);
                const total = result.data.reduce((sum, item) => sum + item.total_views, 0);
                setTotalViews(total);
            }
        } catch (error) {
            console.error('Fetching analytics data failed', error);
        }
    };

    useEffect(() => {
        getAnalitycData();
    }, []);

    // Filter & Sort Data: Recent First
    const filteredData = useMemo(() => {
        return analitycData
            .filter(item => {
                const viewDate = new Date(item.last_view);
                if (startDate && viewDate < startDate) return false;
                if (endDate && viewDate > endDate) return false;
                return true;
            })
            .sort((a, b) => new Date(b.last_view) - new Date(a.last_view)); // Sort: Recent First
    }, [analitycData, startDate, endDate]);

    const columns = useMemo(
        () => [
            { accessorKey: 'last_view', header: 'Last Visited' },
            { accessorKey: 'user_name', header: 'User' },
            { accessorKey: 'phone', header: 'Number' },
            { accessorKey: 'gender', header: 'Gender' },
            {
                accessorKey: 'total_views',
                header: 'Views',
                Cell: ({ row }) => (
                    <Link className="actionBtn btn btn-lg btn-info text-light" style={{ cursor: 'pointer' }}>
                        {row.original.total_views}
                    </Link>
                ),
            },
        ],
        []
    );

    return (
        <>
            <div className="body">
                <ToastContainer />
                <div id="wrapper">
                    <div id="page" className="">
                        <div className="layout-wrap">
                            <SectionMenuLeft />
                            <div className="section-content-right">
                                <div className="main-content" style={{ paddingLeft: isSidebar ? '280px' : '0px' }}>
                                    <div className="main-content-inner">
                                        <div className="main-content-wrap">
                                            <h4>Store Analytics</h4>
                                            <h3>Total Views: {totalViews}</h3>

                                            {/* Styled Date Filters */}
                                            <div className="filters" style={{
                                                display: 'flex',
                                                gap: '10px',
                                                marginBottom: '15px',
                                                alignItems: 'center'
                                            }}>
                                                <label style={{ fontWeight: 'bold' }}>From:</label>
                                                <DatePicker
                                                    selected={startDate}
                                                    onChange={date => setStartDate(date)}
                                                    placeholderText="Start Date"
                                                    className="date-picker"
                                                />
                                                <label style={{ fontWeight: 'bold' }}>To:</label>
                                                <DatePicker
                                                    selected={endDate}
                                                    onChange={date => setEndDate(date)}
                                                    placeholderText="End Date"
                                                    className="date-picker"
                                                />
                                            </div>

                                            <ReactTable columns={columns} data={filteredData} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Custom Styles for Date Inputs */}
            <style>
                {`
                    .date-picker {
                        border: 1px solid #ddd;
                        padding: 8px 12px;
                        border-radius: 5px;
                        font-size: 14px;
                        width: 150px;
                        transition: 0.2s;
                    }

                    .date-picker:focus {
                        border-color: #007bff;
                        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
                        outline: none;
                    }

                    .filters label {
                        font-size: 14px;
                    }
                `}
            </style>
        </>
    );
}

export default StoreAnalitycs;
