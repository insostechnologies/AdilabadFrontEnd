import React, { useContext, useState } from 'react'
import './AddMember.css'
import SectionMenuLeft from '../../../components/SectionMenuLeft/SectionMenuLeft.jsx';
import { AdminSidebarContext } from '../../../../context/adminSidebarContext.js';
import { readFileAsBase64 } from '../../../../utils/fileHandle'
import { config } from '../../../../config';
import ImageUploading from "react-images-uploading";
import { useNavigate } from 'react-router-dom';
function AddMember() {
    const { isSidebar } = useContext(AdminSidebarContext);
    const [images, setImages] = useState([]);
    const [name, setName] = useState("");
    const [designation, setDesignation] = useState("");
    const navigate = useNavigate();
    const maxNumber = 1;
    const addMember = async (event) => {
        event.preventDefault();

        const imgArr = await Promise.all(images.map(async (img) => {
            const base64String = await readFileAsBase64(img.file);
            return base64String;
        }));


        const notificationData = {
            name: name,
            designation: designation,
            images: imgArr[0],
        };

        console.log(notificationData);

        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/member/add`, {
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
                    navigate('/admin/about');
                }
            } else {
                alert('Failed to upload file.');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file.');
        }
    };
    const onChange = (imageList, addUpdateIndex) => {
        setImages(imageList);
    };

    return (
        <div className="body">
            <div id="wrapper">
                <div id="page" className="">
                    <div className="layout-wrap">
                        <SectionMenuLeft />
                        <div className="section-content-right">
                            <div className="main-content" style={{ paddingLeft: isSidebar ? '280px' : '0px' }}>
                                <div className="main-content-inner">
                                    <div className="flex items-center flex-wrap justify-between gap20 mb-27">
                                        <h3>Add Member</h3>
                                    </div>
                                    <div className='notifications'>
                                        <div className="main-box">

                                            <div className='input-area  shadow p-4'>
                                                <form onSubmit={addMember}>
                                                    <div className='single-input'>
                                                        <label>Profile Image<span className="tf-color-1">*</span></label>
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
                                                        <label htmlFor="title" className='tags'>Name :<span>*</span></label>
                                                        <input name="title" value={name} onChange={(event) => setName(event.target.value)} type="text" id="title" placeholder="Name" required />
                                                    </div>
                                                    <div className='single-input'>
                                                        <label htmlFor="message" className='tags'>designation :<span>*</span></label>
                                                        <input name="message" value={designation} onChange={(event) => setDesignation(event.target.value)} type="text" id="message" placeholder="Designation" required />
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
    )
}

export default AddMember