import React, { useEffect, useState } from 'react';
import SectionMenuLeft from '../../../components/SectionMenuLeft/SectionMenuLeft';
import { AdminSidebarContext } from '../../../../context/adminSidebarContext';
import { useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { config } from '../../../../config';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateComment() {
    const { isSidebar } = useContext(AdminSidebarContext);
    const [reply, setReply] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { uid } = useParams();

    const addComment = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        if (reply === '') {
            toast.error('Please add a Reply', { position: 'top-center' });
            setIsLoading(false);
            return;
        } else {

            const bannerData = {
                reply: reply,
            };

            try {
                const response = await fetch(`${config.backEndBaseUrl}api/store/comment/reply/update/${uid}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bannerData)
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                if (result.status) {
                    toast.success(result.message, { position: 'top-center' });
                    navigate(-1)
                } else {
                    toast.error('Error uploading banner', { position: 'top-center' });
                }
            } catch (error) {
                console.error('Error uploading banner:', error);
                toast.error('Internal server error', { position: 'top-center' });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const fetchReply = async (uid) => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/store/comment/reply/${uid}`, {
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
                setReply(result.data.reply);
            }

        } catch (error) {
            console.error('Error fetching categories:', error);
            // Handle error state or display error message
        }
    }

    useEffect(()=>{
        fetchReply(uid)
    },[uid])



    return (
        <>
            <div class="body">
                <ToastContainer />
                {/*#wrapper */}
                <div id="wrapper">
                    {/*#page */}
                    <div id="page" class="">
                        {/*layout-wrap */}
                        <div class="layout-wrap">
                            <SectionMenuLeft />
                            <div class="section-content-right">
                                {/*main-content */}
                                <div class="main-content" style={{ paddingLeft: isSidebar ? '280px' : '0px' }}>
                                    {/*main-content-wrap */}
                                    <div class="main-content-inner">
                                        <div class="flex items-center flex-wrap justify-between gap20 mb-27">
                                            <h3>Add Reply</h3>
                                        </div>
                                        <div className="wg-box">
                                            <form className="form-new-product form-style-1" onSubmit={addComment}>
                                                <fieldset className="name">
                                                    <div className="body-title">Reply<span className="tf-color-1">*</span></div>
                                                    <input
                                                        style={{ height: '100px' }}
                                                        className="flex-grow"
                                                        type="text"
                                                        placeholder="Reply"
                                                        value={reply}
                                                        onChange={(event) => setReply(event.target.value)} />
                                                </fieldset>
                                                <div className="bot">
                                                    <div></div>
                                                    <button type="submit" className="tf-button w208 h10" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    {/*/main-content-wrap */}
                                </div>
                            </div>
                            {/*/section-content-right */}
                        </div>
                        {/*/layout-wrap */}
                    </div>
                    {/*/#page */}
                </div>
                {/*/#wrapper */}


            </div>

        </>
    )
}

export default UpdateComment