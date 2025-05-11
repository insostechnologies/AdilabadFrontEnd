import React, { useState, useEffect } from 'react';
import './UpdateStoreImage.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImageUploading from "react-images-uploading";
import { config } from '../../../../config';
import { readFileAsBase64 } from '../../../../utils/fileHandle';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
function UpdateStoreImageForm() {
    const [bannerImageTitle, setBannerImageTitle] = useState('');
    const [bannerImageLink, setBannerImageLink] = useState('');
    const [images, setImages] = useState([]);
    const [prefetchedImage, setPrefetchedImage] = useState(null);
    const [imgType, setImgType] = useState('')
    const [bannerId, setBannerId] = useState('');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false)

    const { uid } = useParams();
    const maxNumber = 69;

    const onChange = (imageList, addUpdateIndex) => {
        setImages(imageList);
        setPrefetchedImage(null); // Clear the prefetched image when a new image is uploaded
    };

    const getBannerImageDetails = async () => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/store/image/${uid}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (!result.status) {
                throw new Error(`Error: ${result.message}`);
            } else {
                setBannerId(result.data.banner_id)
                setBannerImageTitle(result.data.title);
                setBannerImageLink(result.data.link);
                setPrefetchedImage(result.data.path);
                setImgType(result.data.type)
            }
        } catch (error) {
            console.error('Fetching categories failed', error);
        }
    };

    console.log(uid)

    const isValidURL = (string) => {
        const res = string.match(/(https?|ftp):\/\/[^\s/$.?#].[^\s]*/i);
        return (res !== null);
    };

    const updateBannerImage = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        if (images.length === 0 && !prefetchedImage) {
            toast.error('Please select banner images', { position: 'top-center' });
            setIsLoading(false);
            return;
        } else {

            let base64String = ''
            if (images.length > 0) {
                base64String = await readFileAsBase64(images[0].file);
            }


            const bannerData = {
                title: bannerImageTitle,
                link: bannerImageLink,
                image: images.length > 0 ? { file: base64String } : { path: prefetchedImage },
                imgType: imgType
            };

            console.log(bannerData);

            try {
                const response = await fetch(`${config.backEndBaseUrl}api/store/image/update/${uid}`, {
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
                    navigate(-1);
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

    const titleChange = (event) => {
        setBannerImageTitle(event.target.value);
    };

    const LinkChange = (event) => {
        setBannerImageLink(event.target.value);
    };

    useEffect(() => {
        getBannerImageDetails();
    }, []);

    return (
        <>
            <ToastContainer />
            <div className="wg-box">
                <form className="form-new-product form-style-1" onSubmit={updateBannerImage}>
                    <fieldset className="name">
                        <div className="body-title"> Image Title<span className="tf-color-1">*</span></div>
                        <input className="flex-grow" type="text" placeholder="Banner Image Title" value={bannerImageTitle} onChange={titleChange} />
                    </fieldset>
                    <fieldset className="name">
                        <div className="body-title"> Image Link<span className="tf-color-1">*</span></div>
                        <input className="flex-grow" type="text" placeholder="Banner Image Link" value={bannerImageLink} onChange={LinkChange} />
                    </fieldset>
                    <fieldset>
                        <div className="body-title"> Image<span className="tf-color-1">*</span></div>
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
                                        onImageUpdate,
                                    }) => (
                                        <div className="upload__image-wrapper">
                                            <div className='prv_img m-2 '>
                                                {prefetchedImage && images.length === 0 && (
                                                    <div className="image-item">
                                                        <img src={`${config.backEndBaseUrl}${prefetchedImage}`} alt="Prefetched Banner" width="100" />
                                                        <div className="image-item__btn-wrapper">
                                                            <div className='btn_con'>
                                                                <button
                                                                    type='button'
                                                                    className='btn btn-lg btn-secondary p-2 m-1'
                                                                    onClick={onImageUpload}
                                                                >
                                                                    Update Image
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {imageList.map((image, index) => (
                                                    <div key={index} className="image-item">
                                                        <img src={image.data_url} alt="" width="100" />
                                                        <div className="image-item__btn-wrapper">
                                                            <div className='btn_con'>
                                                                <button
                                                                    type='button'
                                                                    className='btn btn-lg btn-secondary p-2 m-1'
                                                                    onClick={() => onImageUpdate(index)}
                                                                >
                                                                    Update
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

export default UpdateStoreImageForm;
