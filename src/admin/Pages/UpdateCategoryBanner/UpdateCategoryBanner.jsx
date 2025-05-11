import React, { useState, useContext } from 'react';
import SectionMenuLeft from '../../components/SectionMenuLeft/SectionMenuLeft';
import { AdminSidebarContext } from '../../../context/adminSidebarContext';
import UpdateCategoryBannerForm from './UpdateCategoryBannerForm'
import './UpdateCategoryBanner.css'

function UpdateCategoryBanner() {
    const { isSidebar } = useContext(AdminSidebarContext);


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
                                        <UpdateCategoryBannerForm/>
                                      
                                       
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
export default UpdateCategoryBanner