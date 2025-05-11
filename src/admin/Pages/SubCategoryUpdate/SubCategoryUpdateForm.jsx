import React, { useState, useEffect, useRef } from 'react';
import * as Icons from 'react-icons/fa';
import './SubCategoryUpdate.css';
import { config } from '../../../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useOutsideClickListener from '../../customhook/useOutsideClickListener';
import { useParams,useNavigate } from 'react-router-dom';


function SubCategoryUpdateForm() {
    const { uid } = useParams();
    const [searchCategories, setSearchCategories] = useState('');
    const [selectedCategories, setSelectedCategories] = useState('Categories');
    const [selectedCategoriesUid, setSelectedCategoriesUid] = useState('');
    const [categoriesList, setCategoriesList] = useState([]);
    const [isOpenCategoriesList, setIsOpenCategoriesList] = useState(false);
    const [isActive, setIsActive] = useState(1);
    const [isNewTag, setIsNewTag] = useState(1);
    const [file, setFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDesc, setMetaDesc] = useState('');
    const [newTagText, setNewTagText] = useState('');
    const fileInputRef = useRef(null);
    const coverImageInputRef = useRef(null);
    const CategoryMenuRef = useRef(null);
    const navigate = useNavigate();


    const fetchCategoryData = async (uid) => {
        try{
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
                setIsActive(category.status)
                setIsNewTag(category.new_tag)
                setPreview(category.icon_img_path ? `${config.backEndBaseUrl}${category.icon_img_path}`: null)
                setCoverImagePreview(category.cover_img_path? `${config.backEndBaseUrl}${category.cover_img_path}`: null)
                setCategoryName(category.name)
                setSelectedCategories(category.parent_name)
                setSelectedCategoriesUid(category.parent_id)
                setMetaTitle(category.meta_title)
                setMetaDesc(category.meta_description)
                setNewTagText(category.new_tag_text)
                console.log(result)
            } else {
                console.log(result)
            }
        }catch (error) {
            console.error('Error adding data:', error);
        }
    }
    useEffect(() => {
        // Extract icon names from the imported icons
        fetchCategories(); // Invoke the async function inside useEffect
        fetchCategoryData(uid);
    }, []);


    const updateCategory = async (event) => {
        event.preventDefault(); // Prevent default form submission

        let jsonData;

        try {
            if(selectedCategoriesUid == ''){
                toast.error('please select a category', {
                    position: 'top-center',
                });
            }else{
                // Create JSON object with files as base64 strings
                jsonData = {
                    parent_id:selectedCategoriesUid,
                    name: categoryName,
                    new_tag: isNewTag,
                    status: isActive,
                    new_tag_text: newTagText,
                    meta_title: metaTitle,
                    meta_description: metaDesc,
                };
                if (file) {
                    // Convert file to Base64 string and wait for the result
                    let fileData = await readFileAsBase64(file);
                    jsonData.file = fileData

                }
                if (coverFile) {
                    // Convert cover file to Base64 string and wait for the result
                    let coverFileData = await readFileAsBase64(coverFile);
                    jsonData.coverFile = coverFileData

                }
    
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
                    navigate(`/admin/sub-category/list/${selectedCategoriesUid}`);
                }
            }

        } catch (error) {
            console.error('Error adding data:', error);
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
            let fileReader = new FileReader();
            fileReader.onloadend = () => {
                setPreview(fileReader.result);
            };
            fileReader.readAsDataURL(selectedFile);
        } else {
            setPreview(null);
        }
    };

    const handleCoverImageChange = (e) => {
        const selectedFile = e.target.files[0];
        setCoverFile(selectedFile);

        if (selectedFile) {
            let fileReader = new FileReader();
            fileReader.onloadend = () => {
                setCoverImagePreview(fileReader.result);
            };
            fileReader.readAsDataURL(selectedFile);
        } else {
            setCoverImagePreview(null);
        }
    };

    const handleIsActiveCheckboxChange = () => {
        setIsActive(!isActive);
    };

    const handleIsNewTagCheckboxChange = () => {
        setIsNewTag(!isNewTag);
    };
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/category/parents`, {
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

        } catch (error) {
            console.error('Error fetching categories:', error);
            // Handle error state or display error message
        }
    };

    

    const handleSearchCategories = (event) => {
        setSearchCategories(event.target.value);
    };

    const filteredCategoriesList = categoriesList.filter(item =>
        item.name.toLowerCase().includes(searchCategories.toLowerCase())
    );

    const handlefilteredCategoriesList = (itemName,itemUid) => {
        setSelectedCategories(itemName);
        setSelectedCategoriesUid(itemUid)
        setIsOpenCategoriesList(false);
    };

 



    
    useOutsideClickListener(CategoryMenuRef, () => {
        setIsOpenCategoriesList(false);
    })

    

    return (
        <>
            <ToastContainer />
            <div className="wg-box">
                <form className="form-new-product form-style-1" onSubmit={updateCategory}>
                    <fieldset className="name">
                        <div className="body-title">Sub Category name <span className="tf-color-1">*</span></div>
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
                    <fieldset className="name">
                        <div className="body-title">Choose Category<span className="tf-color-1">*</span></div>
                        <div className="custom-select-container" ref={CategoryMenuRef}>
                            <div className="custom-selected-item" onClick={() => setIsOpenCategoriesList(!isOpenCategoriesList)}>
                                <span>{selectedCategories}</span>
                            </div>
                            {isOpenCategoriesList && (
                                <div className="custom-dropdown-menu">
                                    <div className="custom-search-input-wrapper">
                                        <input type="text" placeholder='search...' value={searchCategories} onChange={handleSearchCategories} className="custom-search-input" />
                                    </div>
                                    <ul className="custom-dropdown-list">
                                        {filteredCategoriesList.map((item) => (
                                            <li key={item.uid} onClick={() => handlefilteredCategoriesList(item.name,item.uid)} className="custom-dropdown-item">
                                                <span>{item.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </fieldset>
                    <fieldset>
                        <div className="body-title">Upload Bg image <span className="tf-color-1">*</span></div>
                        <div className="upload-image flex-grow">
                            <div className="item up-load">
                                <label className="uploadfile" htmlFor="coverFile">
                                    <span className="icon">
                                        <i className="icon-upload-cloud"></i>
                                    </span>
                                    <span className="body-text">Drop your images here or select <span className="tf-color">click to browse</span></span>
                                    <input type="file" id="coverFile" onChange={handleCoverImageChange} ref={coverImageInputRef} />
                                    {coverImagePreview && (
                                        <div className="image-preview">
                                            <img src={coverImagePreview} alt="Cover_Image_Preview" className='prvImg' />
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <div className="body-title">Upload icon <span className="tf-color-1">*</span></div>
                        <div className="upload-image flex-grow">
                            <div className="item up-load">
                                <label className="uploadfile" htmlFor="iconFile">
                                    <span className="icon">
                                        <i className="icon-upload-cloud"></i>
                                    </span>
                                    <span className="body-text">Drop your images here or select <span className="tf-color">click to browse</span></span>
                                    <input type="file" id="iconFile" onChange={handleFileChange} ref={fileInputRef} />
                                    {preview && (
                                        <div className="image-preview">
                                            <img src={preview} alt="Icon_Image_Preview" className='prvImg' />
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>
                    </fieldset>
                    {/* <fieldset className="custom-category">
                        <div className="body-title">Select category icon</div>
                        <div className="custom-select-container" ref={IconMenuRef}>
                            <div className="custom-selected-item" onClick={() => setIsOpen(!isOpen)}>
                                <DynamicIcon name={selectedIcon} />
                                <span>{selectedIcon}</span>
                            </div>
                            {isOpen && (
                                <div className="custom-dropdown-menu">
                                    <div className="custom-search-input-wrapper">
                                        <input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearchChange} className="custom-search-input" />
                                    </div>
                                    <ul className="custom-dropdown-list">
                                        {filteredIconsList.map((iconName) => (
                                            <li key={iconName} onClick={() => handleSelectChange(iconName)} className="custom-dropdown-item">
                                                <DynamicIcon name={iconName} className="custom-dropdown-item-icon" />
                                                <span>{iconName}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </fieldset> */}
                    <fieldset>
                        <div className="body-title">Category Disable/Enable<span className="tf-color-1">*</span></div>
                        <label className="switch">
                            <input type="checkbox" checked={isActive} onChange={handleIsActiveCheckboxChange} />
                            <span className="slider round"></span>
                        </label>
                    </fieldset>
                    <fieldset>
                        <div className="body-title">Category New Tag<span className="tf-color-1">*</span></div>
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
                        <button type="submit" className="tf-button w208 h10">Save</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default SubCategoryUpdateForm;
