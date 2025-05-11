import React, { useState } from 'react';
import '../../UpdateStore/UpdateStore.css';
import CoverPhotoForm from './CoverPhotoForm';
import BannerSliderForm from './BannerSliderForm';
import LogoOwnerPhotosForm from './LogoOwnerPhotosForm';
import GalleryPhotosForm from './GalleryPhotosForm';



function StorePhotosVideosAddForm() {

    const [activeTab, setActiveTab] = useState('Cover_Photo_Form');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const tabStyle = {
        cursor: 'pointer',
        padding: '10px 10px',
        marginBottom: '0px',
        backgroundColor: '#f1f1f1',
    };

    const activeTabStyle = {
        ...tabStyle,
        backgroundColor: '#e7e7e7',
        borderLeft: '4px solid #cccccc' 
    };

    const inactiveTabStyle = {
        ...tabStyle,
    };


    return (
        <>
            <div class="wg-box wg-box-container wg-box-wrapper">
                <div class="section-content-right">

               
                    <div className="main-content-inner main-content-wrapper" >

                        {/* left side tabs */}
                        <div className="" style={{ width: '170px', backgroundColor: '#f1f1f1', borderRight: '1px solid #cccccc',borderLeft: '1px solid #cccccc', borderBottom: '1px solid #cccccc', borderBottomLeftRadius: '11px', borderBottomRightRadius: '11px', boxShadow: '0px 4px 24px 2px rgba(20, 25, 38, 0.05)' }}>
                            <h4 onClick={() => handleTabClick('Cover_Photo_Form')} style={activeTab === 'Cover_Photo_Form' ? activeTabStyle : inactiveTabStyle}> Cover Photo</h4>
                            <h4 onClick={() => handleTabClick('Banner_Slider_Form')} style={activeTab === 'Banner_Slider_Form' ? activeTabStyle : inactiveTabStyle}> Banner / Slider Photo</h4>
                            <h4 onClick={() => handleTabClick('Gallery_Photos_Form')} style={activeTab === 'Gallery_Photos_Form' ? activeTabStyle : inactiveTabStyle}> Gallery Photos</h4>
                            <h4 onClick={() => handleTabClick('Logo_Owner_Photos_Form')} style={activeTab === 'Logo_Owner_Photos_Form' ? activeTabStyle : inactiveTabStyle}> Logo / Owner Photos</h4>
                        </div>

                        {/* Add Photos/Videos form's all form components */}
                        <div className="all-forms">
                            {activeTab === 'Cover_Photo_Form' && <CoverPhotoForm />}
                            {activeTab === 'Banner_Slider_Form' && <BannerSliderForm />}
                            {activeTab === 'Gallery_Photos_Form' && <GalleryPhotosForm />}
                            {activeTab === 'Logo_Owner_Photos_Form' && <LogoOwnerPhotosForm />}
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default StorePhotosVideosAddForm