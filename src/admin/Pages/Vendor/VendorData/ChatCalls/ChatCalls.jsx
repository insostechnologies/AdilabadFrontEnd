import React, { useState, useEffect, useMemo, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactTable from '../../../../components/ReactTable/ReactTable.jsx';
import './ChatCalls.css'
import { config } from '../../../../../config';
import { Link, useParams } from 'react-router-dom';
import { BsWhatsapp, BsTelephone } from "react-icons/bs";


function ChatCalls() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [leads, setLeads] = useState([]);
    const [leadsUsers, setLeadsUsers] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const { uid: store_id } = useParams();



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

    const getLeads = async () => {
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
    
            // Sort the leads by `created_at` in descending order (most recent first)
            const sortedLeads = result.data.sort((a, b) => {
                const dateA = new Date(a.created_at); // Convert to Date object
                const dateB = new Date(b.created_at);
                return dateB - dateA; // Descending order
            });
    
            // Process the leads to get unique users with all their lead types
            const uniqueUsersWithLeads = processLeads(sortedLeads);
    
            // Set the processed leads
            setLeads(sortedLeads);
            setLeadsUsers(uniqueUsersWithLeads);
    
        } catch (error) {
            console.error('Fetching leads failed', error);
        }
    };
    



    useEffect(() => {
        getLeads()
    }, [])



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
                Cell: ({ cell, row }) => {
                   
                    return (row.original.created_at);
                }
            },
            {
                accessorKey: 'user_name',
                header: 'Name',
            },
            {
                accessorKey: 'phone',
                header: 'Number',
            },
            {
                accessorKey: 'phone',
                header: 'Contact',
                Cell: ({ cell, row }) => {
                    const phoneNumber = cell.getValue(); // Assuming phone number is available in the cell

                    return (
                        <div>
                            {phoneNumber && (
                                <>
                                    <a href={`tel:${phoneNumber}`} className="actionBtn btn btn-lg btn-secondary" style={{ margin: '8px', padding: '10px' }}>
                                        <BsTelephone style={{ fontSize: '20px', fontWeight: '700' }} />
                                        <span className='count_type'>{row.original.lead_types.phone || 0}</span>
                                    </a>
                                    <a href={`https://wa.me/${phoneNumber}`} className="actionBtn btn btn-lg btn-success" style={{ margin: '8px', padding: '10px' }}>
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
                                    <Link className='actionBtn btn btn-lg btn-success text-light ' to={`/admin/leads/chart/${row.original.uid}?type=phone,whatsapp`}>
                                        <span>{(row.original.lead_types.whatsapp || 0) + (row.original.lead_types.phone || 0)}</span> Times
                                    </Link>
                                </>
                            )}
                        </div>
                    );
                }
            },
        ],
        []
    );

    const totalCalls = leadsUsers ? leadsUsers.reduce((sum, lead) => sum + (lead.lead_types?.phone || 0), 0) : 0;
    const totalChats = leadsUsers ? leadsUsers.reduce((sum, lead) => sum + (lead.lead_types?.whatsapp || 0), 0) : 0;


    return (
        <>
            <ToastContainer />
            <div className="wg-box wg-box-container">

                <div className="section-content-right">

                    <div className='totals'>
                        {/* <h5>Total Leads: {totalLeads}</h5> */}
                        <h5>Total Call Received: {totalCalls}</h5>
                        <h5>Total Chat Received: {totalChats}</h5>

                    </div>
                    <div className="chart-table-wrapper">
                        <div className="chart-table-item">
                            <ReactTable columns={columns} data={filteredLeads} />
                        </div>
                    </div>

                </div>

            </div>
        </>
    )
}

export default ChatCalls