import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../../../../../config';
import SectionMenuLeft from '../../../../components/SectionMenuLeft/SectionMenuLeft';
import { AdminSidebarContext } from '../../../../../context/adminSidebarContext';
import { useContext } from 'react';
import { readFileAsBase64 } from '../../../../../utils/fileHandle'
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-tabs/style/react-tabs.css';
import './AddCoverImage.css'
import { useParams } from 'react-router-dom';

function AddCoverImage() {
    const { isSidebar } = useContext(AdminSidebarContext);

    const [loading, setLoading] = useState(false); // Add loading state
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);
    const [coverTitle, setCoverTitle] = useState('')
    const { uid } = useParams();

    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const fileReader = new FileReader();
            fileReader.onloadend = () => {
                setPreview(fileReader.result);
            };
            fileReader.readAsDataURL(selectedFile);
        } else {
            setPreview(null);
        }
    };

    const addCoverPhoto = async (event) => {
        event.preventDefault(); // Prevent default form submission
        setLoading(true); // Start loading

        try {
            let fileData = ''
            if (file) {
                // Convert file to Base64 string and wait for the result
                const str = await readFileAsBase64(file);
                fileData = str
            }

            let jsonData = {
                file: fileData,
                cover_title: coverTitle
            }


            if (fileData == '') {
                toast.error('please Upload a Cover Image', {
                    position: 'top-center',
                });
                setLoading(false);
                return
            } else {
                // Send the request
                const response = await fetch(`${config.backEndBaseUrl}api/store/cover/add/${uid}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(jsonData),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                if (!result.status) {
                    toast.error(result.errors[0].msg, {
                        position: 'top-center',
                    });
                } else {
                    toast.success(result.message, {
                        position: 'top-center',
                    });
                    resetForm();
                    navigate(`/admin/store/images/${uid}?tab=0`);
                }
            }

        } catch (error) {
            console.error('Error adding data:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFile(null);
        setPreview(null);
        setCoverTitle('');
    };




    return (
        <>
            <div className="body">
                <ToastContainer />
                <div id="wrapper">
                    <div id="page" className="">
                        <div className="layout-wrap">
                            <SectionMenuLeft />
                            <div className="section-content-right">
                                <div className="main-content" style={{ paddingLeft: isSidebar ? '280px' : '0px' }}>
                                    <div className="main-content-inner">
                                        <div className="wg-box wg-box-container">
                                            <form className="form-new-product form-style-1" onSubmit={addCoverPhoto}>
                                                <fieldset>
                                                    <div className="body-title">Cover Photo :<span className="tf-color-1">*</span></div>
                                                    <div className="upload-image flex-grow">
                                                        <div className="item up-load">
                                                            <label className="uploadfile" htmlFor="myFile">
                                                                <span className="icon">
                                                                    <i className="icon-upload-cloud"></i>
                                                                </span>
                                                                <span className="body-text">Drop your images here or select <span className="tf-color">click to browse</span>
                                                                </span>
                                                                <input type="file" id="myFile" onChange={handleFileChange} ref={fileInputRef} />
                                                                {preview && (
                                                                    <div className="image-preview">
                                                                        <img src={preview} alt="Image_Preview" className='prvImg' />
                                                                    </div>
                                                                )}
                                                            </label>
                                                        </div>
                                                    </div>
                                                </fieldset>
                                                <fieldset className="name">
                                                    <div className="body-title">Title Tag:</div>
                                                    <input className="flex-grow" type="text" placeholder="Latest, Trending, 20% off" name="text" tabindex="0" value={coverTitle} onChange={(e) => setCoverTitle(e.target.value)} />
                                                </fieldset>

                                                <div className="bot">
                                                    <button className="tf-button w208 mx-auto" type="submit"  disabled={loading}>{loading? 'Saving...':'Save'}</button>
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

        </>
    )
}

export default AddCoverImage