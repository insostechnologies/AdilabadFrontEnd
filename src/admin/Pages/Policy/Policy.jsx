import React, { useContext, useEffect, useState } from 'react';
import './Policy.css';
import SectionMenuLeft from '../../components/SectionMenuLeft/SectionMenuLeft.jsx';
import { AdminSidebarContext } from '../../../context/adminSidebarContext.js';
import { config } from '../../../config';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Policy() {
    const { isSidebar } = useContext(AdminSidebarContext);
    const [userPolicy, setUserPolicy] = useState("");
    const [vendorPolicy, setVendorPolicy] = useState("");
    const [userTnC, setUserTnC] = useState("");
    const [vendorTnC, setVendorTnC] = useState("");
    const navigate = useNavigate();

    const getUserPolicy = async () => {

        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/policy`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const result = await response.json();
            if (result.status) {
                setUserPolicy(result.data.user_policy)
                setUserTnC(result.data.user_tnc)
                setVendorPolicy(result.data.vendor_policy)
                setVendorTnC(result.data.vendor_tnc)
            }
        } catch (error) {
            console.error(error);
        }
    }

    const submitUserPolicy = async (event) => {
        event.preventDefault();

        const userData = {
            userPolicy: userPolicy,
            userTnC: userTnC,
            type: 'user'
        };

        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/policy`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                console.log('User policy and T&C submitted successfully');
                toast.success('User policy and T&C submitted successfully', { position: 'top-center' });
            } else {
                alert('Failed to submit user policy and T&C.');
            }
        } catch (error) {
            console.error('Error submitting user policy and T&C:', error);
            alert('Error submitting user policy and T&C.');
        }
    };

    const submitVendorPolicy = async (event) => {
        event.preventDefault();

        const vendorData = {
            vendorPolicy: vendorPolicy,
            vendorTnC: vendorTnC,
            type: 'vendor'
        };

        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/policy`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(vendorData),
            });

            if (response.ok) {
                console.log('Vendor policy and T&C submitted successfully');
                toast.success('Vendor policy and T&C submitted successfully', { position: 'top-center' });

            } else {
                alert('Failed to submit vendor policy and T&C.');
            }
        } catch (error) {
            console.error('Error submitting vendor policy and T&C:', error);
            alert('Error submitting vendor policy and T&C.');
        }
    };

    useEffect(() => {
        getUserPolicy()
    }, [])

    return (
        <div className="body">
            <ToastContainer />

            <div id="wrapper">
                <div id="page" className="">
                    <div className="layout-wrap">
                        <SectionMenuLeft />
                        <div className="section-content-right">
                            <div className="main-content" style={{ paddingLeft: isSidebar ? '280px' : '0px' }}>
                                <div className="main-content-inner">
                                    <h3>Privacy Policy & T&C</h3>
                                    {/* User Policy Section */}
                                    <div className='notifications'>
                                        <div className="main-box">
                                            <div className='input-area shadow p-4 m-4'>
                                                <form onSubmit={submitUserPolicy}>
                                                    <h5>User Policy</h5>
                                                    <div className='single-input'>
                                                        <CKEditor
                                                            editor={ClassicEditor}
                                                            data={userPolicy}
                                                            onChange={(event, editor) => {
                                                                setUserPolicy(editor.getData());
                                                            }}
                                                        />
                                                    </div>
                                                    <h5>User T&C</h5>
                                                    <div className='single-input'>
                                                        <CKEditor
                                                            editor={ClassicEditor}
                                                            data={userTnC}
                                                            onChange={(event, editor) => {
                                                                setUserTnC(editor.getData());
                                                            }}
                                                        />
                                                    </div>
                                                    <div className='noti_btn_wrapper'>
                                                        <button type="submit">Save</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Vendor Policy Section */}
                                    <div className='notifications'>
                                        <div className="main-box">
                                            <div className='input-area shadow p-4 m-4'>
                                                <form onSubmit={submitVendorPolicy}>
                                                    <h5>Vendor Policy</h5>
                                                    <div className='single-input'>
                                                        <CKEditor
                                                            editor={ClassicEditor}
                                                            data={vendorPolicy}
                                                            onChange={(event, editor) => {
                                                                setVendorPolicy(editor.getData());
                                                            }}
                                                        />
                                                    </div>
                                                    <h5>Vendor T&C</h5>
                                                    <div className='single-input'>
                                                        <CKEditor
                                                            editor={ClassicEditor}
                                                            data={vendorTnC}
                                                            onChange={(event, editor) => {
                                                                setVendorTnC(editor.getData());
                                                            }}
                                                        />
                                                    </div>
                                                    <div className='noti_btn_wrapper'>
                                                        <button type="submit">Submit Vendor Policy & T&C</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Policy;
