import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { config } from '../../../config';
import { AdminSidebarContext } from '../../../context/adminSidebarContext';
import { useContext } from 'react';
import './navbar.css'
import share_icon from '../Assets/Images/share-icon.png';
import call_icon from '../Assets/Images/phone.png';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

function Header() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null)
    const { frontEndBaseUrl } = config;
    const { toggle, isSidebar } = useContext(AdminSidebarContext);
    const [logo, setLogo] = useState('')
    const [socialDetails, setSocialDetails] = useState([])
    const [loading, setLoading] = useState(true); // loading state
    const [webLink, setWebLink] = useState('');
    const [appLink, setAppLink] = useState('');
    const [playStoreLink, setPlayStoreLink] = useState('');

    const [showModal, setShowModal] = useState(false);
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
                setSocialDetails(result.data.socialDetails)
                setLogo(config.backEndBaseUrl + result.data.seoDetails.logo)

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
        try {
            // Extract the last part of the URL after the last slash
            const cleanedUrl = url.split('/').pop(); // Gets 'www.website.com'

            console.log('Cleaned URL to share:', cleanedUrl);

            if (navigator.share) {
                // Use the Web Share API
                navigator.share({
                    title: 'Check this out!',
                    text: cleanedUrl, // Share only the cleaned URL
                })
                    .then(() => console.log('Successfully shared'))
                    .catch((error) => console.error('Error sharing:', error));
            } else {
                // Fallback: Copy to clipboard
                navigator.clipboard
                    .writeText(cleanedUrl) // Copy only the cleaned URL
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
        } catch (error) {
            console.error('Invalid URL:', error);
            toast.error('Invalid URL provided.', {
                position: 'top-center',
            });
        }
    };





    // const handleLogout = () => {
    //     localStorage.removeItem('vendorUserId')
    //     localStorage.removeItem('vendorAuthToken')
    //     window.location.href = '/vendor';
    // }

    const fetchAdmin = async () => {
        try {

            // Send the request
            const response = await fetch(`${config.backEndBaseUrl}api/user/${'8bf0589fef541a20'}?q=v`, {
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
                setWebLink(result.data.seoVendorDetails.website_link)
                setAppLink(result.data.seoVendorDetails.app_store_link)
                setPlayStoreLink(result.data.seoVendorDetails.play_store_link)
            } else {
                console.log('internal server error')
            }

        } catch (error) {
            console.error('Error update data:', error);
        }
    }

    useEffect(() => {
        fetchAdmin()
    }, [])


    return (
        <>
            {/* header-dashboard */}
            <div className="header-dashboard" style={{ width: isSidebar ? 'calc(100% - 280px)' : '100%' }}>
                <div className="wrap">
                    <div className="header-left">
                        <div style={{ display: isSidebar ? 'none' : 'block' }} onClick={toggle}>
                            <img className="" id="logo_header_mobile" alt="logo_header" src={`${logo}`} />
                        </div>
                        <div className="button-show-hide" style={{ display: isSidebar ? 'none' : 'block' }} onClick={toggle}>
                            <i className="icon-menu-left"></i>
                        </div>

                    </div>
                    <div className="header-grid">

                        <div className='col_right'>

                            <button onClick={toggleShareModal}>
                                <img src={share_icon} className='icon' alt="share_icon" />
                            </button>

                            {/* Call icon functionality */}
                            <button onClick={handleModal}>
                                <img src={call_icon} className='icon' alt="call_icon" />
                            </button>
                        </div>
                        {/* <div className="popup-wrap user type-header">
							<div className="dropdown">
								<button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton3" data-bs-toggle="dropdown" aria-expanded="false">
									<span className="header-user wg-user">
										<span className="image">
											<img src={`${userImage}`} class="userImage" alt="avatar_img" />
										</span>
										<span className="flex flex-column">
											<span className="body-title mb-2">Quantum Brize</span>
											<span className="text-tiny">Vendor</span>
										</span>
									</span>
								</button>
								<ul className="dropdown-menu dropdown-menu-end has-content" aria-labelledby="dropdownMenuButton3" >
									<li>
										<Link to="setting" className="user-item">
											<div className="icon">
												<i className="icon-user"></i>
											</div>
											<div className="body-title-2">Setting</div>
										</Link>
									</li>
									<li>
										<Link to="" className="user-item" onClick={() => handleLogout()}>
											<div className="icon">
												<i className="icon-log-out"></i>
											</div>
											<div className="body-title-2">Log out</div>
										</Link>
									</li>
								</ul>
							</div>
						</div> */}

                        {/* Share icon functionality */}
                        {showModal && (
                            <div className="modal-overlay" onClick={handleModal}>
                                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                    {/* <h3>Contact Options</h3> */}
                                    <div className='btnBx'>
                                        <button onClick={() => window.open(`https://wa.me/${getSocialLink('whatsapp')}`, '_blank')}>
                                            <img src={'https://cdn3.iconfinder.com/data/icons/social-media-chamfered-corner/154/whatsapp-512.png'} alt="WhatsApp" className="contact-icon" />
                                            WhatsApp
                                        </button>
                                        <button onClick={() => window.location.href = `tel:+${getSocialLink('call')}`}>
                                            <img src={'https://i.pinimg.com/originals/8e/a0/83/8ea08365d331d8ae9bd93ba5f50528d4.png'} alt="Call" className="contact-icon" />
                                            Call
                                        </button>
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
                                        <button
                                            onClick={() => handleLinkShare(appLink)}
                                        >
                                            <img
                                                src={'https://cdn-icons-png.flaticon.com/512/732/732208.png'}
                                                alt="Play Store"
                                                className="contact-icon"
                                            />
                                            Play Store
                                        </button>
                                        <button
                                            onClick={() => handleLinkShare(playStoreLink)}
                                        >
                                            <img
                                                src={'https://cdn.prod.website-files.com/5e3b3ad7af6930fad8539619/5f2890f2688f1156c5b8da7e_appstore.png'}
                                                alt="App Store"
                                                className="contact-icon"
                                            />
                                            App Store
                                        </button>
                                        <button
                                            onClick={() => handleLinkShare(webLink)}
                                        >
                                            <img
                                                src={'https://cdn-icons-png.flaticon.com/512/5339/5339184.png'}
                                                alt="Share Website"
                                                className="contact-icon"
                                            />
                                            Website
                                        </button>
                                    </div>
                                    <button onClick={toggleShareModal} className="close-button">Close</button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>


        </>
    )
}

export default Header