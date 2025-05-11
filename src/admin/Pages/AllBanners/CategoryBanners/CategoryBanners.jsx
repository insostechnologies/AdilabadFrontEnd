import React, { useState, useEffect, useMemo } from 'react';
import ReactTable from '../../../components/ReactTable/ReactTable.jsx';
import { config } from '../../../../config';
import { Link } from 'react-router-dom';
import CustomSelect from '../../../components/CustomSelect/CustomSelect.jsx';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import '../ToggleButton.css'
import '../EditableCell.css'
import 'react-tabs/style/react-tabs.css';

function CategoryBanners() {
    const [bannersCount, setbannersCount] = useState(0);
    const [selectedOption, setSelectedOption] = useState({ value: 'all', label: 'All' });
    const [bannersList, setBannersList] = useState([]);

    const getBanners = async (status) => {
        let params = '';
        if (status !== 'all') {
            params = `?banner_status=${status}`;
        }

        console.log(`${config.backEndBaseUrl}api/banner${params}`)

        try {
            const response = await fetch(`${config.backEndBaseUrl}api/category/parents${params}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log(result)
            setBannersList(result.data);
            setbannersCount(result.data.length);

        } catch (error) {
            console.error('Fetching banners failed', error);
        }
    };
    const options = useMemo(() => [
        { value: 'all', label: 'All' },
        { value: 1, label: 'Active' },
        { value: 0, label: 'Deactive' },
    ], []);


    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: `Category Name `,
            },
            {
                accessorKey: 'created_at',
                header: 'Created On',
            },
            {
                accessorKey: 'banners',
                header: 'Banners',
                Cell: ({ cell }) => {
                    return (
                        <Link className='btn btn-lg btn-success' to={`/admin/category/banner/image/${cell.row.original.uid}`}>
                            View Images ({cell.row.original.banner_count})
                        </Link>
                    );
                },
            },
            {
                accessorKey: 'banner_status',
                header: 'Status',
                Cell: ({ cell }) => {
                    return (
                        <ToggleButton
                            uid={cell.row.original.uid}
                            initialStatus={cell.getValue() === 1}
                            onUpdate={() => { getBanners(selectedOption.value) }} // Refresh data after status update
                        />
                    );
                },
            },
            {
                accessorKey: 'banners',
                header: 'Banners',
                Cell: ({ cell }) => {
                    return (
                        <Link className='btn btn-lg btn-success' to={`/admin/category/banner/add/${cell.row.original.uid}`}>
                            Add Banner 
                        </Link>
                    );
                },
            },
        ],
        [selectedOption.value, bannersList]
    );

    useEffect(() => {
        getBanners(selectedOption.value);
    }, [selectedOption.value]);

    const ToggleButton = ({ uid, initialStatus, onUpdate }) => {
        const [status, setStatus] = useState(initialStatus);

        const handleToggleChange = async () => {
            setStatus(!status);
            const newStatus = !status;
            try {
                const response = await fetch(`${config.backEndBaseUrl}api/banner/category/update/status/${uid}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                setStatus(newStatus);
                if (onUpdate) onUpdate(); // Notify parent component to refresh data
            } catch (error) {
                console.error('Error updating status:', error);
            }
        };

        return (
            <div className="toggle-container" onClick={handleToggleChange}>
                <div className={`toggle-switch ${status ? 'active' : ''}`}>
                    <div className="toggle-knob"></div>
                </div>
                <span className={`toggle-text ${status ? 'active' : ''}`}>{status ? 'active' : 'deactive'}</span>
            </div>
        );
    };


    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption); // set selectedOption directly, no need for selectedOption.value
        getBanners(selectedOption.value)
    };

    return (
        <>

            <div className="main-content-wrap">
                <div className="flex items-center flex-wrap gap20 mb-27">
                    <h3>
                        <span style={{ marginRight: 40 }}>All Category Count : <b>{bannersCount}</b></span>
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
                        {/* <Link to="/admin/category/banner/add/">
                            <button className='btn btn-lg btn-success' style={{ width: 'fit-content', padding: '10px 15px', fontSize: '14px' }}>
                                Add Banners
                            </button>
                        </Link> */}
                       <CustomSelect
                            options={options}
                            onChange={handleChange}
                            value={options.find(option => option.value === selectedOption.value)}
                        />
                    </div>
                </div>
                <ReactTable columns={columns} data={bannersList} />
            </div>


        </>
    )
}

export default CategoryBanners