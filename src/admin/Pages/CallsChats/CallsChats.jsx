import React, { useMemo, useState, useEffect, useContext } from 'react';
import ReactTable from '../../components/ReactTable/ReactTable.jsx';
import SectionMenuLeft from '../../components/SectionMenuLeft/SectionMenuLeft.jsx';
import { AdminSidebarContext } from '../../../context/adminSidebarContext.js';
import { config } from '../../../config.js';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-confirm-alert/src/react-confirm-alert.css';


const CallsChats = () => {
    const { isSidebar } = useContext(AdminSidebarContext);
    const [chats, setChats] = useState([]);
    const [calls, setCalls] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isClearBtnShown, setIsClearBtnShown] = useState(false);


    const fetchCallsChats = async () => {
        try {
            let url = `${config.backEndBaseUrl}api/store/leads/calls-chats`;


            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            let result = await response.json();
            let filteredChats = result.data.leads.whatsApp;
            let filteredcalls = result.data.leads.phone;

            if (startDate && endDate) {
                filteredChats = filteredChats.filter(chats => {
                    const createdAt = new Date(chats.latest_created_at);
                    return createdAt >= startDate && createdAt <= endDate;
                });
            }

            if (startDate && endDate) {
                filteredcalls = filteredcalls.filter(calls => {
                    const createdAt = new Date(calls.latest_created_at);
                    return createdAt >= startDate && createdAt <= endDate;
                });
            }

            filteredcalls.sort((a, b) => new Date(b.latest_created_at) - new Date(a.latest_created_at));
            setCalls(filteredcalls);

            filteredChats.sort((a, b) => new Date(b.latest_created_at) - new Date(a.latest_created_at));
            setChats(filteredChats);
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
    };

    useEffect(() => {
        fetchCallsChats();

    }, [startDate, endDate]);

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
        fetchCallsChats();
    };







    const columns = useMemo(
        () => [
            {
                accessorKey: 'user_name',
                header: 'User',
            },
            {
                accessorKey: 'user_phone',
                header: 'User Phone',
            },
            {
                accessorKey: 'store_name',
                header: 'Store',
            },
            {
                accessorKey: 'latest_created_at',
                header: 'Latest Chat',
                cell: ({ cell }) => {
                    const rawValue = cell.getValue();
            
                    if (!rawValue) return 'N/A'; // Handle missing values gracefully
            
                    const datePart = rawValue.split('T')[0]; // Extract 'YYYY-MM-DD' part
                    return datePart || 'Invalid Date'; // Fallback if split fails
                }
            }
        ],
        []
    );

    return (
        <>
            <div className="body">
                <div id="wrapper">
                    <div id="page" className="">
                        <div className="layout-wrap">
                            <SectionMenuLeft />
                            <div className="section-content-right">
                                <div className="main-content" style={{ paddingLeft: isSidebar ? '280px' : '0px' }}>
                                    <div className="main-content-inner">
                                        <div className="items-center flex-wrap gap20 mb-27">
                                            
                                            <div style={{
                                                display: 'flex',
                                                fontSize: '13px',
                                                alignItems: 'center',
                                                gap: '10px',
                                                zIndex: '10',
                                                outline: '1px solid lightgray',
                                                padding: '10px',
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
                                                        className='btn btn-lg btn-dark'
                                                        style={{ width: 'fit-content', padding: '10px 15px', fontSize: '14px' }}
                                                        onClick={() => hideClearBtn()}>
                                                        Clear
                                                    </button>
                                                }
                                            </div>
                                        </div>
                                        <h3 className="mb-5 mt-5">Chats</h3>
                                        <hr />
                                        <ReactTable columns={columns} data={chats} />
                                        <h3 className="mb-5 mt-5">Calls</h3>
                                        <hr />
                                        <ReactTable columns={columns} data={calls} />
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

export default CallsChats;