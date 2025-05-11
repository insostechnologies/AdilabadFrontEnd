import React, { useEffect, useState } from 'react';
import './MobileHeader.css';
import arrow_back from '../Assets/Images/arrow_back.png';
import share from '../Assets/Images/share1.png';
import { useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa6';
import { config } from '../../../config';

const MobileHeader = ({ title, shareCount, views, searchCount, ordersCount }) => {
    const [onlyPages, setOnlyPages] = useState(true);
    const [siteTitle,setSiteTitle] = useState('')

    useEffect(() => {
        const urlKeywords = ['notifications', 'profile', 'history'];
        const pages = urlKeywords.some(keyword => window.location.href.includes(keyword));
        if (pages) {
            setOnlyPages(false);
        };
    }, []);

    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1); // Go back to the previous page
    };

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
                setSiteTitle(result.data.seoDetails.name);
            } else {
                console.log('Internal server error');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } 
    };

    const handleShareClick = () => {
        // Customize the message format
        const shareTitle = siteTitle;
        const shareUrl = window.location.href; // Use the current page's URL
        const customMessage = `Hi, Link: ${shareUrl}\n\nPlease reply...\n\nMessage from ${siteTitle}`;

        const shareData = {
            title: shareTitle,
            text: customMessage,
        };

        if (navigator.share) {
            navigator.share(shareData)
                .then(() => console.log('Share successful'))
                .catch((error) => console.error('Error sharing:', error));
        } else {
            // Fallback for browsers that do not support the Web Share API
            alert('Sharing is not supported in this browser. Copy the link: ' + customMessage);
        }
    };


    useEffect(()=>{
        fetchSiteDetails()
    },[])



    return (
        <div className='mob_header'>
            <div className="header-left">
                <button onClick={handleBackClick} className="back-button">
                    <img src={arrow_back} alt="back_arrow" />
                </button>
                <span>
                    <h3 className='header-left-title' style={{ marginBottom: (onlyPages && (views > 0)) ? '-8px' : '0px' }}>{title ? title : "Category"}</h3>
                    {(onlyPages && (views > 0)) ? <span className='views' style={{ fontSize: '12px', color: '#fff', marginBottom: '4px', marginLeft: '8px' }}> <FaEye /> {views} views </span> : ""}
                    {(searchCount && (searchCount > 0)) ? <span className='views' style={{ fontSize: '12px', color: '#fff', marginBottom: '4px', marginLeft: '8px' }}> <FaEye /> {searchCount} views </span> : ""}
                    {(ordersCount && (ordersCount > 0)) ? <span className='views' style={{ fontSize: '14px', color: '#fff', marginBottom: '4px', marginLeft: '10px' }}>  {ordersCount} orders </span> : ""}
                </span>
            </div>
            <div className="header-right">
                <img src={share} alt="Share" onClick={handleShareClick} style={{ cursor: 'pointer', height: '30px', width: '30px' }} />
                {(onlyPages && (shareCount > 0)) ? <span style={{ fontSize: '12px', color: '#fff', marginBottom: '4px', marginLeft: '5px' }}>{shareCount}</span> : ''}
            </div>
        </div>
    );
}

export default MobileHeader;