import React, { useState, useContext, useEffect } from 'react';
import SectionMenuLeft from '../../components/SectionMenuLeft/SectionMenuLeft';
// import BreadCrumbs from '../../components/BreadCrumbs/BreadCrumbs';
import AccountForm from './AdminAccount/AccountForm';
import SocialAndContacts from './SocialAndContacts/SocialAndContacts';
import { AdminSidebarContext } from '../../../context/adminSidebarContext';
import AboutUsAndSEO from './AboutUsAndSEO/AboutUsAndSEO';
import VendorSettings from './VendorSettings/VendorSettings';
import UserSettings from './UserSettings/UserSettings'
import { config } from '../../../config';

function AdminSetting() {
    const { isSidebar } = useContext(AdminSidebarContext);
    const [activeTab, setActiveTab] = useState('account_setting');
    const [userData, setUserData] = useState(null)

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const tabStyle = {
        cursor: 'pointer',
        padding: '12px 17px',
        marginBottom: '0px',
        borderTopLeftRadius: '11px',
        borderTopRightRadius: '11px',
        backgroundColor: '#f1f1f1',
    };

    const activeTabStyle = {
        ...tabStyle,
        backgroundColor: '#cccccc',
    };

    const inactiveTabStyle = {
        ...tabStyle,
    };

    let uid = localStorage.getItem('adminUserId')

    const fetchAdmin = async (uid) => {
		try {
			
			// Send the request
			const response = await fetch(`${config.backEndBaseUrl}api/user/${uid}`, {
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
				setUserData(result.data)
			} else {
				console.log('internal server error')
			}

		} catch (error) {
			console.error('Error update data:', error);
		}
	}

    useEffect(()=>{
        fetchAdmin(uid)
    },[uid])


    return (
        <>
            <div className="body">
                {/*#wrapper */}
                <div id="wrapper">
                    {/*#page */}
                    <div id="page" className="">
                        {/*layout-wrap */}
                        <div className="layout-wrap">
                            <SectionMenuLeft />

                            <div className="section-content-right">
                                {/*main-content */}
                                <div className="main-content" style={{ paddingLeft: isSidebar ? '280px' : '0px' }}>
                                    {/*main-content-wrap */}
                                    <div className="main-content-inner" >
                                        <div className="flex items-center flex-wrap" style={{ backgroundColor: '#f1f1f1', borderTopRightRadius: '12px', borderTopLeftRadius: '12px', border: '1px solid #cccccc', boxShadow: '0px 4px 24px 2px rgba(20, 25, 38, 0.05)'}}>
                                            <h3 onClick={() => handleTabClick('account_setting')} style={activeTab === 'account_setting' ? activeTabStyle : inactiveTabStyle}>Account Setting</h3>
                                            <h3 onClick={() => handleTabClick('contacts_&_social_media')} style={activeTab === 'contacts_&_social_media' ? activeTabStyle : inactiveTabStyle}>Contacts & Social Media Details</h3>
                                            <h3 onClick={() => handleTabClick('about_us')} style={activeTab === 'about_us' ? activeTabStyle : inactiveTabStyle}>Users About Us & SEO</h3>
                                            <h3 onClick={() => handleTabClick('vendor_settings')} style={activeTab === 'vendor_settings' ? activeTabStyle : inactiveTabStyle}>Vendor Settings</h3>
                                            <h3 onClick={() => handleTabClick('user_settings')} style={activeTab === 'user_settings' ? activeTabStyle : inactiveTabStyle}>User Settings</h3>
                                            {/* <BreadCrumbs /> */}
                                        </div>
                                        {/*main-content-wrap */}

                                        {activeTab === 'account_setting' && <AccountForm user={userData}/>}
                                        {activeTab === 'contacts_&_social_media' && <SocialAndContacts user={userData}/>}
                                        {activeTab === 'about_us' && <AboutUsAndSEO user={userData}/>}
                                        {activeTab === 'vendor_settings' && <VendorSettings />}
                                        {activeTab === 'user_settings' && <UserSettings />}
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
    );
}

export default AdminSetting;
