import React, { useContext, useEffect, useMemo, useState } from 'react';
import ReactTable from '../../components/ReactTable/ReactTable.jsx';
import { Link } from 'react-router-dom';
import { FaEye } from "react-icons/fa";
import { config } from '../../../config.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AdminSidebarContext } from '../../../context/adminSidebarContext';
import SectionMenuLeft from '../../components/SectionMenuLeft/SectionMenuLeft.jsx';
function Users() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [statusFilter, setStatusFilter] = useState('active');
    const [genderFilter, setGenderFilter] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state
    const { isSidebar } = useContext(AdminSidebarContext);

    const getUsers = async () => {
        setLoading(true); // Start loading
        try {
            const response = await fetch(`${config?.backEndBaseUrl}api/user?type=user&status=${statusFilter}`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            if (result.status && Array.isArray(result.data)) {
                setUsers(result.data);
                setFilteredUsers(result.data);
            } else {
                setUsers([]);
                setFilteredUsers([]);
            }
        } catch (error) {
            console.error('Fetching users failed:', error);
            setUsers([]);
            setFilteredUsers([]);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    useEffect(() => {
        getUsers();
    }, [statusFilter]);


    useEffect(() => {
        let filtered = users;

      

        if (genderFilter) {
            filtered = filtered.filter(user => user.gender === genderFilter);
        }

        if (startDate && endDate) {
            filtered = filtered.filter(user => {
                const createdAt = new Date(user.created_at);
                return createdAt >= startDate && createdAt <= endDate;
            });
        }

        setFilteredUsers(filtered);
    }, [statusFilter, genderFilter, startDate, endDate, users]);

    const formatNumber = (number) => {
        if (!number || isNaN(number)) return 0;
        if (number >= 1000000) return (number / 1000000).toFixed(1) + 'm';
        if (number >= 1000) return (number / 1000).toFixed(1) + 'k';
        return number;
    };

    const columns = useMemo(
        () => [
            { accessorKey: 'user_name', header: 'Name' },
            { accessorKey: 'phone', header: 'Number' },
            { accessorKey: 'gender', header: 'Gender' },
            {
                accessorKey: 'uid',
                header: 'Analytics',
                Cell: ({ cell }) => (
                    <Link className='actionBtn btn btn-lg btn-success' to={`/admin/user/leads/${cell.row.original.uid}`}>
                        <FaEye /> {formatNumber(cell.row.original.total_clicks)}
                    </Link>
                ),
            },
        ],
        [formatNumber]
    );

    return (
        <div className="body">
            <div id="wrapper">
                <div id="page" className="">
                    <div className="layout-wrap">
                        <SectionMenuLeft />
                        <div className="section-content-right">
                            <div className="main-content" style={{ paddingLeft: isSidebar ? '280px' : '0px' }}>
                                <div className="main-content-inner">
                                    <div className="main-content-wrap">
                                        <div className="tf-section">
                                            <div className="wg-box" style={{ marginBottom: '20px' }}>
                                                <div className="flex items-center justify-between">
                                                    <h5>Users Overview</h5>
                                                </div>

                                                {/* Show spinner while loading */}
                                                {loading ? (
                                                    <div className="loading-spinner" style={{ textAlign: 'center', padding: '20px' }}>
                                                        <div className="spinner-border text-primary" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="filters" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                                            <select onChange={(e) => setStatusFilter(e.target.value)}>
                                                                <option value="active">Active</option>
                                                                <option value="pending">Pending</option>
                                                                <option value="inactive">Inactive</option>
                                                            </select>
                                                            <select onChange={(e) => setGenderFilter(e.target.value)}>
                                                                <option value="">All Genders</option>
                                                                <option value="male">Male</option>
                                                                <option value="female">Female</option>
                                                            </select>
                                                            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} placeholderText="Start Date" />
                                                            <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} placeholderText="End Date" />
                                                        </div>
                                                        <ReactTable columns={columns} data={filteredUsers} />
                                                    </>
                                                )}
                                            </div>
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

export default Users;



