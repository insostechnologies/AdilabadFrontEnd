import React, { useContext, useEffect, useState } from 'react';
import { config } from '../../../config';
import { IoMdArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import './TermsVendor.css';
import SectionMenuLeft from '../../components/SectionMenuLeft/SectionMenuLeft';
import { AdminSidebarContext } from '../../../context/adminSidebarContext';

function TermsVendor() {
    const navigate = useNavigate();
    const [terms, setTerms] = useState(null);
    const { isSidebar } = useContext(AdminSidebarContext);
    const goBack = () => {
        navigate(-1);
    };

    const getUserPolicy = async () => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/policy`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (result.status) {
                setTerms(result.data); // Corrected from `response.data` to `result.data`
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getUserPolicy();
    }, []); // Added an empty dependency array to avoid multiple calls

    return (

        <div className="body">
            <div id="wrapper">
                <div id="page" className="">
                    <div className="layout-wrap">
                        <SectionMenuLeft />
                        <div className="section-content-right">
                            <div className="main-content" style={{ paddingLeft: isSidebar ? '280px' : '0px' }}>
                                <div className="main-content-inner">
                                    {terms ? (
                                        <div className="terms-content">
                                            <div className="terms-section">
                                                <h2>Privecy Policy</h2>
                                                <div
                                                    className="policy-text"
                                                    dangerouslySetInnerHTML={{ __html: terms.vendor_policy }}
                                                ></div>
                                            </div>
                                            <div className="terms-section">
                                                <h2>Terms & Conditions</h2>
                                                <div
                                                    className="policy-text"
                                                    dangerouslySetInnerHTML={{ __html: terms.vendor_tnc }}
                                                ></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="loading-text">Loading terms...</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TermsVendor;
