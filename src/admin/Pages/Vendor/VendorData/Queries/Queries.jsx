import React, { useMemo, useState, useEffect } from 'react'
import './Queries.css'
import ReactTable from '../../../../components/ReactTable/ReactTable.jsx';
import { config } from '../../../../../config.js';
import { useParams } from 'react-router-dom';

const Queries = () => {
    const [queries, setQueries] = useState([])
    const { uid: store_id } = useParams();


    const fetchQueries = async () => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/queries?s=${store_id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            // Sort queries by created_at in descending order (most recent first)
            const sortedQueries = result.data.sort((a, b) => new Date(b.formatted_created_at) - new Date(a.formatted_created_at));
            setQueries(sortedQueries);
        } catch (error) {
            console.error('Fetching orders failed', error);
        }
    };

    useEffect(() => {
        fetchQueries();
    }, []);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'User',
            },
            {
                accessorKey: 'store_name',
                header: 'store',
            },
            {
                accessorKey: 'phone',
                header: 'Phone',
            },
            {
                accessorKey: 'message',
                header: 'Message',
            },
            {
                accessorKey: 'formatted_created_at',
                header: 'Created On',
            },

        ],
        []
    );

    return (
        <>
            <div className="wg-box wg-box-container">
                <div className="section-content-right">
                    <div className="chart-table-wrapper">
                        <div className="chart-table-item">
                            <ReactTable columns={columns} data={queries} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Queries