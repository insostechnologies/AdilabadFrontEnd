import React, { useState, useContext } from 'react';
import SectionMenuLeft from '../../components/SectionMenuLeft/SectionMenuLeft';
// import BreadCrumbs from '../../components/BreadCrumbs/BreadCrumbs';
import StoreDetailsForm from './StoreDetailsForm';
import { AdminSidebarContext } from '../../../context/adminSidebarContext';
import StorePhotosVideosAddForm from '../UpdateStore/StorePhotosVideosAddForm/StorePhotosVideosAddForm';
import StoreProductsAddForm from './StoreProductsAddForm';
import StoreOffersAddForm from './StoreOffersAddForm';
import StoreSEODetailsForm from './StoreSEODetailsForm';
import AddFilterForm from './AddFilterForm'
import ContactDetailsForm from './ContactDetailsForm';
import DeliveryCharges from './DeliveryCharges'
import GstCharges from './GstCharges'
import StoreKeywords from './StoreKeywords'

function UpdateStore() {
    const { isSidebar } = useContext(AdminSidebarContext);
    const [activeTab, setActiveTab] = useState('store_details');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
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
        <>
            <div class="body">

                {/*#wrapper */}
                <div id="wrapper">
                    {/*#page */}
                    <div id="page" class="">
                        {/*layout-wrap */}
                        <div class="layout-wrap">


                            <SectionMenuLeft />

                            <div class="section-content-right">


                                <div class="main-content" style={{ paddingLeft: isSidebar ? '280px' : '0px' }}>
                                    <div className="main-content-inner" >

                                        {/* topside tabs */}
                                        <div className="flex items-center flex-wrap tabs-wrapper tab-content">

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
                                            {/* <h3 onClick={() => handleTabClick('Store_photos_add_Form')} style={activeTab === 'Store_photos_add_Form' ? activeTabStyle : inactiveTabStyle}>
                                                <span className="icon">
                                                    <i className="icon-camera"></i>
                                                </span> Add Photos / Videos
                                            </h3> */}
                                            {/* <h3 onClick={() => handleTabClick('Store_products_add_Form')} style={activeTab === 'Store_products_add_Form' ? activeTabStyle : inactiveTabStyle}>
                                                <span className="icon">
                                                    <i className="icon-box"></i>
                                                </span> Add Products / Services
                                            </h3> */}
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
                                                    <i className="icon-search"></i>
                                                </span> Delivery Charges
                                            </h3>
                                            <h3 onClick={() => handleTabClick('Gst_charges')} style={activeTab === 'Gst_charges' ? activeTabStyle : inactiveTabStyle}>
                                                <span className="icon">
                                                    <i className="icon-search"></i>
                                                </span> GST Charges
                                            </h3>
                                            <h3 onClick={() => handleTabClick('keyWords')} style={activeTab === 'keyWords' ? activeTabStyle : inactiveTabStyle}>
                                                <span className="icon">
                                                    <i className="icon-search"></i>
                                                </span> key words
                                            </h3>
                                            {/* <h3 onClick={() => handleTabClick('Store_filters')} style={activeTab === 'Store_filters' ? activeTabStyle : inactiveTabStyle}>
                                                <span className="icon">
                                                    <i className="icon-filter"></i>
                                                </span> Add filters
                                            </h3> */}
                                            {/* <BreadCrumbs /> */}
                                        </div>

                                        {/* Add store's all form components */}
                                        {activeTab === 'store_details' && <StoreDetailsForm />}
                                        {activeTab === 'contact_details' && <ContactDetailsForm />}
                                        {/* {activeTab === 'Store_photos_add_Form' && <StorePhotosVideosAddForm />} */}
                                        {/* {activeTab === 'Store_products_add_Form' && <StoreProductsAddForm />} */}
                                        {activeTab === 'Store_offers_add_Form' && <StoreOffersAddForm />}
                                        {activeTab === 'Store_seo_details_Form' && <StoreSEODetailsForm />}
                                        {activeTab === 'Delivery_charges' && <DeliveryCharges />}
                                        {activeTab === 'Gst_charges' && <GstCharges />}
                                        {activeTab === 'keyWords' && <StoreKeywords />}
                                        {/* {activeTab === 'Store_filters' && <AddFilterForm />} */}
                                    </div>


                                </div>
                            </div>
                            {/*/section-content-right */}
                        </div>
                        {/*/layout-wrap */}
                    </div>
                    {/*/#page */}
                </div>
                {/*/#wrapper */}


            </div>
        </>
    )

}
export default UpdateStore