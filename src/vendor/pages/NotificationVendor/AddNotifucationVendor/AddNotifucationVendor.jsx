import React, { useContext, useEffect, useState } from 'react'
import SectionMenuLeft from '../../../components/SectionMenuLeft/SectionMenuLeft';
import { AdminSidebarContext } from '../../../../context/adminSidebarContext';
import './AddNotifucationVendor.css'
import { readFileAsBase64 } from '../../../../utils/fileHandle'
import { config } from '../../../../config';
import ImageUploading from "react-images-uploading";
import { useNavigate } from 'react-router-dom';
function AddNotifucationVendor() {
    const { isSidebar } = useContext(AdminSidebarContext);
    const [images, setImages] = useState([]);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [url, setUrl] = useState("");
    const maxNumber = 1;
    const vendor = JSON.parse(localStorage.getItem('vendor'));
    const vendor_id = vendor.uid;
    const [storeId, setStoreId] = useState('');
    const navigate = useNavigate();
    const fetchVendorStore = async (vendor_id) => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/vendor/store/${vendor_id}`, {
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
                let store_id = result.store_id;
                setStoreId(store_id);
            }else{

            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };



    const resetForm = () => {
        console.log('Resetting form...');
        setImages([]);
        setTitle("");
        setMessage("");
        setUrl("");
        console.log('Form reset complete.');
    };

    const onChange = (imageList, addUpdateIndex) => {
        setImages(imageList);
    };

    const addNotification = async (event) => {
        event.preventDefault();

        const imgArr = await Promise.all(images.map(async (img) => {
            const base64String = await readFileAsBase64(img.file);
            return base64String;
        }));
        

        const notificationData = {
            title: title,
            message: message,
            url: url,
            images: imgArr[0],
            storeId: storeId
        };

        console.log(notificationData);

        try {
            const response = await fetch(`${config.backEndBaseUrl}api/promotions/vendor/notification/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(notificationData),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.status) {
                    console.log('Notification added successfully. Resetting form...');
                    resetForm();
                    navigate('/vendor/notification');
                }else{
                    alert(data.message);
                }
            } else {
                alert('Failed to upload file.');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file.');
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            await fetchVendorStore(vendor_id);
        };
        fetchData();
    }, [vendor_id]);


    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    const handleUrlChange = (event) => {
        setUrl(event.target.value);
    };


    return (
        <>
            <div className="body">

                {/* #wrapper */}
                <div id="wrapper">
                    {/* #page */}
                    <div id="page" className="">
                        {/* layout-wrap */}
                        <div className="layout-wrap">
                            <SectionMenuLeft />

                            <div className="section-content-right">
                                {/* main-content */}
                                <div className="main-content" style={{ paddingLeft: isSidebar ? '280px' : '0px' }}>
                                    {/* main-content-wrap */}
                                    <div className="main-content-inner">
                                        <div className="flex items-center flex-wrap justify-between gap20 mb-27">
                                            <h3>Push Notification</h3>
                                        </div>
                                        <div className='notifications'>
                                            <div className="main-box">

                                                <div className='input-area  shadow p-4'>
                                                    <form onSubmit={addNotification}>
                                                        <div className='single-input'>
                                                            <label>Image<span className="tf-color-1">*</span></label>
                                                            <div className="upload-image flex-grow">
                                                                <div className="App">
                                                                    <ImageUploading
                                                                        value={images}
                                                                        onChange={onChange}
                                                                        maxNumber={maxNumber}
                                                                        dataURLKey="data_url"
                                                                        acceptType={["jpg", "png", "jpeg"]}
                                                                    >
                                                                        {({
                                                                            imageList,
                                                                            onImageUpload,
                                                                            onImageRemove,
                                                                            isDragging,
                                                                            dragProps
                                                                        }) => (
                                                                            <div className="upload__image-wrapper">
                                                                                <button
                                                                                    type='button'
                                                                                    style={isDragging ? { color: "red" } : null}
                                                                                    onClick={onImageUpload}
                                                                                    {...dragProps}
                                                                                    className='btn btn-lg btn-success p-4 mb-2'
                                                                                >
                                                                                    Select Image
                                                                                </button>
                                                                                <div className='prv_img '>
                                                                                    {imageList.map((image, index) => (
                                                                                        <div key={index} className="image-item">
                                                                                            <img src={image.data_url} alt="" width="100" />
                                                                                            <div className="image-item__btn-wrapper">
                                                                                                <div className='btn_con'>
                                                                                                    <button
                                                                                                        type='button'
                                                                                                        className='btn btn-lg btn-danger p-2 m-1'
                                                                                                        onClick={() => onImageRemove(index)}
                                                                                                    >
                                                                                                        Remove
                                                                                                    </button>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </ImageUploading>
                                                                </div>
                                                            </div>
                                                        </div>


                                                        <div className='single-input'>
                                                            <label htmlFor="title" className='tags'>Notification Title:<span>*</span></label>
                                                            <input name="title" value={title} onChange={handleTitleChange} type="text" id="title" placeholder="Notification Title" />
                                                        </div>
                                                        <div className='single-input'>
                                                            <label htmlFor="message" className='tags'>Message:<span>*</span></label>
                                                            <input name="message" value={message} onChange={handleMessageChange} type="text" id="message" placeholder="Notification Message" required />
                                                        </div>
                                                        <div className='single-input'>
                                                            <label htmlFor="url" className='tags'>URL:</label>
                                                            <input name="url" value={url} onChange={handleUrlChange} type="text" id="url" placeholder="This Link will be Clicked when Clicked" />
                                                        </div>
                                                        <div className='noti_btn_wrapper'>
                                                            <button type="submit">Submit</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                        {/* /main-content-wrap */}
                                    </div>
                                    {/* /main-content-wrap */}

                                </div>
                                {/* /main-content */}
                            </div>
                            {/* /section-content-right */}
                        </div>
                        {/* /layout-wrap */}
                    </div>
                    {/* /#page */}
                </div>
                {/* /#wrapper */}


            </div>
        </>
    )
}

export default AddNotifucationVendor