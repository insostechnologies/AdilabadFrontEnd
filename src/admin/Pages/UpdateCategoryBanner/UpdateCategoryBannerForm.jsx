import React, { useState, useEffect, useRef } from 'react';
import './UpdateCategoryBanner.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useOutsideClickListener from '../../customhook/useOutsideClickListener';
import { config } from '../../../config';
import { readFileAsBase64 } from '../../../utils/fileHandle'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


function UpdateCategoryBannerForm() {
    const StoreMenuRef = useRef(null);
    const [isOpenCategoryList, setIsOpenCategoryList] = useState(false);
    const [searchCategory, setSearchCategory] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('')
    const [CategoriesList, setCategoriesList] = useState([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false)
    const [link, setLink] = useState('');
    const [youtubeLink, setYoutubeLink] = useState('');
    const { uid } = useParams();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const fetchBannerData = async (uid) => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/banner/category/image/${uid}`, {
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
                let banner = result.data
                setTitle(banner.title)
                setLink(banner.url)
                setSelectedCategory(banner.category_id)
                setYoutubeLink(banner.youtube_link)
                setPreview(banner.banner_path ? `${config.backEndBaseUrl}${banner.banner_path}` : null)
                // console.log(banner)
            } else {
                console.log(result)
            }
        } catch (error) {
            console.error('Error adding data:', error);
        }
    }


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
    const isValidURL = (string) => {
        const res = string.match(/(https?|ftp):\/\/[^\s/$.?#].[^\s]*/i);
        return (res !== null);
    };

    const handlefilteredCategoryList = (storeId, storeName) => {
        setIsOpenCategoryList(false);
        setCategoryName(storeName)
        setSelectedCategory(storeId)
    };

    const filteredCategoriesList = CategoriesList.length > 0 ? CategoriesList.filter(item =>
        item.name.toLowerCase().includes(searchCategory.toLowerCase())
    ) : []


    const updateBanner = async (e) => {
        e.preventDefault();
        setLoading(true)

        if (selectedCategory == '') {
            toast.error('please Select a Category', {
                position: 'top-center',
            });
            setLoading(false)
            return
        } else {
            const bannerData = {
                title: title,
                link: link,
                category: selectedCategory,
                youtubeLink: youtubeLink
            };
            if (file) {
                const fileData = await readFileAsBase64(file);
                bannerData.file = fileData
            }
            try {
                const response = await fetch(`${config.backEndBaseUrl}api/banner/category/image/update/${uid}`, {
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
                    resetForm();
                    navigate(`/admin/category/banner/image/${selectedCategory}`);
                } else {
                    toast.error('Error uploading galary', { position: 'top-center' });
                }
            } catch (error) {
                console.error('Error uploading banner:', error);
                toast.error('Internal server error', { position: 'top-center' });
            } finally{
                setLoading(false)
            }
        }
    }
    const resetForm = () => {
        setCategoryName('')
        setTitle('')
        setLink('')
        setFile(null)
        setPreview(null)
    };
    useEffect(() => {
        fetchCategories(1)
        fetchBannerData(uid);
    }, [])
    useEffect(() => {
        if (CategoriesList.length > 0) {
            const selectedItem = CategoriesList.find((item) => item.uid === selectedCategory);
            if (selectedItem) {
                setCategoryName(selectedItem.name);
            }
            setSelectedCategory(selectedCategory);
        }
    }, [CategoriesList, selectedCategory]);

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

    return (
        <>
            <div className="wg-box wg-box-container">
                <ToastContainer />
                <form className="form-new-product form-style-1" onSubmit={updateBanner}>
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

                    <fieldset className="name">
                        <div className="body-title">Title </div>
                        <input className="flex-grow" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </fieldset>
                    <fieldset className="name">
                        <div className="body-title">Link </div>
                        <input className="flex-grow" type="text" placeholder="Link" value={link} onChange={(e) => setLink(e.target.value)} />
                    </fieldset>
                    <fieldset className="name">
                        <div className="body-title">Youtube Link </div>
                        <input className="flex-grow" type="text" placeholder="Youtube Link" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} />
                    </fieldset>

                    <fieldset>
                        <div className="body-title">Upload Image <span className="tf-color-1">*</span></div>
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

                    <div className="bot">
                        <button className="tf-button w208 mx-auto" type="submit" disabled={loading}>{loading ? 'Saveing....' : 'Save'}</button>
                    </div>
                </form>

            </div>
        </>
    )
}

export default UpdateCategoryBannerForm