import React, { useState, useEffect, useMemo, useContext } from 'react';
import SectionMenuLeft from '../../../components/SectionMenuLeft/SectionMenuLeft';
import { AdminSidebarContext } from '../../../../context/adminSidebarContext';
import { config } from '../../../../config';
import { ToastContainer } from 'react-toastify';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-toastify/dist/ReactToastify.css';
import ReactTable from '../../../components/ReactTable/ReactTable.jsx';
import "./ProductsServiceLeads.css";

function ProductsServiceLeads() {
    const { isSidebar } = useContext(AdminSidebarContext);
    const [storeId, setStoreId] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const vendor = JSON.parse(localStorage.getItem('vendor'));
    const vendor_id = vendor.uid;
    const [products, setProducts] = useState([]);

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

    const getProducts = async (store_id) => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/product/list/${store_id}`, {
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
                setProducts(result.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const store_id = await fetchVendorStore(vendor_id);
            if (store_id) {
                getProducts(store_id);
            }
        };

        fetchData();
    }, [vendor_id]);

    // Filtered products based on date
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const productDate = new Date(product.created_at);
            const isAfterStart = startDate ? productDate >= new Date(startDate) : true;
            const isBeforeEnd = endDate ? productDate <= new Date(endDate) : true;
            return isAfterStart && isBeforeEnd;
        });
    }, [products, startDate, endDate]);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
            },
            {
                accessorKey: 'price',
                header: 'Price',
            },
            {
                accessorKey: 'selling_price',
                header: 'Selling Price',
            },
            {
                accessorKey: 'created_at',
                header: 'Created At',
            },
        ],
        []
    );

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
                                        <h5>Total Products: {filteredProducts.length}</h5>
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
                                            <ReactTable columns={columns} data={filteredProducts} />
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

export default ProductsServiceLeads;
