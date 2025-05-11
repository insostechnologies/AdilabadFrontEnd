import React, { useContext, useEffect, useState } from 'react';
import './UpdateAbout.css';
import SectionMenuLeft from '../../../components/SectionMenuLeft/SectionMenuLeft.jsx';
import { AdminSidebarContext } from '../../../../context/adminSidebarContext.js';
import { config } from '../../../../config.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function UpdateAbout() {
    const { isSidebar } = useContext(AdminSidebarContext);
    const [mission, setMission] = useState('');
    const [vision, setVision] = useState('');
    const [about, setAbout] = useState('');
    const navigate = useNavigate();

    const getAbout = async () => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/site/about`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.status) {
                setMission(result.data.mission);
                setVision(result.data.vision);
                setAbout(result.data.about);
            }

        } catch (error) {
            console.error(error);
        }
    };

    const updateAbout = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/site/about/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mission, vision, about }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.status) {
                toast.success('About information updated successfully', { position: 'top-center' });
                navigate('/admin/about');
            } else {
                toast.error('Failed to update about information', { position: 'top-center' });
            }
        } catch (error) {
            console.error('Error updating about information:', error);
            toast.error('Error updating about information', { position: 'top-center' });
        }
    };

    useEffect(() => {
        getAbout();
    }, []);

    return (
        <>
            <ToastContainer />
            <div className="body">
                <div id="wrapper">
                    <div id="page" className="">
                        <div className="layout-wrap">
                            <SectionMenuLeft />
                            <div className="section-content-right">
                                <div className="main-content" style={{ paddingLeft: isSidebar ? '280px' : '0px' }}>
                                    <div className="main-content-inner">
                                        <div className="flex items-center flex-wrap justify-between gap20 mb-27">
                                            <h3>Update About Information</h3>
                                        </div>
                                        <div className='notifications'>
                                            <div className="main-box">
                                                <div className='input-area shadow p-4'>
                                                    <form onSubmit={updateAbout}>
                                                        <div className='single-input'>
                                                            <label className='tags'>About :</label>
                                                            <input name="about" value={about} onChange={(event) => setAbout(event.target.value)} type="text" placeholder="About" />
                                                        </div>
                                                        <div className='single-input'>
                                                            <label className='tags'>Mission :</label>
                                                            <input name="mission" value={mission} onChange={(event) => setMission(event.target.value)} type="text" placeholder="Mission" />
                                                        </div>
                                                        <div className='single-input'>
                                                            <label className='tags'>Vision :</label>
                                                            <input name="vision" value={vision} onChange={(event) => setVision(event.target.value)} type="text" placeholder="Vision" />
                                                        </div>
                                                        <div className='noti_btn_wrapper'>
                                                            <button type="submit">Submit</button>
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
        </>
    );
}

export default UpdateAbout;