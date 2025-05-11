import React, { useState, useEffect, useMemo } from 'react';
import SectionMenuLeft from '../../components/SectionMenuLeft/SectionMenuLeft';
import { AdminSidebarContext } from '../../../context/adminSidebarContext';
import { useContext } from 'react';
import { config } from '../../../config';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import CustomSelect from '../../components/CustomSelect/CustomSelect.jsx';
import ReactTable from '../../components/ReactTable/ReactTable';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { FaEdit, FaRegTrashAlt, FaEye } from "react-icons/fa";
import './ToggleButton.css'
import './EditableCell.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsArrowLeft } from "react-icons/bs";


const BannersImages = () => {
    const { uid } = useParams();
    const { isSidebar } = useContext(AdminSidebarContext);
    const [bannersImagesCount, setbannersImagesCount] = useState(0);
    const [selectedOption, setSelectedOption] = useState({ value: 'all', label: 'All' });
    const [bannersImagesList, setBannersImagesList] = useState([]);
    const [bannerData, setBannerData] = useState({})

    const handleDelete = (uid) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this category?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            const response = await fetch(`${config.backEndBaseUrl}api/banner/images/delete/${uid}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            });
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            getBannerImages(selectedOption.value); // Refresh data after delete
                        } catch (error) {
                            console.error('Error deleting category:', error);
                        }
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    };

    const ToggleButton = ({ uid, initialStatus, onUpdate }) => {
        const [status, setStatus] = useState(initialStatus);

        const handleToggleChange = async () => {
            setStatus(!status);
            const newStatus = !status;
            try {
                const response = await fetch(`${config.backEndBaseUrl}api/banner/images/update/status/${uid}`, {
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


    const getBannerImages = async (status) => {
        let params = '';
        if (status !== 'all') {
            params = `?status=${status}`;
        }

        try {
            const response = await fetch(`${config.backEndBaseUrl}api/banner/images/list/${uid}${params}`, {
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
            setBannerData(result.bannerData)
            setBannersImagesList(result.data)
            setbannersImagesCount(result.data.length);
        } catch (error) {
            console.error('Fetching categories failed', error);
        }
    };

    useEffect(() => {
        getBannerImages(selectedOption.value);
    }, [selectedOption.value]);

    const options = useMemo(() => [
        { value: 'all', label: 'All' },
        { value: 1, label: 'Active' },
        { value: 0, label: 'Deactive' },
    ], []);

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption); // set selectedOption directly, no need for selectedOption.value
        getBannerImages(selectedOption.value)
    };

    const EditableCell = ({ id, initialValue, onSave, banner_id }) => {
        const [value, setValue] = useState(initialValue);
        const [isChanged, setIsChanged] = useState(false);
        const [isLoading, setIsLoading] = useState(false);

        useEffect(() => {
            setIsChanged(value !== initialValue);
        }, [value, initialValue]);

        const handleInputChange = (e) => {
            setValue(e.target.value);
        };

        const handleSave = async () => {
            setIsLoading(true);
            await onSave(id, value, banner_id);
            setIsLoading(false);
            setIsChanged(false);
        };

        return (
            <div className="editable-cell">
                <input
                    className="editable-input"
                    type="number"
                    value={value}
                    onChange={handleInputChange}
                    disabled={isLoading}
                />
                {isChanged && (
                    <button
                        className="editable-button"
                        onClick={handleSave}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="spinner">
                                {/* Spinner CSS here */}
                            </div>
                        ) : (
                            'Save'
                        )}
                    </button>
                )}
            </div>
        );
    };

    const handleSave = async (id, value, banner_id) => {
        if (!value) {
            toast.error('Please Select a value', {
                position: 'top-center',
            });
        } else {
            try {
                const response = await fetch(`${config.backEndBaseUrl}api/banner/images/update/rank/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        rank: value,
                        banner_id: banner_id
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                if (result.status) {
                    toast.success('Position Updated', {
                        position: 'top-center',
                    });
                    await getBannerImages(selectedOption.value);
                }
            } catch (error) {
                console.error('Updating category rank failed', error);
            }
        }
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'position',
                header: 'Position',
                Cell: ({ row, cell }) => (
                    <EditableCell
                        id={row.original.uid}
                        initialValue={cell.getValue()}
                        onSave={handleSave}
                        banner_id={row.original.banner_id}
                    />
                ),
            },
            {
                accessorKey: 'path',
                header: 'Image',
                Cell: ({ cell }) => {
                    return (
                        <Link to={`${config.backEndBaseUrl}${cell.row.original.path}`} >
                            <img alt=''
                                style={{ "height": "100px", "cursor": "pointer" }}
                                src={`${config.backEndBaseUrl}${cell.row.original.path}`}
                            />
                        </Link>
                    );
                },
            },
            {
                accessorKey: 'title',
                header: 'Title',
            },
            {
                accessorKey: 'link',
                header: 'Link',
                Cell: ({ cell }) => {
                    return (
                        <Link to={cell.row.original.link} style={{ 'cursor': 'pointer', color: 'blue' }}>
                            {cell.row.original.link}
                        </Link>
                    );
                },
            },
            {
                accessorKey: 'youtube_link',
                header: 'Youtube',
                Cell: ({ cell }) => {
                    return (
                        <Link to={cell.row.original.youtube_link} style={{ 'cursor': 'pointer', color: 'blue' }}>
                            {cell.row.original.youtube_link}
                        </Link>
                    );
                },
            },
            {
                accessorKey: 'status',
                header: 'Status',
                Cell: ({ cell }) => {
                    return (
                        <ToggleButton
                            uid={cell.row.original.uid}
                            initialStatus={cell.getValue()}
                            onUpdate={() => { getBannerImages(selectedOption.value) }}
                        />
                    );
                },
            },
            {
                accessorKey: 'uid',
                header: 'action',
                Cell: ({ cell }) => {
                    return (
                        <>
                            <div
                                className='actionBtn btn btn-lg btn-danger m-2'
                                onClick={() => handleDelete(cell.row.original.uid)}>
                                <FaRegTrashAlt />
                            </div>
                            <Link className='actionBtn btn btn-lg btn-dark text-light' to={`/admin/banner/image/update/${cell.row.original.uid}`}>
                                <FaEdit />
                            </Link>
                        </>
                    );
                },
            },
            {
                accessorKey: 'uid',
                header: 'analytics',
                Cell: ({ cell }) => (
                    <>
                        <Link className='actionBtn btn btn-lg btn-success' to={`/admin/leads/${cell.row.original.uid}`}>
                            <FaEye /> {cell.row.original.total_leads}
                        </Link>
                    </>
                ),
            },
        ],
        [selectedOption.value, bannersImagesList]
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
                                            <div className="flex items-center flex-wrap gap20 mb-27">
                                                <Link to={'/admin/banner/list'}
                                                    className='btn btn-lg btn-dark'
                                                    style={{ width: 'fit-content', fontSize: '20px', fontWeight: '700' }}>
                                                    <BsArrowLeft />
                                                </Link>
                                                <h3>
                                                    <span style={{ marginRight: 40 }}><b>{bannerData.title}</b> Images Count : <b>{bannersImagesCount}</b></span>
                                                </h3>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>

                                                    <Link to={`/admin/banner/image/add/${uid}`}>
                                                        <button className='btn btn-lg btn-success' style={{ width: 'fit-content', padding: '10px 15px', fontSize: '14px' }}>
                                                            Add Banner Image
                                                        </button>
                                                    </Link>
                                                    <CustomSelect
                                                        options={options}
                                                        onChange={handleChange}
                                                        value={options.find(option => option.value === selectedOption.value)}
                                                    />
                                                </div>
                                            </div>
                                            <ReactTable columns={columns} data={bannersImagesList} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>)

}

export default BannersImages;
