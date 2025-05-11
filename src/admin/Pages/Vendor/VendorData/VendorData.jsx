import React, { useState, useContext, useEffect } from 'react';
import SectionMenuLeft from '../../../components/SectionMenuLeft/SectionMenuLeft';
import { AdminSidebarContext } from '../../../../context/adminSidebarContext';
import { config } from '../../../../config';
import ChatCalls from './ChatCalls/ChatCalls';
import Followers from './Followers/Followers';
import Comments from './Comments/Comments';
import Queries from './Queries/Queries';
import Orders from './Orders/Orders';
function VendorData() {
    const { isSidebar } = useContext(AdminSidebarContext);
    const [activeTab, setActiveTab] = useState('call_chats');

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







    return (
        <>
            <div className="body">
                <div id="wrapper">
                    <div id="page" className="">
                        <div className="layout-wrap">
                            <SectionMenuLeft />
                            <div className="section-content-right">
                                <div className="main-content" style={{ paddingLeft: isSidebar ? '280px' : '0px' }}>
                                    <div className="main-content-inner" >
                                        <div className="flex items-center flex-wrap" style={{ backgroundColor: '#f1f1f1', borderTopRightRadius: '12px', borderTopLeftRadius: '12px', border: '1px solid #cccccc', boxShadow: '0px 4px 24px 2px rgba(20, 25, 38, 0.05)' }}>
                                            <h3 onClick={() => handleTabClick('call_chats')} style={activeTab === 'call_chats' ? activeTabStyle : inactiveTabStyle}>Call & Chats</h3>
                                            <h3 onClick={() => handleTabClick('followers')} style={activeTab === 'followers' ? activeTabStyle : inactiveTabStyle}>Followers</h3>
                                            <h3 onClick={() => handleTabClick('comments')} style={activeTab === 'comments' ? activeTabStyle : inactiveTabStyle}>Comments</h3>
                                            <h3 onClick={() => handleTabClick('queries')} style={activeTab === 'queries' ? activeTabStyle : inactiveTabStyle}>Queries</h3>
                                            <h3 onClick={() => handleTabClick('orders')} style={activeTab === 'orders' ? activeTabStyle : inactiveTabStyle}>Orders</h3>
                                        </div>
                                        {activeTab === 'call_chats' && <ChatCalls />}
                                        {activeTab === 'followers' && <Followers />}
                                        {activeTab === 'comments' && <Comments />}
                                        {activeTab === 'queries' && <Queries />}
                                        {activeTab === 'orders' && <Orders />}
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

export default VendorData;
