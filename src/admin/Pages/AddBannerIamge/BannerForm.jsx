import React, { useState, useEffect, useRef } from 'react';
import './bannerForm.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImageUploading from "react-images-uploading";
import { config } from '../../../config';
import { readFileAsBase64 } from '../../../utils/fileHandle'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

function BannerForm() {
    const [images, setImages] = useState([]);
    const [imageDetails, setImageDetails] = useState([]);
    const { uid } = useParams();
    const maxNumber = 69;
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false)

    const onChange = (imageList, addUpdateIndex) => {
        setImages(imageList);
        setImageDetails(imageList.map(() => ({ title: '', linkText: '', youtubeLink: '' })));
    };

    const isValidURL = (string) => {
        const res = string.match(/(https?|ftp):\/\/[^\s/$.?#].[^\s]*/i);
        return (res !== null);
    };

    const isValidYouTubeURL = (string) => {
        const youtubePattern = /^(https?:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/;
        return youtubePattern.test(string);
    };

    const resetForm = () => {
        setImages([]);
        setImageDetails([]);
    };

    const handleDetailChange = (index, field, value) => {
        const newImageDetails = [...imageDetails];
        newImageDetails[index][field] = value;
        setImageDetails(newImageDetails);
    };

    const addBanner = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        if (images.length === 0) {
            toast.error('Please select banner images', { position: 'top-center' });
            setIsLoading(false);
            return;
        } else {
            for (let i = 0; i < imageDetails.length; i++) {
                if (imageDetails[i].linkText && !isValidURL(imageDetails[i].linkText)) {
                    toast.error(`Image ${i + 1}: Please enter a valid URL for the link`, { position: 'top-center' });
                    setIsLoading(false);
                    return;
                }
                if (imageDetails[i].youtubeLink && !isValidYouTubeURL(imageDetails[i].youtubeLink)) {
                    toast.error(`Image ${i + 1}: Please enter a valid YouTube URL`, { position: 'top-center' });
                    setIsLoading(false);
                    return;
                }
            }

            const imgArr = await Promise.all(images.map(async (img) => {
                const base64String = await readFileAsBase64(img.file);
                return base64String;
            }));

            const bannerData = {
                images: imgArr.map((img, index) => ({
                    base64: img,
                    title: imageDetails[index].title,
                    linkText: imageDetails[index].linkText,
                    youtubeLink: imageDetails[index].youtubeLink,
                }))
            };

            try {
                const response = await fetch(`${config.backEndBaseUrl}api/banner/images/add/${uid}`, {
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
                    resetForm();
                    navigate(`/admin/banner/image/${uid}`);
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





    return (
        <>
            <ToastContainer />
            <div className="wg-box">
                <form className="form-new-product form-style-1" onSubmit={addBanner}>
                    <fieldset>
                        <div className="body-title">Banner Image<span className="tf-color-1">*</span></div>
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
                                                Select banners
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
                                                                    placeholder={`Banner ${index + 1} Title`}
                                                                    value={imageDetails[index]?.title || ''}
                                                                    onChange={(e) => handleDetailChange(index, 'title', e.target.value)}
                                                                />
                                                                <input
                                                                    className='banner-img-input'
                                                                    type="text"
                                                                    placeholder={`Banner ${index + 1} Link`}
                                                                    value={imageDetails[index]?.linkText || ''}
                                                                    onChange={(e) => handleDetailChange(index, 'linkText', e.target.value)}
                                                                />
                                                                <input
                                                                    className='banner-img-input'
                                                                    type="text"
                                                                    placeholder={`Banner ${index + 1} YouTube Link`}
                                                                    value={imageDetails[index]?.youtubeLink || ''}
                                                                    onChange={(e) => handleDetailChange(index, 'youtubeLink', e.target.value)}
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
                        <div></div>
                        <button type="submit" className="tf-button w208 h10" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default BannerForm;
