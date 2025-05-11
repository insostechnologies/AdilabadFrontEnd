import React, { useState, useEffect, useRef } from 'react';
import './CategoryUpdate.css';
import { config } from '../../../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate } from 'react-router-dom';
import useOutsideClickListener from '../../customhook/useOutsideClickListener';

function CategoryUpdateForm() {
    const { uid } = useParams();
    // const [selectedIcon, setSelectedIcon] = useState('FaList');
    // const [isOpen, setIsOpen] = useState(false);
    // const [searchTerm, setSearchTerm] = useState('');
    // const [iconsList, setIconsList] = useState([]);
    const [isActive, setIsActive] = useState(1);
    const [isNewTag, setIsNewTag] = useState(1);
    const [file, setFile] = useState(null);
    // const [bannerfile, setBannerFile] = useState(null);
    const [preview, setPreview] = useState(null);
    // const [bannerPreview, setBannerPreview] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDesc, setMetaDesc] = useState('');
    const [newTagText, setNewTagText] = useState('');
    const fileInputRef = useRef(null);
    // const fileBannerInputRef = useRef(null);
    const listTypeMenuRef = useRef(null);
    const [selectedListType, setSelectedListType] = useState('Select Category List Type');
    const [selectedListTypeList, setSelectedListTypeList] = useState([]);
    const [isOpenListType, setIsOpenListType] = useState(false);
    // const IconMenuRef = useRef(null);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false)

    useOutsideClickListener(listTypeMenuRef, () => {
        setIsOpenListType(false);
    })

    const fetchCategoryData = async (uid) => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/category/${uid}`, {
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
                let category = result.data
                // setSelectedIcon(category.icon)
                setIsActive(category.status)
                setIsNewTag(category.new_tag)
                setPreview(category.icon_img_path ? `${config.backEndBaseUrl}${category.icon_img_path}` : null)
                setCategoryName(category.name)
                setMetaTitle(category.meta_title)
                setMetaDesc(category.meta_description)
                setNewTagText(category.new_tag_text)
                setSelectedListType(category.list_type)
                // setBannerPreview(category.banner_path ? `${config.backEndBaseUrl}${category.banner_path}` : null)
                console.log(result)
            } else {
                console.log(result)
            }
        } catch (error) {
            console.error('Error adding data:', error);
        }
    }

    useEffect(() => {
        setSelectedListTypeList(['List_type', 'Bg_image_type'])
        fetchCategoryData(uid)
    }, []);

    const handleListTypeChange = (type) => {
        setSelectedListType(type);
        setIsOpenListType(false);
    };

    const updateCategory = async (event) => {
        event.preventDefault(); // Prevent default form submission
        setIsLoading(true);


        try {
            let jsonData = {
                name: categoryName,
                new_tag: isNewTag,
                new_tag_text: newTagText,
                list_type: selectedListType,
                meta_title: metaTitle,
                meta_description: metaDesc,
                status: isActive
            };
            if (file) {
                const fileData = await readFileAsBase64(file);
                jsonData.file = fileData
            }

            // if(bannerfile) {
            //      const bannerFileData = await readFileAsBase64(bannerfile);
            //      jsonData.bannerfile = bannerFileData
            // }
            // Send the request
            const response = await fetch(`${config.backEndBaseUrl}api/category/update/${uid}`, {
                method: 'PUT',
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
                fetchCategoryData(uid);
                navigate('/admin/category/list');
            }

        } catch (error) {
            console.error('Error adding data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper function to read file as Base64
    const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve(reader.result.split(',')[1]); // Extract base64 string
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    };



    const onCategoryNameChange = (event) => {
        setCategoryName(event.target.value);
    };

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

    // const handleBannerFileChange = (e) => {
    //     const selectedFile = e.target.files[0];
    //     setBannerFile(selectedFile);

    //     if (selectedFile) {
    //         const fileReader = new FileReader();
    //         fileReader.onloadend = () => {
    //             setBannerPreview(fileReader.result);
    //         };
    //         fileReader.readAsDataURL(selectedFile);
    //     } else {
    //         setBannerPreview(null);
    //     }
    // }

    const handleIsActiveCheckboxChange = () => {
        setIsActive(isActive == 1 ? 0 : 1);
    };

    const handleIsNewTagCheckboxChange = () => {
        setIsNewTag(isNewTag == 1 ? 0 : 1);
    };





    return (
        <>
            <ToastContainer />
            <div className="wg-box">
                <form className="form-new-product form-style-1" onSubmit={updateCategory}>
                    <fieldset className="name">
                        <div className="body-title">Category name <span className="tf-color-1">*</span></div>
                        <input className="flex-grow" type="text" placeholder="Category name" value={categoryName} onChange={onCategoryNameChange} />
                    </fieldset>
                    <fieldset className="name">
                        <div className="body-title">Meta Title </div>
                        <input className="flex-grow" type="text" placeholder="Meta Title" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
                    </fieldset>
                    <fieldset className="name">
                        <div className="body-title">Meta Description </div>
                        <input className="flex-grow" type="text" placeholder="Meta Description" value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} />
                    </fieldset>

                    <fieldset>
                        <div className="body-title">Upload icon <span className="tf-color-1">*</span></div>
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


                    {/* <fieldset>
                        <div className="body-title">Upload Banner <span className="tf-color-1">*</span></div>
                        <div className="upload-image flex-grow">
                            <div className="item up-load">
                                <label className="uploadfile" htmlFor="myBannerFile">
                                    <span className="icon">
                                        <i className="icon-upload-cloud"></i>
                                    </span>
                                    <span className="body-text">Drop your images here or select <span className="tf-color">click to browse</span>
                                    </span>
                                    <input type="file" id="myBannerFile" onChange={handleBannerFileChange} ref={fileBannerInputRef} />
                                    {bannerPreview && (
                                        <div className="image-preview">
                                            <img src={bannerPreview} alt="Image_Preview" className='prvImg' />
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>
                    </fieldset> */}


                    <fieldset className="name">
                        <div className="body-title">Category List Type: <span className="tf-color-1">*</span></div>
                        <div className="custom-select-container" ref={listTypeMenuRef}>
                            <div className="custom-selected-item" onClick={() => setIsOpenListType(!isOpenListType)}>
                                <span>{selectedListType}</span>
                            </div>
                            {isOpenListType && (
                                <div className="custom-dropdown-menu">
                                    <ul className="custom-dropdown-list">
                                        {selectedListTypeList.map((item, index) => (
                                            <li key={index} onClick={() => handleListTypeChange(item)} className="custom-dropdown-item">
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </fieldset>
                    <fieldset>
                        <div className="body-title">Category Disable/Enable</div>
                        <label className="switch">
                            <input type="checkbox" checked={isActive} onChange={handleIsActiveCheckboxChange} />
                            <span className="slider round"></span>
                        </label>
                    </fieldset>
                    <fieldset>
                        <div className="body-title">Category New Tag</div>
                        <label className="switch">
                            <input type="checkbox" checked={isNewTag} onChange={handleIsNewTagCheckboxChange} />
                            <span className="slider round"></span>
                        </label>
                    </fieldset>
                    <fieldset className="name">
                        <div className="body-title">New Tag Text</div>
                        <input className="flex-grow" type="text" placeholder="New Tag Text" value={newTagText} onChange={(e) => setNewTagText(e.target.value)} />
                    </fieldset>
                    <div className="bot">
                        <div></div>
                        <button type="submit" className="tf-button w208 h10" disabled={isLoading}>{isLoading ? 'Saving...' : 'Update'}</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default CategoryUpdateForm;
