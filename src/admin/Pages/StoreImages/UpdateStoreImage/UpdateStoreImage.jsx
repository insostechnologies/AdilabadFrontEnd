import React from 'react';
import SectionMenuLeft from '../../../components/SectionMenuLeft/SectionMenuLeft';
import { AdminSidebarContext } from '../../../../context/adminSidebarContext';
import { useContext } from 'react';
import UpdateStoreImageForm from './UpdateStoreImageForm';


function UpdateStoreImage() {
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

                                {/*main-content */}
                                <div class="main-content" style={{ paddingLeft: isSidebar ? '280px' : '0px' }}>
                                    {/*main-content-wrap */}
                                    <div class="main-content-inner">
                                        <div class="flex items-center flex-wrap justify-between gap20 mb-27">
                                            <h3>Update Image</h3>
                                        </div>
                                        <UpdateStoreImageForm/>
                                    </div>
                                    {/*/main-content-wrap */}
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

export default UpdateStoreImage