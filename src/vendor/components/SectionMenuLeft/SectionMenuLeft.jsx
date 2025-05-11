import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { config } from '../../../config';
import { AdminSidebarContext } from '../../../context/adminSidebarContext';
import { AiFillCopyrightCircle } from 'react-icons/ai';

function SectionMenuLeft() {
    const { frontEndBaseUrl } = config;
    const { toggle, isSidebar } = useContext(AdminSidebarContext);
    const sidebarRef = useRef(null);
    const [storeId, setStoreId] = useState('');
    const [userVendor, setUserVendor] = useState(null);
    const [isUserVendorActive, setIsUserVendorActive] = useState('');
    const [title, setTitle] = useState('')



    let vendor = JSON.parse(localStorage.getItem('vendor'))
    let vendor_id = vendor.uid

    const fetchVendor = async (vendor_id) => {
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
                setUserVendor(result.data)
                console.log(result.data)
            }

        } catch (error) {
            console.error('Error fetching categories:', error);
            // Handle error state or display error message
        }
    }

    useEffect(() => {
        fetchVendor(vendor_id)
    }, [vendor_id])

    // Close sidebar when clicking outside
    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target) && window.innerWidth <= 768) {
            if (isSidebar) {
                toggle();
            }
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSidebar]);

    // Close sidebar on link click
    const handleSidebarClose = () => {
        if (window.innerWidth <= 768) {
            toggle();
        }
    };

    // Fetch vendor and store data
    useEffect(() => {
        const vendor = JSON.parse(localStorage.getItem('vendor'));
        if (!vendor) {
            console.error('Vendor data not found in localStorage.');
            return;
        }

        const vendor_id = vendor.uid;

        const fetchVendorStore = async (id) => {
            try {
                const response = await fetch(`${config.backEndBaseUrl}api/user/vendor/store/${id}`);
                const result = await response.json();
                if (result.status) setStoreId(result.store_id);
            } catch (error) {
                console.error('Error fetching vendor store:', error);
            }
        };

        const fetchVendor = async (id) => {
            try {
                const response = await fetch(`${config.backEndBaseUrl}api/user/${id}`);
                const result = await response.json();
                if (result.status) {
                    setUserVendor(result.data);
                    setIsUserVendorActive(result.data.vendor_status);
                }
            } catch (error) {
                console.error('Error fetching vendor:', error);
            }
        };

        const fetchAdmin = async () => {
            try {

                // Send the request
                const response = await fetch(`${config.backEndBaseUrl}api/user/${'8bf0589fef541a20'}?q=v`, {
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
                    setTitle(result.data.seoVendorDetails.name)
                } else {
                    console.log('internal server error')
                }

            } catch (error) {
                console.error('Error update data:', error);
            }
        }
        fetchAdmin()
        fetchVendorStore(vendor_id);
        fetchVendor(vendor_id);
    }, []);

    // Logout handler
    const handleLogout = () => {
        localStorage.removeItem('vendorUserId');
        localStorage.removeItem('vendorAuthToken');
        window.location.href = '/vendor';
    };

    return (
        <div ref={sidebarRef} className="section-menu-left" style={{ left: isSidebar ? '0px' : '-100%' }}>
            <div className="box-logo" style={{ left: isSidebar ? '0px' : '-100%' }} onClick={toggle}>
                <div id="site-logo-inner">
                    <img id="logo_header" alt="logo" src={`${frontEndBaseUrl}adminAssets/images/logo.png`} />
                </div>
                <h6 style={{paddingLeft: "10px", lineHeight: 'normal'}}>{title}</h6>
                <div className="button-show-hide" onClick={toggle}>
                    <i className="icon-menu-left"></i>
                </div>
            </div>
            <div className="center">
                <div className="center-item">
                    <div className="center-heading">Main Home</div>
                    <ul className="menu-list">
                        <li className="menu-item">
                            <Link to="/vendor" className="menu-item-button">
                                <div className="icon"><i className="icon-menu"></i></div>
                                <div className="text" onClick={handleSidebarClose}>Dashboard</div>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="center-item">
                    <div className="center-heading">All Pages</div>
                    <ul className="menu-list">
                        <li className="menu-item">
                            <Link to={isUserVendorActive == 'active' ? `/vendor/store/product/add/${storeId}` : ''} className="">
                                <div className="icon"><i className="icon-layers"></i></div>
                                <div className="text" onClick={handleSidebarClose}>Add Product</div>
                            </Link>
                        </li>
                        <li className="menu-item">
                            <Link to={isUserVendorActive == 'active' ? `/vendor/store/products/${storeId}` : ''} className="">
                                <div className="icon"><i className="icon-list"></i></div>
                                <div className="text" onClick={handleSidebarClose}>Product List</div>
                            </Link>
                        </li>
                        <li className="menu-item">
                            <Link to={isUserVendorActive == 'active' ? `/vendor/notifications` : ''} className="">
                                <div className="icon"><i className="icon-alert-octagon"></i></div>
                                <div className="text" onClick={handleSidebarClose}>Notifications</div>
                            </Link>
                        </li>
                        <li className="menu-item">
                            <Link to={isUserVendorActive == 'active' ? `setting` : ''} className="">
                                <div className="icon"><i className="fa fa-cog"></i></div>
                                <div className="text" onClick={handleSidebarClose}>Settings</div>
                            </Link>
                        </li>
                        <li className="menu-item">
                            <Link to={isUserVendorActive == 'active' ? `/vendor/customer-care` : ''} className="">
                                <div className="icon"><i className="icon-phone"></i></div>
                                <div className="text" onClick={handleSidebarClose}>Customer Care</div>
                            </Link>
                        </li>
                        <li className="menu-item">
                            <Link to={isUserVendorActive == 'active' ? `/vendor/terms` : ''} className="">
                                <div className="icon"><AiFillCopyrightCircle className='icon' /></div>
                                <div className="text" onClick={handleSidebarClose}>Terms & Condition</div>
                            </Link>
                        </li>
                        <li className="menu-item">
                            <Link to="#" onClick={handleLogout}>
                                <div className="icon"><i className="icon-log-out"></i></div>
                                <div className="text" onClick={handleSidebarClose}>Log Out</div>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="bot text-center">
                <div className="wrap">
                    <div className="mb-20">
                        <h6>{userVendor?.phone}</h6>
                        <div className="text">store registered with this number</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SectionMenuLeft;
