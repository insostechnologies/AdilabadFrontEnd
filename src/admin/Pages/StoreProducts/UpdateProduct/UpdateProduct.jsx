import React, { useState, useContext, useRef,useEffect } from 'react';
import SectionMenuLeft from '../../../components/SectionMenuLeft/SectionMenuLeft';
// import BreadCrumbs from '../../components/BreadCrumbs/BreadCrumbs';
import { AdminSidebarContext } from '../../../../context/adminSidebarContext';
import './UpdateProduct.css'
import { useParams } from 'react-router-dom';
import UpdateProductForm from './UpdateProductForm'
import AddKeyword from './AddKeyword';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { config } from '../../../../config';

function UpdateProduct() {
    const { isSidebar } = useContext(AdminSidebarContext);
    const { uid } = useParams();

    const [storeId, setStoreId] = useState('')
    const fetchProduct = async (uid) => {

        const response = await fetch(`${config.backEndBaseUrl}api/product/${uid}`, {
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
            let product = result.data
            setStoreId(product.store_id)
        }

    }

    useEffect(() => {
        fetchProduct(uid)
    }, [uid])


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
                                                <Tab>Update Product</Tab>
                                                <Tab>Update Product & Service Category </Tab>

                                            </TabList>
                                            <TabPanel>
                                                <UpdateProductForm />
                                            </TabPanel>
                                            <TabPanel>
                                                <AddKeyword storeId={`${storeId}`}/>
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
export default UpdateProduct