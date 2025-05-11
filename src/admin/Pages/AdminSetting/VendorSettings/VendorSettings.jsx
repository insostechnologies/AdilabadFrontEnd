import React, { useState, useEffect } from 'react';
import '../AdminAccount/accountForm.css';
import { config } from '../../../../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './VendorSettings.css';
import VendorAccess from './VendorAccess/VendorAccess';
import AboutSettings from './AboutSettings/AboutSettings';

function VendorSettings() {
    const [activeTab, setActiveTab] = useState('vendor_Access');
    const [permissions, setPermissions] = useState(null);

    const handleTabClick = (tab) => {
        fetchPermissions()
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

    const fetchPermissions = async () => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/store/permissions?t=v`, {
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
                setPermissions(result.data);
            } else {
                throw new Error('Failed to fetch permissions');
            }
        } catch (error) {
            console.error('Error fetching permissions:', error);
            toast.error('Failed to fetch permissions');
        }
    };

    useEffect(() => {
        fetchPermissions();
    }, []);

    return (
        <>
            <ToastContainer />
            <div className="wg-box wg-box-container">
                <div className="flex items-center flex-wrap" style={{ backgroundColor: '#f1f1f1', borderTopRightRadius: '12px', borderTopLeftRadius: '12px', border: '1px solid #cccccc', boxShadow: '0px 4px 24px 2px rgba(20, 25, 38, 0.05)' }}>
                    <h3 onClick={() => handleTabClick('vendor_Access')} style={activeTab === 'vendor_Access' ? activeTabStyle : inactiveTabStyle}>Vendor Access</h3>
                    <h3 onClick={() => handleTabClick('about_settings')} style={activeTab === 'about_settings' ? activeTabStyle : inactiveTabStyle}>About Us & Seo</h3>
                </div>
                {/*main-content-wrap */}
                {permissions && (
                    <>
                        {activeTab === 'vendor_Access' && <VendorAccess permissions={permissions} />}
                        {activeTab === 'about_settings' && <AboutSettings permissions={permissions} />}
                    </>
                )}
            </div>
        </>
    );
}

export default VendorSettings;
