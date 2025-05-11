import React, { useState, useEffect, useMemo, useContext } from 'react';
import SectionMenuLeft from '../../../components/SectionMenuLeft/SectionMenuLeft';
import { AdminSidebarContext } from '../../../../context/adminSidebarContext';
import { config } from '../../../../config';
import { ToastContainer } from 'react-toastify';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-toastify/dist/ReactToastify.css';
import ReactTable from '../../../components/ReactTable/ReactTable.jsx';
import "./ChatCallLeads.css";
import { Link } from 'react-router-dom';
import { BsWhatsapp, BsTelephone } from "react-icons/bs";
import { formatPhoneNumber } from '../../../../utils/helper';
const ChatCallLeads = () => {
    const { isSidebar } = useContext(AdminSidebarContext);
    const [leads, setLeads] = useState([]);
    const [leadsUsers, setLeadsUsers] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [storeId, setStoreId] = useState('');
    const [vendorUser, setVendorUser] = useState(null)

    const vendor = JSON.parse(localStorage.getItem('vendor'));
    const vendor_id = vendor.uid;

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

    const processLeads = (leadsData) => {
        const userMap = {};

        // Iterate over all lead types
        leadsData.forEach((leadType) => {
            leadType.leads.forEach((lead) => {
                const { user_id, user, type, total_leads } = lead;

                // If the user doesn't exist in the map, initialize them
                if (!userMap[user_id]) {
                    userMap[user_id] = {
                        ...user,
                        total_leads: 0,
                        lead_types: {},
                    };
                }

                // Increment total leads and add lead type data
                userMap[user_id].total_leads += total_leads;
                userMap[user_id].lead_types[type] = total_leads;
            });
        });

        // Convert the map to an array
        return Object.values(userMap);
    };

    const getLeads = async (store_id) => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/store/leads?store_id=${store_id}&type=phone,whatsapp`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            // Process the leads to get unique users with all their lead types
            const sortedData = result.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            const uniqueUsersWithLeads = processLeads(result.data);


            // Set the processed leads
            setLeads(sortedData)
            setLeadsUsers(uniqueUsersWithLeads);

        } catch (error) {
            console.error('Fetching leads failed', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const store_id = await fetchVendorStore(vendor_id);
            if (store_id) {
                getLeads(store_id);
            }
        };
        fetchData();
        fetchVendorUser()
    }, [vendor_id]);

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

    const filteredLeads = useMemo(() => {
        if (!startDate && !endDate && selectedTypes.length === 0) {
            return leadsUsers || [];
        }

        return (leadsUsers || []).filter(lead => {
            const leadDate = new Date(lead.created_at);
            const withinDateRange = (!startDate || leadDate >= startDate) && (!endDate || leadDate <= endDate);
            const matchesType = selectedTypes.length === 0 || selectedTypes.includes(lead.type);

            return withinDateRange && matchesType;
        });
    }, [leadsUsers, startDate, endDate, selectedTypes]);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'created_at',
                header: 'Date',
            },
            {
                accessorKey: 'user_name',
                header: 'Name',
            },
            {
                accessorKey: 'phone',
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
                accessorKey: 'phone',
                header: 'Contact',
                Cell: ({ cell, row }) => {
                    const phoneNumber = cell.getValue(); // Assuming phone number is available in the cell
                    const isDisabled = vendorUser?.view_calls !== "1"; // Determine if the button should be disabled

                    return (
                        <div>
                            {phoneNumber && (
                                <>
                                    <a href={isDisabled ? '#' : `tel:${formatPhoneNumber(phoneNumber)}`} className={`actionBtn btn btn-lg btn-secondary ${isDisabled ? 'disabled' : ''}`} style={{ margin: '8px', padding: '10px' }} >
                                        <BsTelephone style={{ fontSize: '20px', fontWeight: '700' }} />
                                        <span className='count_type'>{row.original.lead_types.phone || 0}</span>
                                    </a>
                                    <a href={isDisabled ? '#' : `https://wa.me/${formatPhoneNumber(phoneNumber)}`} className={`actionBtn btn btn-lg btn-success ${isDisabled ? 'disabled' : ''}`} style={{ margin: '8px', padding: '10px' }} >
                                        <BsWhatsapp style={{ fontSize: '20px', fontWeight: '700' }} />
                                        <span className='count_type'>{row.original.lead_types.whatsapp || 0}</span>
                                    </a>
                                </>
                            )}
                        </div>
                    );
                }
            },

            {
                accessorKey: 'phone',
                header: 'History',
                Cell: ({ cell, row }) => {
                    const phoneNumber = cell.getValue(); // Assuming phone number is available in the cell
                    return (
                        <div>
                            {phoneNumber && (
                                <>
                                    <Link className='actionBtn btn btn-lg btn-success text-light ' to={`/vendor/leads/chart/${row.original.uid}?type=phone,whatsapp`}>
                                        <span>{(row.original.lead_types.whatsapp || 0) + (row.original.lead_types.phone || 0)}</span> Times
                                    </Link>
                                </>
                            )}
                        </div>
                    );
                }
            },
        ],
        [vendorUser]
    );
    // Calculate total leads, calls, and chats
    // Calculate total leads, calls, and chats
    // const totalLeads = leadsUsers ? leadsUsers.reduce((sum, lead) => sum + (lead.total_leads || 0), 0) : 0;
    const totalCalls = leadsUsers ? leadsUsers.reduce((sum, lead) => sum + (lead.lead_types?.phone || 0), 0) : 0;
    const totalChats = leadsUsers ? leadsUsers.reduce((sum, lead) => sum + (lead.lead_types?.whatsapp || 0), 0) : 0;



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
                                        {/* <h5>Total Leads: {totalLeads}</h5> */}
                                        <h5>Total Call Received: {totalCalls}</h5>
                                        <h5>Total Chat Received: {totalChats}</h5>

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

export default ChatCallLeads;