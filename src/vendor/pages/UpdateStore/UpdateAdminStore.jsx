import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SectionMenuLeft from '../../components/SectionMenuLeft/SectionMenuLeft';
import StoreDetailsForm from './StoreDetailsForm';
import ContactDetailsForm from './ContactDetailsForm';
import StoreOffersAddForm from './StoreOffersAddForm';
import StoreSEODetailsForm from './StoreSEODetailsForm';
import DeliveryCharges from './DeliveryCharges';
import GstCharges from './GstCharges';
import { AdminSidebarContext } from '../../../context/adminSidebarContext';

function UpdateAdminStore() {
    const { isSidebar } = useContext(AdminSidebarContext);
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('store_details');

    const tabMap = {
        sd: 'store_details',
        cd: 'contact_details',
        of: 'Store_offers_add_Form',
        sed: 'Store_seo_details_Form',
        dl: 'Delivery_charges',
        tx: 'Gst_charges',
    };

    useEffect(() => {
        // Extract query parameter 'p' and set the active tab
        const params = new URLSearchParams(location.search);
        const tab = params.get('p');
        if (tab && tabMap[tab]) {
            setActiveTab(tabMap[tab]);
        }
    }, [location.search]);

    const handleTabClick = (tabKey) => {
        const tabParam = Object.keys(tabMap).find(key => tabMap[key] === tabKey);
        if (tabParam) {
            // Change the URL without reloading the page
            window.history.pushState({}, '', `/vendor/store/update?p=${tabParam}`);
            setActiveTab(tabKey);
        }
    };

    const tabStyle = {
        cursor: 'pointer',
        padding: '15px 17px',
        marginBottom: '0px',
        backgroundColor: '#f1f1f1',
    };

    const activeTabStyle = {
        ...tabStyle,
        backgroundColor: '#ffffff',
        borderRight: '1px solid #cccccc',
        borderLeft: '1px solid #cccccc',
    };

    const inactiveTabStyle = {
        ...tabStyle,
        borderBottom: '1px solid #cccccc',
    };

    return (
        <div className="body">
            <div id="wrapper">
                <div id="page">
                    <div className="layout-wrap">
                        <SectionMenuLeft />
                        <div className="section-content-right">
                            <div className="main-content" style={{ paddingLeft: isSidebar ? '280px' : '0px' }}>
                                <div className="main-content-inner">
                                    {/* <div className="flex items-center flex-wrap tabs-wrapper tab-content">
                                        <h3 onClick={() => handleTabClick('store_details')} style={activeTab === 'store_details' ? activeTabStyle : inactiveTabStyle}>
                                            <span className="icon">
                                                <i className="icon-layers"></i>
                                            </span> Store Details
                                        </h3>
                                        <h3 onClick={() => handleTabClick('contact_details')} style={activeTab === 'contact_details' ? activeTabStyle : inactiveTabStyle}>
                                            <span className="icon">
                                                <i className="icon-phone"></i>
                                            </span> Contact & Social Media Details
                                        </h3>
                                        <h3 onClick={() => handleTabClick('Store_offers_add_Form')} style={activeTab === 'Store_offers_add_Form' ? activeTabStyle : inactiveTabStyle}>
                                            <span className="icon">
                                                <i className="icon-tag"></i>
                                            </span> Offers
                                        </h3>
                                        <h3 onClick={() => handleTabClick('Store_seo_details_Form')} style={activeTab === 'Store_seo_details_Form' ? activeTabStyle : inactiveTabStyle}>
                                            <span className="icon">
                                                <i className="icon-search"></i>
                                            </span> SEO Details
                                        </h3>
                                        <h3 onClick={() => handleTabClick('Delivery_charges')} style={activeTab === 'Delivery_charges' ? activeTabStyle : inactiveTabStyle}>
                                            <span className="icon">
                                                <i className="icon-truck"></i>
                                            </span> Delivery Charges
                                        </h3>
                                        <h3 onClick={() => handleTabClick('Gst_charges')} style={activeTab === 'Gst_charges' ? activeTabStyle : inactiveTabStyle}>
                                            <span className="icon">
                                                <i className="icon-money"></i>
                                            </span> GST Charges
                                        </h3>
                                    </div> */}

                                    {/* Add store's all form components */}
                                    {activeTab === 'store_details' && <StoreDetailsForm />}
                                    {activeTab === 'contact_details' && <ContactDetailsForm />}
                                    {activeTab === 'Store_offers_add_Form' && <StoreOffersAddForm />}
                                    {activeTab === 'Store_seo_details_Form' && <StoreSEODetailsForm />}
                                    {activeTab === 'Delivery_charges' && <DeliveryCharges />}
                                    {activeTab === 'Gst_charges' && <GstCharges />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateAdminStore;
