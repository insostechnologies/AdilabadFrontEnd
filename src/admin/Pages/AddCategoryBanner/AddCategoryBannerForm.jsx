import React, { useState, useEffect, useRef } from 'react';
import './AddCategoryBanner.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useOutsideClickListener from '../../customhook/useOutsideClickListener';
import ImageUploading from "react-images-uploading";
import { config } from '../../../config';
import { readFileAsBase64 } from '../../../utils/fileHandle'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
function AddCategoryBannerForm() {
    const StoreMenuRef = useRef(null);
    const [isOpenCategoryList, setIsOpenCategoryList] = useState(false);
    const [searchCategory, setSearchCategory] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [images, setImages] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('')
    const [CategoriesList, setCategoriesList] = useState([]);
    const [imageDetails, setImageDetails] = useState([]);
    const maxNumber = 69;
    const { uid } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false)

    const fetchCategories = async (status) => {
        let params = '';
        if (status !== 'all') {
            params = `?status=${status}`;
        }
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/category/parents${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setCategoriesList(result.data); // Assuming response.data is the correct structure
            //console.log(result.data)

        } catch (error) {
            console.error('Error fetching categories:', error);
            // Handle error state or display error message
        }
    };

    useOutsideClickListener(StoreMenuRef, () => {
        setIsOpenCategoryList(false);
    })

    const onChange = (imageList, addUpdateIndex) => {
        setImages(imageList);
        setImageDetails(imageList.map(() => ({ title: '', linkText: '', youtubeLink: '' })));
    };
    const handlefilteredCategoryList = (storeId, storeName) => {
        setIsOpenCategoryList(false);
        setCategoryName(storeName)
        setSelectedCategory(storeId)
    };
    const isValidURL = (string) => {
        const res = string.match(/(https?|ftp):\/\/[^\s/$.?#].[^\s]*/i);
        return (res !== null);
    };

    const filteredCategoriesList = CategoriesList.length > 0 ? CategoriesList.filter(item =>
        item.name.toLowerCase().includes(searchCategory.toLowerCase())
    ) : []
    const isValidYouTubeURL = (string) => {
        const youtubePattern = /^(https?:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/;
        return youtubePattern.test(string);
    };

    const addGallery = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (images.length === 0) {
            toast.error('Please select Banner images', { position: 'top-center' });
            setIsLoading(false);
            return;
        } else if (selectedCategory == '') {
            toast.error('please Select a Category', {
                position: 'top-center',
            });
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
                    youtubeLink: imageDetails[index].youtubeLink
                }))
            };

            try {
                const response = await fetch(`${config.backEndBaseUrl}api/banner/category/add/${selectedCategory}`, {
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
                    navigate(`/admin/category/banner/image/${selectedCategory}`);
                } else {
                    toast.error('Error uploading galary', { position: 'top-center' });
                }
            } catch (error) {
                console.error('Error uploading banner:', error);
                toast.error('Internal server error', { position: 'top-center' });
            } finally {
                setIsLoading(false);
            }
        }
    }
    const resetForm = () => {
        setImages([]);
        setCategoryName('')
    };
    useEffect(() => {
        fetchCategories(1)
    }, [])
    useEffect(() => {
        if (CategoriesList.length > 0) {
            const selectedItem = CategoriesList.find((item) => item.uid === uid);
            if (selectedItem) {
                setCategoryName(selectedItem.name);
            }
            setSelectedCategory(uid);
        }
    }, [CategoriesList, uid]);
    const handleDetailChange = (index, field, value) => {
        const newImageDetails = [...imageDetails];
        newImageDetails[index][field] = value;
        setImageDetails(newImageDetails);
    };
    return (
        <>
            <div className="wg-box wg-box-container">
                <ToastContainer />
                <form className="form-new-product form-style-1" onSubmit={addGallery}>
                    <fieldset className="name">
                        <div className="body-title">Choose Category: <span className="tf-color-1">*</span></div>
                        <div className="custom-select-container" ref={StoreMenuRef}>
                            <div className="custom-selected-item" onClick={() => setIsOpenCategoryList(!isOpenCategoryList)}>
                                <span>{categoryName == '' ? 'select Category' : categoryName}</span>
                            </div>
                            {isOpenCategoryList && (
                                <div className="custom-dropdown-menu">
                                    <div className="custom-search-input-wrapper">
                                        <input type="text" placeholder='search...' value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)} className="custom-search-input" />
                                    </div>
                                    <ul className="custom-dropdown-list">
                                        {filteredCategoriesList.map((item) => (
                                            <li key={item.uid} onClick={() => handlefilteredCategoryList(item.uid, item.name)} className="custom-dropdown-item">
                                                <span>{item.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
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

                    <div className="bot">
                        <button className="tf-button w208 mx-auto" type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</button>
                    </div>
                </form>

            </div>
        </>
    )
}

export default AddCategoryBannerForm