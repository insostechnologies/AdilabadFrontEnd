import React, { useEffect, useState } from 'react'
import './CustomerCare.css';
import customer_care from '../../components/Assets/Images/customer-care.png';
import SectionMenuLeft from '../../components/SectionMenuLeft/SectionMenuLeft';
import { AdminSidebarContext } from '../../../context/adminSidebarContext';
import { useContext } from 'react';
import { config } from '../../../config';

const Notifications = () => {
    const [tab, setTab] = useState("all")
    const { isSidebar } = useContext(AdminSidebarContext);
    const [socialDetails, setSocialDetails] = useState([]);
    const [seoDetails, setSeoDetails] = useState([]);


    const getValueByType = (dataArray, type) => {
        if (!Array.isArray(dataArray)) {
            throw new Error("First parameter must be an array.");
        }

        const item = dataArray.find(entry => entry.type.toLowerCase() === type.toLowerCase());
        return item ? item.value : null; // Return the value if found, otherwise return null
    }

    const fetchSiteDetails = async () => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/site/details`, {
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
                setSocialDetails(result.data.socialDetails);
                setSeoDetails(result.data.seoDetails);
                console.log(result.data)
            } else {
                console.log('Internal server error');
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        fetchSiteDetails();
    }, []);



    return (


        <>
            <div className="body">

                {/* #wrapper */}
                <div id="wrapper">
                    {/* #page */}
                    <div id="page" className="">
                        {/* layout-wrap */}
                        <div className="layout-wrap">
                            <SectionMenuLeft />

                            <div className="section-content-right">
                                {/* main-content */}
                                <div className="main-content" style={{ paddingLeft: isSidebar ? '280px' : '0px' }}>
                                    {/* main-content-wrap */}
                                    <div className="main-content-inner">
                                        <div className="flex items-center flex-wrap justify-between gap20 mb-27">
                                            <h3>Customer Care</h3>
                                        </div>
                                        <div className="customer-care">

                                            <div className="cus-header">
                                                <img
                                                    src={customer_care}
                                                    alt="Customer Support"
                                                    className="header-image"
                                                />
                                            </div>

                                            <div className="details-cus">
                                                <div className="detail-cus">
                                                    <p className='cus-title'>Location</p>
                                                    <p>{seoDetails.city+`, `+seoDetails.state+` ,`+ seoDetails.country}</p>
                                                </div>

                                                <div className="detail-cus">
                                                    <p className='cus-title'>Email</p>
                                                    <p>{getValueByType(socialDetails, 'email')}</p>
                                                </div>

                                                <div className="detail-cus">
                                                    <p className='cus-title'>Call</p>
                                                    <p>{getValueByType(socialDetails, 'call')}</p>
                                                </div>

                                                <div className="detail-cus">
                                                    <p className='cus-title'>Map</p>
                                                    <iframe
                                                        src={getValueByType(socialDetails, 'mapLink') + '&output=embed'}
                                                        className="map"
                                                        title="Location"
                                                    ></iframe>
                                                </div>
                                            </div>
                                        </div>
                                        {/* /main-content-wrap */}
                                    </div>
                                    {/* /main-content-wrap */}

                                </div>
                                {/* /main-content */}
                            </div>
                            {/* /section-content-right */}
                        </div>
                        {/* /layout-wrap */}
                    </div>
                    {/* /#page */}
                </div>
                {/* /#wrapper */}


            </div>
        </>
    )
}
export default Notifications