import React, { useState, useEffect, useRef } from 'react';
import './AddProductImage.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import ImageUploading from "react-images-uploading";
import { config } from '../../../../config';
import { readFileAsBase64 } from '../../../../utils/fileHandle'
import { useNavigate } from 'react-router-dom';
import SectionMenuLeft from '../../../components/SectionMenuLeft/SectionMenuLeft';
import { useContext } from 'react';
import { AdminSidebarContext } from '../../../../context/adminSidebarContext';

function AddProductImage() {

    const [images, setImages] = useState([]);
    const [imageDetails, setImageDetails] = useState([]);
    const maxNumber = 69;
    const { uid } = useParams()
    const navigate = useNavigate();

    const handleDetailChange = (index, field, value) => {
        const newImageDetails = [...imageDetails];
        newImageDetails[index][field] = value;
        setImageDetails(newImageDetails);
    };

    const addPlaceholderImage = () => {
        const newImages = [...images, { data_url: '' }];
        setImages(newImages);

        const newImageDetails = [...imageDetails, { title: '', linkText: '' }];
        setImageDetails(newImageDetails);
    };


    const onChange = (imageList, addUpdateIndex) => {
        setImages(imageList);
        setImageDetails(imageList.map(() => ({ title: '', linkText: '' })));
    };

    const isValidURL = (string) => {
        const res = string.match(/(https?|ftp):\/\/[^\s/$.?#].[^\s]*/i);
        return (res !== null);
    };

    const addBanner = async (e) => {
        e.preventDefault();
    

        if (images.length === 0) {
            toast.error('Please select banner images', { position: 'top-center' });
        } else {
            
            try {
                // for (let i = 0; i < imageDetails.length; i++) {
                //     if (!isValidURL(imageDetails[i].linkText)) {
                //         toast.error(`Image ${i + 1}: Please enter a valid URL for the link`, { position: 'top-center' });
                //         return
                //     }
                // }
                const imgArr = await Promise.all(images.map(async (img) => {
                    const base64String = img.file ? await readFileAsBase64(img.file) : ''
                    return base64String
                }));
    
                const bannerData = {
                    images: imgArr.map((img, index) => ({
                        base64: img,
                        title: imageDetails[index].title,
                        linkText: imageDetails[index].linkText
                    }))
                };
    
                const response = await fetch(`${config.backEndBaseUrl}api/product/image/add/${uid}`, {
                    method: 'POST',
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
                    navigate(`/admin/product/images/${uid}`);
                    resetForm();
                } else {
                    toast.error('Error uploading banner', { position: 'top-center' });
                }
            } catch (error) {
                console.error('Error uploading banner:', error);
                toast.error('Internal server error', { position: 'top-center' });
            }
        }
    }
    const resetForm = () => {
        setImages([]);

    };
    const { isSidebar } = useContext(AdminSidebarContext);


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
                                            <form className="form-new-product form-style-1" onSubmit={addBanner}>
                                                <fieldset>
                                                    <div className="body-title">Product Image<span className="tf-color-1">*</span></div>
                                                    <div className="upload-image flex-grow">
                                                        <div className="App">
                                                            <ImageUploading
                                                                multiple
                                                                value={images}
                                                                onChange={onChange}
                                                                maxNumber={maxNumber}
                                                                dataURLKey="data_url"
                                                                acceptType={["jpg", "png", "jpeg"]}
                                                            >
                                                                {({
                                                                    imageList,
                                                                    onImageUpload,
                                                                    onImageRemoveAll,
                                                                    onImageUpdate,
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
                                                                            className='btn btn-lg btn-success p-4 m-4'
                                                                        >
                                                                            Select Image
                                                                        </button>
                                                                        &nbsp;
                                                                        <button
                                                                            type='button'
                                                                            className='btn btn-lg btn-success p-4 m-4'
                                                                            onClick={addPlaceholderImage}
                                                                        >
                                                                            Add Title and Link Only
                                                                        </button>
                                                                        &nbsp;
                                                                        <button
                                                                            type='button'
                                                                            style={imageList.length === 0 ? { display: 'none' } : {}}
                                                                            className='btn btn-lg btn-danger p-4 m-2'
                                                                            onClick={onImageRemoveAll}
                                                                        >
                                                                            Remove all images
                                                                        </button>
                                                                        <div className='prv_img m-2 '>
                                                                            {imageList.map((image, index) => (
                                                                                <div key={index} className="image-item">
                                                                                    <img src={image.data_url} alt="" width="100" />
                                                                                    <div className="image-item__btn-wrapper">
                                                                                        <h4 align="left">Position : {index + 1}</h4>
                                                                                        <div>
                                                                                            <input
                                                                                                className='banner-img-input'
                                                                                                type="text"
                                                                                                placeholder={`Image ${index + 1} Title`}
                                                                                                value={imageDetails[index]?.title || ''}
                                                                                                onChange={(e) => handleDetailChange(index, 'title', e.target.value)}
                                                                                            />
                                                                                            <input
                                                                                                className='banner-img-input'
                                                                                                type="text"
                                                                                                placeholder={`Image ${index + 1} Link`}
                                                                                                value={imageDetails[index]?.linkText || ''}
                                                                                                onChange={(e) => handleDetailChange(index, 'linkText', e.target.value)}
                                                                                            />
                                                                                        </div>
                                                                                        <div className='btn_con'>
                                                                                            <button
                                                                                                type='button'
                                                                                                className='btn btn-lg btn-secondary p-2 m-1'
                                                                                                onClick={() => onImageUpdate(index)}
                                                                                            >
                                                                                                Change Image
                                                                                            </button>
                                                                                            <button
                                                                                                type='button'
                                                                                                className='btn btn-lg btn-danger p-2 m-1'
                                                                                                onClick={() => onImageRemove(index)}
                                                                                            >
                                                                                                Delete Image
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
                                                </fieldset>

                                                <div className="bot">
                                                    <button className="tf-button w208 mx-auto" type="submit">Save</button>
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

export default AddProductImage