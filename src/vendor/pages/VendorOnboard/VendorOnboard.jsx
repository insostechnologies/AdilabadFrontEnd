import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import './VendorOnboard.css'
import { config } from "../../../config";
import { AiOutlineRight } from "react-icons/ai";
import contact_call_png from '../../components/Assets/Images/contact_call_png.png';
import whatsapp_pnp from '../../components/Assets/Images/whatsapp_pnp.png';
import { formatPhoneNumber } from '../../../utils/helper'

const VendorOnboard = () => {
    const [logo, setLogo] = useState('../../components/Assets/Images/brand_logo.png')
    const [title, setTitle] = useState('')
    const [siteDetails, setSiteDetails] = useState(null);
    const [vendorDetails, setVendorDetails] = useState(null)
    const navigate = useNavigate();

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
                setSiteDetails(result.data);
                setLogo(config.backEndBaseUrl + result.data.seoDetails.logo)

            } else {
                console.log('Internal server error');
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        fetchSiteDetails();
    }, []);
    const socialDetails = siteDetails?.socialDetails || [];

    // Helper to get the social link value
    const getSocialLink = (type) => socialDetails.find(detail => detail.type === type)?.value || '';
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
                setVendorDetails(result.data.seoVendorDetails)
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

    const handleSignUpRedirect = () => {
        window.location.href = config.frontEndBaseUrl + 'vendor/sing-up';
    };

    const handleLoginRedirect = () => {
        window.location.href = config.frontEndBaseUrl + 'vendor/login';
    };

    return (

        <>
            <div className="login-main">
                <div className="login-right">
                    <div className="login-right-container">
                        <div className="login-logo">
                            <img src={`${config.backEndBaseUrl}${vendorDetails?.logo}`} alt="logo" />
                        </div>
                        <div className="login-center">
                            <h4 >welcome to {vendorDetails?.name} login</h4>
                            <div className="div-con">
                                <h5>Add Your business Store</h5>
                                <p>If You are a new user, then first add your store details</p>
                                <button type="button" className="btns" onClick={handleSignUpRedirect}>
                                    {"Add Business"} <AiOutlineRight />
                                </button>
                            </div>
                            <div className="div-con" style={{ marginTop: '50px' }}>
                                <h5>already Have an Account</h5>
                                <p>If your store details is Added. then please login with your registered Phone Number</p>
                                <button type="button" className="btns" onClick={handleLoginRedirect}>
                                    {"Login"} <AiOutlineRight />
                                </button>
                            </div>
                        </div>
                        <div className='helpCon'>
                            <h4>Need Help ?</h4>
                            <p>
                                Contact Us :
                                <div className='social'>
                                    <a href={`tel:${formatPhoneNumber(getSocialLink('call'))}`}><img src={contact_call_png} className='call_icon' alt="call_icon" /></a>
                                    <a href={`https://wa.me/${formatPhoneNumber(getSocialLink('whatsapp'))}`}><img src={whatsapp_pnp} alt="whatsapp_icon" /></a>
                                </div>
                            </p>
                        </div>
                    </div>
                </div>
            </div >

        </>
    );
};

export default VendorOnboard;