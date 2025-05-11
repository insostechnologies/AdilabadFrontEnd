import React, { useState, useEffect, useMemo, useContext } from 'react';
import { config } from '../../../../../config';
import { ToastContainer } from 'react-toastify';
import "react-datepicker/dist/react-datepicker.css";
import 'react-toastify/dist/ReactToastify.css';
import ReactTable from '../../../../components/ReactTable/ReactTable.jsx';
import { Link, useParams } from 'react-router-dom';
import { BsWhatsapp, BsTelephone } from "react-icons/bs";
import './Followers.css'

function Followers() {
    const { uid } = useParams();
    const store_id = uid;
    const [followers, setFollowers] = useState([]);  // Ensure it's initialized as an empty array
    const [filteredFollowers, setFilteredFollowers] = useState([]);  // For filtered followers
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);


    const getFollowers = async (store_id) => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/store/followers/${store_id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.status) {
                // Sort followers by `created_at` in descending order (most recent first)
                const sortedFollowers = result.data.sort((a, b) => {
                    const dateA = new Date(a.created_at); // Convert to Date object
                    const dateB = new Date(b.created_at);
                    return dateB - dateA; // Descending order
                });

                setFollowers(sortedFollowers);
                setFilteredFollowers(sortedFollowers); // Initialize filteredFollowers with sorted data
            }
        } catch (error) {
            console.error('Fetching followers failed', error);
        }
    };


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
                accessorKey: 'user.user_name',  // Access user_name from the user object
                header: 'Name',
            },
            {
                accessorKey: 'user.phone', // Access phone from the user object
                header: 'Number',
            },

            {
                accessorKey: 'user',  // The full user object, for contacts
                header: 'Contact',
                Cell: ({ cell }) => {
                    const user = cell.getValue();  // Access the user object
                    const phoneNumber = user?.phone;  // Access phone number from user object
                    return (
                        <div>
                            {phoneNumber && (
                                <>
                                    <a href={`tel:${phoneNumber}`} className="actionBtn btn btn-lg btn-secondary" style={{ margin: '8px', padding: '10px' }}>
                                        <BsTelephone style={{ fontSize: '20px', fontWeight: '700' }} />
                                    </a>
                                    <a href={`https://wa.me/${phoneNumber}`} className="actionBtn btn btn-lg btn-success" style={{ margin: '8px', padding: '10px' }}>
                                        <BsWhatsapp style={{ fontSize: '20px', fontWeight: '700' }} />
                                    </a>
                                </>
                            )}
                        </div>
                    );
                },
            },
        ],
        []
    );

    // Filter followers based on selected date range
    useEffect(() => {
        const filterFollowersByDate = () => {
            if (!startDate && !endDate) {
                setFilteredFollowers(followers); // No filter, show all
                return;
            }

            const filteredData = followers.filter(follower => {
                const createdAt = new Date(follower.created_at);
                const isAfterStart = !startDate || createdAt >= new Date(startDate);
                const isBeforeEnd = !endDate || createdAt <= new Date(endDate);
                return isAfterStart && isBeforeEnd;
            });

            setFilteredFollowers(filteredData);
        };

        filterFollowersByDate(); // Call filter function
    }, [startDate, endDate, followers]);

    useEffect(() => {

        getFollowers(store_id);

    }, [store_id]);

    return (
        <>
            <ToastContainer />
            <div className="wg-box wg-box-container">

                <div className="section-content-right">

                    <div className='totals'>
                        <h5>Total Followers: {filteredFollowers.length}</h5>
                    </div>
                    <div className="chart-table-wrapper">
                        <div className="chart-table-item">
                            <ReactTable columns={columns} data={filteredFollowers} />
                        </div>
                    </div>

                </div>

            </div>
        </>
    );
}

export default Followers;
