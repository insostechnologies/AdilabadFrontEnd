import React, { useState, useContext, useRef } from 'react';
import SectionMenuLeft from '../../../components/SectionMenuLeft/SectionMenuLeft';
// import BreadCrumbs from '../../components/BreadCrumbs/BreadCrumbs';
import { AdminSidebarContext } from '../../../../context/adminSidebarContext';
import './AddProduct.css'
import { useParams } from 'react-router-dom';
import AddProductForm from './AddProductForm'
import AddKeyword from './AddKeyword';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

function AddProduct() {
    const { isSidebar } = useContext(AdminSidebarContext);
    const { uid } = useParams();

    return (
        <>
            <div class="body">
                <div id="wrapper">
                    <div id="page" class="">
                        <div class="layout-wrap">
                            <SectionMenuLeft />
                            <div class="section-content-right">
                                <div class="main-content" style={{ paddingLeft: isSidebar ? '280px' : '0px' }}>
                                    <div className="main-content-inner" >
                                        <Tabs>
                                            <TabList>
                                                <Tab>Add Product</Tab>
                                                <Tab>Add Product & Service Category</Tab>

                                            </TabList>
                                            <TabPanel>
                                                <AddProductForm />
                                            </TabPanel>
                                            <TabPanel>
                                                <AddKeyword />
                                            </TabPanel>

                                        </Tabs>

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
export default AddProduct