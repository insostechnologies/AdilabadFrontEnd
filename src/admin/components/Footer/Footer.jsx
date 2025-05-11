import React, { useEffect, useState } from 'react';
import './Footer.css'
import { Link } from 'react-router-dom';
import { CiHeart } from "react-icons/ci";
import { config } from '../../../config';

function Footer() {

    let [copywrite, setCopyWrite] = useState('')
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
                setCopyWrite(result.data.seoDetails.copywrite)
            } else {
                console.log('internal server error')
            }

        } catch (error) {
            console.error('Error update data:', error);
        }
    }

    useEffect(() => {
        fetchAdmin(uid)
    }, [uid])

    return (
        <>
            {/* bottom-page */}
            <div className="bottom-page">
                {/* <CiHeart className="heart-icon"/> */}
                <div className="body-text">Copyright © 2024 <Link to="">{copywrite}</Link></div>
            </div>

        </>
    )
}

export default Footer