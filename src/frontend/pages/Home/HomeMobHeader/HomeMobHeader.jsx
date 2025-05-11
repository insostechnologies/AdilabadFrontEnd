import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './HomeMobHeader.css';
// import brand_logo from '../../../components/Assets/Images/brand_logo.png';
import share_icon from '../../../components/Assets/Images/share.png';
import call_icon from '../../../components/Assets/Images/phone.png';
import { config } from '../../../../config';
// import Spinner from 'react-bootstrap/Spinner'; // import Spinner for loading
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { formatPhoneNumber } from '../../../../utils/helper'
function HomeMobHeader() {

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Check out this page',
                text: 'I found this interesting!',
                url: window.location.href
            }).then(() => {
                console.log('Thanks for sharing!');
            }).catch((error) => {
                console.error('Error sharing:', error);
            });
        } else {
            // Fallback for browsers that don't support the Web Share API
            copyToClipboard(window.location.href);
            // alert('Link copied to clipboard!');
        }
    };

    const copyToClipboard = (text) => {
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
    };

    const [logo, setLogo] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true); // loading state
    const [showModal, setShowModal] = useState(false);
    const [socialDetails, setSocialDetails] = useState([])
    const [showShareModal, setShowShareModal] = useState(false);

    const handleModal = () => setShowModal(!showModal);
    const toggleShareModal = () => setShowShareModal(!showShareModal);

    const fetchSiteDetails = async () => {
        try {
            // Send the request
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
                const logoUrl = result.data.seoDetails.logo
                    ? config.backEndBaseUrl + result.data.seoDetails.logo
                    : config.backEndBaseUrl + config.placeHolderImage;
                setLogo(logoUrl);
                setTitle(result.data.seoDetails.name);
                setSocialDetails(result.data.socialDetails)
            } else {
                console.log('Internal server error');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false); // stop loading once data is fetched
        }
    };


    const getSocialLink = (type) => socialDetails.find(detail => detail.type === type)?.value;

    useEffect(() => {
        fetchSiteDetails();
    }, []);
    const handleLinkShare = (url) => {
        if (navigator.share) {
            // Use the Web Share API
            navigator.share({
                title: 'Check this out!',
                url: url,
            })
                .then(() => console.log('Successfully shared'))
                .catch((error) => console.error('Error sharing:', error));
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard
                .writeText(url)
                .then(() => {
                    toast.success('Link copied to clipboard!', {
                        position: 'top-center',
                    });
                })
                .catch((error) => {
                    console.error('Error copying link to clipboard:', error);
                    toast.error('Failed to copy the link.', {
                        position: 'top-center',
                    });
                });
        }
    };




    return (
        <>
            <div className='mob_header_container'>
                <div className="mobile_only">
                    <div className="mob_header_wrapper">
                        <div className="col_left">
                            {/* Conditional rendering based on the loading state */}
                            <Link to="/">
                                {loading ? (
                                    <img src={config.backEndBaseUrl + config.placeHolderImage} className="brand_logo" alt="brand_logo" />
                                ) : (
                                    <img src={logo} className='brand_logo' alt="Brand Logo" />
                                )}
                            </Link>
                            <h1 className='brand_name' id={'brand_name'}>{title}</h1>
                        </div>
                        <div className="col_right">
                            {/* Share icon functionality */}
                            <button onClick={toggleShareModal}>
                                <img src={share_icon} className='icon' alt="share_icon" />
                            </button>

                            {/* Call icon functionality */}
                            <button onClick={handleModal}>
                                <img src={call_icon} className='icon' alt="call_icon" />
                            </button>
                            {/* Modal for WhatsApp or Call options */}
                            {(showModal && getSocialLink('whatsapp') && getSocialLink('call')) && (
                                <div className="modal-overlay" onClick={handleModal}>
                                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                        {/* <h3>Contact Options</h3> */}
                                        <div className='btnBx'>
                                            {getSocialLink('whatsapp') && (
                                                <button onClick={() => window.open(`https://wa.me/${formatPhoneNumber(getSocialLink('whatsapp'))}`, '_blank')}>
                                                    <img src={'https://cdn3.iconfinder.com/data/icons/social-media-chamfered-corner/154/whatsapp-512.png'} alt="WhatsApp" className="contact-icon" />
                                                    WhatsApp
                                                </button>
                                            )}
                                            {getSocialLink('call') && (
                                                <button onClick={() => window.location.href = `tel:+${formatPhoneNumber(getSocialLink('call'))}`}>
                                                    <img src={'https://i.pinimg.com/originals/8e/a0/83/8ea08365d331d8ae9bd93ba5f50528d4.png'} alt="Call" className="contact-icon" />
                                                    Call
                                                </button>
                                            )}
                                        </div>
                                        <button onClick={handleModal} className="close-button">Close</button>
                                    </div>
                                </div>
                            )}

                            {showShareModal && (
                                <div className="modal-overlay" onClick={toggleShareModal}>
                                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                        {/* Modal Content */}
                                        <div className="btnBx">
                                            {getSocialLink('playstore') && (

                                                <button
                                                    onClick={() => handleLinkShare(getSocialLink('playstore'))}
                                                >
                                                    <img
                                                        src={'https://cdn-icons-png.flaticon.com/512/732/732208.png'}
                                                        alt="Play Store"
                                                        className="contact-icon"
                                                    />
                                                    Play Store
                                                </button>
                                            )}
                                            {getSocialLink('appstore') && (

                                                <button
                                                    onClick={() => handleLinkShare(getSocialLink('appstore'))}
                                                >
                                                    <img
                                                        src={'https://cdn.prod.website-files.com/5e3b3ad7af6930fad8539619/5f2890f2688f1156c5b8da7e_appstore.png'}
                                                        alt="App Store"
                                                        className="contact-icon"
                                                    />
                                                    App Store
                                                </button>
                                            )}
                                            {getSocialLink('websiter') && (
                                                <button
                                                    onClick={() => handleLinkShare(getSocialLink('websiter'))}>
                                                    <img
                                                        src={'https://cdn-icons-png.flaticon.com/512/5339/5339184.png'}
                                                        alt="Share Website"
                                                        className="contact-icon"
                                                    />
                                                    Website
                                                </button>

                                            )}
                                        </div>
                                        <button onClick={toggleShareModal} className="close-button">Close</button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HomeMobHeader;
