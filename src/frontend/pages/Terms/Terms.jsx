import React, { useEffect, useState } from 'react';
import { config } from '../../../config';
import { IoMdArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import './Terms.css';

function Terms() {
    const navigate = useNavigate();
    const [terms, setTerms] = useState(null);

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
        <>
            <div className="arrow_con">
                <IoMdArrowBack onClick={goBack} className="arrow" />
            </div>
            <div className="terms-container">

                {terms ? (
                    <div className="terms-content">
                        <div className="terms-section">
                            <h2>Privecy Policy</h2>
                            <div
                                className="policy-text"
                                dangerouslySetInnerHTML={{ __html: terms.user_policy }}
                            ></div>
                        </div>
                        <div className="terms-section">
                            <h2>Terms & Conditions</h2>
                            <div
                                className="policy-text"
                                dangerouslySetInnerHTML={{ __html: terms.user_tnc }}
                            ></div>
                        </div>
                    </div>
                ) : (
                    <p className="loading-text">Loading terms...</p>
                )}
            </div>
        </>
    );
}

export default Terms;
