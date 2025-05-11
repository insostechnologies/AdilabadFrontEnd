import React, { useState, useEffect, useRef } from 'react';
import './bannerForm.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useOutsideClickListener from '../../customhook/useOutsideClickListener';
import ImageUploading from "react-images-uploading";
import { config } from '../../../config';
import { readFileAsBase64 } from '../../../utils/fileHandle'
import { useNavigate } from 'react-router-dom';
function BannerForm() {
    const [selectedType, setSelectedType] = useState('Select Banner Types');
    const [selectedBannerPos, setSelectedBannerPos] = useState('Select Banner Position');
    const [selectedBannerTextPos, setSelectedBannerTextPos] = useState('Select Banner Text Position');
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenForBannerPos, setIsOpenForBannerPos] = useState(false);
    const [isOpenForBannerTextPos, setIsOpenForBannerTextPos] = useState(false);
    const [typeList, setTypesList] = useState([]);
    const [bannerPosList, setBannerPosList] = useState([]);
    const [bannerTextPosList, setBannertextPosList] = useState([]);
    const [isActive, setIsActive] = useState(0);
    const [bannerName, setBannerTitle] = useState('');
    const [images, setImages] = useState([]);
    const [imageDetails, setImageDetails] = useState([]);
    const navigate = useNavigate();
    const maxNumber = 69;
    const TypeMenuRef = useRef(null);
    const positionMenuRef = useRef(null);
    const textPositionMenuRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false)

    const onChange = (imageList, addUpdateIndex) => {
        setImages(imageList);
        setImageDetails(imageList.map(() => ({ title: '', linkText: '', youtubeLink: '' })));
    };

    const resetForm = () => {
        setSelectedType('Select Banner Types');
        setSelectedBannerPos('Select Banner Position');
        setIsActive(0);
        setBannerTitle('');
        setImages([]);
        setImageDetails([]);
    };

    const handleDetailChange = (index, field, value) => {
        const newImageDetails = [...imageDetails];
        newImageDetails[index][field] = value;
        setImageDetails(newImageDetails);
    };

    const isValidURL = (string) => {
        const res = string.match(/(https?|ftp):\/\/[^\s/$.?#].[^\s]*/i);
        return (res !== null);
    };

    const isValidYouTubeURL = (string) => {
        const youtubePattern = /^(https?:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/;
        return youtubePattern.test(string);
    };

    const addBanner = async (event) => {
        event.preventDefault();
        // setIsLoading(true);

        if (bannerName === '') {
            toast.error('Please add a banner title', { position: 'top-center' });
            setIsLoading(false);
            return;
        } else if (selectedType === 'Select Banner Types') {
            toast.error('Please select a banner type', { position: 'top-center' });
            setIsLoading(false);
            return;
        } else if (selectedBannerPos === 'Select Banner Position') {
            toast.error('Please select a banner position', { position: 'top-center' });
            setIsLoading(false);
            return;
        } else if (images.length === 0) {
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

            // toast.info('hmm', { position: 'top-center' });
            // return;
            const imgArr = await Promise.all(images.map(async (img) => {
                const base64String = await readFileAsBase64(img.file);
                return base64String;
            }));

            const bannerData = {
                title: bannerName,
                type: selectedType,
                position: selectedBannerPos,
                textPosition: selectedBannerTextPos == 'Select Banner Text Position' ? '' : selectedBannerTextPos,
                isActive: isActive ? 1 : 0,
                images: imgArr.map((img, index) => ({
                    base64: img,
                    title: imageDetails[index].title,
                    linkText: imageDetails[index].linkText,
                    youtubeLink: imageDetails[index].youtubeLink,
                }))
            };

            try {
                const response = await fetch(`${config.backEndBaseUrl}api/banner/add`, {
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
                    navigate('/admin/banner/list?tab=0');
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

    const onBannerNameChange = (event) => {
        setBannerTitle(event.target.value);
    };

    const handleIsActiveCheckboxChange = () => {
        setIsActive(!isActive);
    };

    useEffect(() => {
        setTypesList(["main banner","cover", "card","card (small)", "carousel", "slider"]);
        setBannerPosList(["home","vendor"]);
        setBannertextPosList(['inside', 'bottom']);
    }, []);

    useEffect(() => {
        setSelectedBannerPos('home')
    }, [])

    const handleSelectChange = (typeName) => {
        setSelectedType(typeName);
        setIsOpen(false);
    };
    const handleSelectBannerPosChange = (bannerTypes) => {
        setSelectedBannerPos(bannerTypes);
        setIsOpenForBannerPos(false);
    };
    const handleSelectBannerTextPosChange = (bannerTextPos) => {
        setSelectedBannerTextPos(bannerTextPos);
        setIsOpenForBannerTextPos(false);
    };

    useOutsideClickListener(TypeMenuRef, () => {
        setIsOpen(false);
    });

    useOutsideClickListener(positionMenuRef, () => {
        setIsOpenForBannerPos(false);
    });

    useOutsideClickListener(textPositionMenuRef, () => {
        setIsOpenForBannerTextPos(false);
    });

    return (
        <>
            <ToastContainer />
            <div className="wg-box">
                <form className="form-new-product form-style-1" onSubmit={addBanner}>
                    <fieldset className="name">
                        <div className="body-title">Banner Title<span className="tf-color-1">*</span></div>
                        <input className="flex-grow" type="text" placeholder="Banner Title" value={bannerName} onChange={onBannerNameChange} />
                    </fieldset>
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
                    <fieldset className="custom-category">
                        <div className="body-title">Banner Type<span className="tf-color-1">*</span></div>
                        <div className="custom-select-container" ref={TypeMenuRef}>
                            <div className="custom-selected-item" onClick={() => setIsOpen(!isOpen)}>
                                <span>{selectedType}</span>
                            </div>
                            {isOpen && (
                                <div className="custom-dropdown-menu">
                                    <ul className="custom-dropdown-list">
                                        {typeList.map((typeName) => (
                                            <li key={typeName} onClick={() => handleSelectChange(typeName)} className="custom-dropdown-item">
                                                <span>{typeName}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </fieldset>
                    <fieldset className="custom-category">
                        <div className="body-title">Banner Position<span className="tf-color-1">*</span></div>
                        <div className="custom-select-container" ref={positionMenuRef}>
                            <div className="custom-selected-item" onClick={() => setIsOpenForBannerPos(!isOpenForBannerPos)}>
                                <span>{selectedBannerPos}</span>
                            </div>
                            {isOpenForBannerPos && (
                                <div className="custom-dropdown-menu">
                                    <ul className="custom-dropdown-list">
                                        {bannerPosList.map((posType) => (
                                            <li key={posType} onClick={() => handleSelectBannerPosChange(posType)} className="custom-dropdown-item">
                                                <span>{posType}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </fieldset>
                    <fieldset className="custom-category">
                        <div className="body-title">Banner Text Position</div>
                        <div className="custom-select-container" ref={textPositionMenuRef}>
                            <div className="custom-selected-item" onClick={() => setIsOpenForBannerTextPos(!isOpenForBannerTextPos)}>
                                <span>{selectedBannerTextPos}</span>
                            </div>
                            {isOpenForBannerTextPos && (
                                <div className="custom-dropdown-menu">
                                    <ul className="custom-dropdown-list">
                                        {bannerTextPosList.map((posTextType) => (
                                            <li key={posTextType} onClick={() => handleSelectBannerTextPosChange(posTextType)} className="custom-dropdown-item">
                                                <span>{posTextType}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </fieldset>
                    <fieldset>
                        <div className="body-title">Banner Disable/Enable</div>
                        <label className="switch">
                            <input type="checkbox" checked={isActive} onChange={handleIsActiveCheckboxChange} />
                            <span className="slider round"></span>
                        </label>
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
