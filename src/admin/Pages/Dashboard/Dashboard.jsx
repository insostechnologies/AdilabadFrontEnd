import React, { useEffect, useState, useContext } from 'react';
import './Dashboard.css';
import SectionMenuLeft from '../../components/SectionMenuLeft/SectionMenuLeft';
import TopDefaultCharts from './TopDefaultCharts';
import ProductOverview from './ProductOverview';
import Users from '../Users/Users';
import Vendor from './Vendor';
import CustomerGrowth from './CustomerGrowth';
import Revenue from './Revenue';
import { AdminSidebarContext } from '../../../context/adminSidebarContext';
import { config } from '../../../config';

function Dashboard() {
    const { isSidebar } = useContext(AdminSidebarContext);
    

    return (
        <>
            <div className="body">
                <div id="wrapper">
                    <div id="page" className="">
                        <div className="layout-wrap">
                            <SectionMenuLeft />
                            <div className="section-content-right">
                                <div className="main-content" style={{ paddingLeft: isSidebar ? '280px' : '0px' }}>
                                    <div className="main-content-inner">
                                        <TopDefaultCharts />
                                        {/* <Users/> */}
                                        {/* <ProductOverview />
                                        <br />
                                        <br />
                                        <Vendor />
                                        <div className="tf-section-6 mb-30">
                                            <CustomerGrowth />
                                            <Revenue />
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;