import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { config } from '../../../config';
import { AdminSidebarContext } from '../../../context/adminSidebarContext';
import { useContext } from 'react';

function SectionMenuLeft() {
    const { frontEndBaseUrl } = config;
    const { toggle, isSidebar } = useContext(AdminSidebarContext);
    const sidebarRef = useRef(null);

    let [isActiveCat, setIsActiveCat] = useState(false);
    let [isActiveSubCat, setIsActiveSubCat] = useState(false);
    let [isActiveStore, setIsActiveStore] = useState(false);
    let [isActiveBanner, setIsActiveBanner] = useState(false);

    const toggleSubMenu = (state, func) => {
        func(!state);
    };

    // side bar close on outside clicking
    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target) && window.innerWidth <= 768) {
            if (isSidebar) {
                toggle();
            };
        };
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSidebar]);

    // Side bar close on side nav link clicking
    const handleSidebarClose = () => {
        if (window.innerWidth <= 768) {
            toggle();
        };
    };

    return (
        <>

            {/* section-menu-left */}
            <div ref={sidebarRef} className="section-menu-left" style={{ left: isSidebar ? '0px' : '-100%' }}>
                <div className="box-logo" style={{ left: isSidebar ? '0px' : '-100%' }}>
                    <Link to="/admin" id="site-logo-inner">
                        <img className="" id="logo_header" alt="logo" src={`${frontEndBaseUrl}adminAssets/images/logo.png`} />
                    </Link>
                    <div className="button-show-hide" onClick={toggle}>
                        <i className="icon-menu-left"></i>
                    </div>
                </div>
                <div className="center">
                    <div className="center-item">
                        <div className="center-heading">Main Home</div>
                        <ul className="menu-list">
                            <li className="menu-item">
                                <Link to="/admin" className="menu-item-button">
                                    <div className="icon"><i className="icon-menu"></i></div>
                                    <div className="text" onClick={handleSidebarClose}>Dashboard</div>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="center-item">
                        <div className="center-heading">All page</div>
                        <ul className="menu-list">

                            <li className={`menu-item has-children ${isActiveCat ? 'active' : ''}`} onClick={() => toggleSubMenu(isActiveCat, setIsActiveCat)}>
                                <Link to="javascript:void(0);" className="menu-item-button">
                                    <div className="icon"><i className="icon-layers"></i></div>
                                    <div className="text">Category</div>
                                </Link>
                                <ul className="sub-menu">
                                    <li className="sub-menu-item">
                                        <Link to="/admin/category/list" className="">
                                            <div className="text" onClick={handleSidebarClose}>Category list</div>
                                        </Link>
                                    </li>
                                    <li className="sub-menu-item">
                                        <Link to="/admin/category/add" className="">
                                            <div className="text" onClick={handleSidebarClose}>Add category</div>
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li className={`menu-item has-children ${isActiveSubCat ? 'active' : ''}`} onClick={() => toggleSubMenu(isActiveSubCat, setIsActiveSubCat)}>
                                <Link to="javascript:void(0);" className="menu-item-button">
                                    <div className="icon"><i className="icon-file"></i></div>
                                    <div className="text">Sub Category</div>
                                </Link>
                                <ul className="sub-menu">
                                    <li className="sub-menu-item">
                                        <Link to="/admin/sub-category/list" className="">
                                            <div className="text" onClick={handleSidebarClose}>Sub Category List</div>
                                        </Link>
                                    </li>
                                    <li className="sub-menu-item">
                                        <Link to="/admin/sub-category/add" className="">
                                            <div className="text" onClick={handleSidebarClose}>Add Sub Category</div>
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li className={`menu-item has-children ${isActiveStore ? 'active' : ''}`} onClick={() => toggleSubMenu(isActiveStore, setIsActiveStore)}>
                                <Link to="javascript:void(0);" className="menu-item-button">
                                    <div className="icon"><i className="icon-shopping-cart"></i></div>
                                    <div className="text">Store</div>
                                </Link>
                                <ul className="sub-menu">
                                    <li className="sub-menu-item">
                                        <Link to="/admin/store/list" className="">
                                            <div className="text" onClick={handleSidebarClose}>Store List</div>
                                        </Link>
                                    </li>
                                    <li className="sub-menu-item">
                                        <Link to="/admin/store/add" className="">
                                            <div className="text" onClick={handleSidebarClose}>Add Store</div>
                                        </Link>
                                    </li>
                                    <li className="sub-menu-item">
                                        <Link to="/admin/store/orders" className="">
                                            <div className="text" onClick={handleSidebarClose}>Orders</div>
                                        </Link>
                                    </li>

                                </ul>
                            </li>
                            <li className={`menu-item has-children ${isActiveBanner ? 'active' : ''}`} onClick={() => toggleSubMenu(isActiveBanner, setIsActiveBanner)}>
                                <Link to="javascript:void(0);" className="menu-item-button">
                                    <div className="icon"><i className="icon-flag"></i></div>
                                    <div className="text">Promotion Banners</div>
                                </Link>
                                <ul className="sub-menu">
                                    {/* <li className="sub-menu-item">
                                        <Link to="/admin/category/banner/add" className="">
                                            <div className="text" onClick={handleSidebarClose}>Add Category Banners</div>
                                        </Link>
                                    </li>
                                    <li className="sub-menu-item">
                                        <Link to="/admin/banner/add" className="">
                                            <div className="text" onClick={handleSidebarClose}>Add Home Banner</div>
                                        </Link>
                                    </li> */}
                                    <li className="sub-menu-item">
                                        <Link to="/admin/banner/list" className="">
                                            <div className="text" onClick={handleSidebarClose}>All Banners</div>
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            {/* <li className="menu-item ">
                                <Link to="javascript:void(0);" className="menu-item-button">
                                    <div className="icon"><i className="icon-file"></i></div>
                                    <div className="text">Promotion</div>
                                </Link>
                            </li> */}
                            <li className="menu-item">
                                <Link to="/admin/customers" className="">
                                    <div className="icon"><i className="icon-users"></i></div>
                                    <div className="text" onClick={handleSidebarClose}>Customers</div>
                                </Link>
                            </li>
                            <li className="menu-item">
                                <Link to="/admin/vendors" className="">
                                    <div className="icon"><i className="icon-users"></i></div>
                                    <div className="text" onClick={handleSidebarClose}>Vendors</div>
                                </Link>
                            </li>
                            <li className="menu-item">
                                <Link to="/admin/queries" className="">
                                    <div className="icon"><i className="icon-circle"></i></div>
                                    <div className="text" onClick={handleSidebarClose}>Queries</div>
                                </Link>
                            </li>
                            <li className="menu-item">
                                <Link to="/admin/notifications" className="menu-item-button">
                                    <div className="icon"><i className="icon-alert-octagon"></i></div>
                                    <div className="text" onClick={handleSidebarClose}>Push Notifications</div>
                                </Link>
                            </li>
                            <li className="menu-item">
                                <Link to="/admin/about" className="menu-item-button">
                                    <div className="icon"><i className="icon-alert-octagon"></i></div>
                                    <div className="text" onClick={handleSidebarClose}>About Us & T&C Policy</div>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="bot text-center">
                    <div className="wrap">
                        <div className="mb-20">
                            <img src={`${frontEndBaseUrl}adminAssets/images/menu-left/img-bot.png`} alt="img-bot" />
                        </div>
                        <div className="mb-20">
                            <h6>Hi, how can we help?</h6>
                            <div className="text">Contact us if you have any assistance, we will contact you as soon as possible</div>
                        </div>
                        <Link to="#" className="tf-button w-full">Contact</Link>
                    </div>
                </div>
            </div>
            {/* /section-menu-left */}

        </>
    )
}

export default SectionMenuLeft