import React, { useState, useEffect, useMemo } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import './ToggleButton.css'
import './EditableCell.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { config } from '../../../../config';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProductImages.css'
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import CustomSelect from '../../../components/CustomSelect/CustomSelect.jsx';
import ReactTable from '../../../components/ReactTable/ReactTable.jsx';
import { useParams } from 'react-router-dom';
import SectionMenuLeft from '../../../components/SectionMenuLeft/SectionMenuLeft.jsx';
import { AdminSidebarContext } from '../../../../context/adminSidebarContext';
import { useContext } from 'react';

function ProductImages() {
    const { isSidebar } = useContext(AdminSidebarContext);
    const [productCount, setProductCount] = useState(0);
    const [selectedOption, setSelectedOption] = useState({ value: 'all', label: 'All' });
    const [productList, setProductList] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isClearBtnShown, setIsClearBtnShown] = useState(false)
    const { uid } = useParams();
    const [productName, setProductName] = useState('')
    const [productStoreUid, setProducStoretUid] = useState('')

    const handleDateChange = (newStartDate, newEndDate) => {
        // console.log(newStartDate, newEndDate);
        let dates = {
            newStartDate: newStartDate,
            newEndDate: newEndDate
        };
        getProducts(selectedOption.value, dates);
        setIsClearBtnShown(true)
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
        handleDateChange(date, endDate);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        handleDateChange(startDate, date);
    };

    const hideClearBtn = () => {
        setIsClearBtnShown(false)
        setStartDate(null)
        setEndDate(null)
        getProducts(selectedOption.value);
    }

    const fetchProduct = async (uid) => {

		try {
			const response = await fetch(`${config.backEndBaseUrl}api/product/${uid}`, {
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'GET',
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			
            

			if(result.status){
                setProductName(result.data.name)
                setProducStoretUid(result.data.store_id)

            }
		} catch (error) {
			console.error('Fetching banners failed', error);
		}
    }   

    useEffect(()=>{
        fetchProduct(uid);
    },[uid])


    const handleDelete = (uid) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this category?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            const response = await fetch(`${config.backEndBaseUrl}api/product/image/delete/${uid}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            });
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            getProducts(selectedOption.value); // Refresh data after delete
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

    const getProducts = async (status, dates) => {
        let params = '';
        if (status !== 'all') {
            params += `?status=${status}`;
        }
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/product/images/${uid}${params}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            let covers = result.data

            if (dates) {
                const { newStartDate, newEndDate } = dates;
                if (newStartDate && newEndDate) {
                    covers = covers.filter(item => {
                        const createdAt = new Date(item.created_at);
                        return createdAt >= newStartDate && createdAt <= newEndDate;
                    });
                }
            }

            console.log(covers)
            setProductList(covers);
            setProductCount(covers.length);

        } catch (error) {
            console.error('Fetching banners failed', error);
        }
    };
    const options = useMemo(() => [
        { value: 'all', label: 'All' },
        { value: 1, label: 'Active' },
        { value: 0, label: 'Deactive' },
    ], []);

    const ToggleButton = ({ uid, initialStatus, onUpdate }) => {
        const [status, setStatus] = useState(initialStatus);

        const handleToggleChange = async () => {
            setStatus(!status);
            const newStatus = !status;
            try {
                const response = await fetch(`${config.backEndBaseUrl}api/product/image/update/status/${uid}`, {
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

    const EditableCell = ({ id, initialValue, onSave, page }) => {
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
            await onSave(id, value, page);
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

    const handleSave = async (id, value, page) => {
        if (!value) {
            toast.error('Please Select a value', {
                position: 'top-center',
            });
        } else {
            try {
                const response = await fetch(`${config.backEndBaseUrl}api/product/image/update/rank/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        rank: value,
                        page: page,
                        product_id: uid
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
                    await getProducts(selectedOption.value);
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
                        page={row.original.page}
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
                header: 'title',
            },
            {
                accessorKey: 'link',
                header: 'link',
                Cell: ({ cell }) => {
                    return (
                        <Link to={cell.row.original.link} style={{ cursor: 'pointer', color: 'blue' }}>
                            {cell.row.original.link}
                        </Link>
                    );
                },
            },
            {
                accessorKey: 'created_by',
                header: 'Created By',
            },
            {
                accessorKey: 'created_at',
                header: 'Created On',
            },
            {
                accessorKey: 'status',
                header: 'Status',
                Cell: ({ cell }) => {
                    return (
                        <ToggleButton
                            uid={cell.row.original.uid}
                            initialStatus={cell.getValue() === 1}
                            onUpdate={() => { getProducts(selectedOption.value) }} // Refresh data after status update
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
                            <Link className='actionBtn btn btn-lg btn-dark text-light' to={`/admin/product/image/update/${cell.row.original.uid}`}>
                                <FaEdit />
                            </Link>
                        </>
                    );
                },
            }
        ],
        [selectedOption.value, productList]
    );

    useEffect(() => {
        getProducts(selectedOption.value);
    }, [selectedOption.value]);


    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        getProducts(selectedOption.value)
    };



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
                                                <h3>
                                                    <span style={{ marginRight: 40 }}><Link to={`/admin/store/products/${productStoreUid}`} style={{color: 'blue', cursor: 'pointer'}}>{productName}</Link> Images Count : <b>{productCount}</b></span>
                                                </h3>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
                                                    <Link to={`/admin/store/product/image/add/${uid}`}>
                                                        <button className='btn btn-lg btn-success' style={{ width: 'fit-content', padding: '10px 15px', fontSize: '14px' }}>
                                                            Add Product Image
                                                        </button>
                                                    </Link>
                                                    <CustomSelect
                                                        options={options}
                                                        onChange={handleChange}
                                                        value={options.find(option => option.value === selectedOption.value)}
                                                    />
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
                                            </div>
                                            <ReactTable columns={columns} data={productList} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>



    )
}

export default ProductImages