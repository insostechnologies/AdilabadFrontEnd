import React, { useState, useEffect, useRef } from 'react';
// import * as Icons from 'react-icons/fa';
// import { DynamicIcon } from "../../components/DynamicIcon/DynamicIcon";
import './CategoryForm.css';
import { config } from '../../../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useOutsideClickListener from '../../customhook/useOutsideClickListener';
import { readFileAsBase64 } from '../../../utils/fileHandle'
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function CategoryForm() {
    const [searchCategories, setSearchCategories] = useState('');
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [selectedCategories, setSelectedCategories] = useState('Select category');
    const [selectedCategoriesUid, setSelectedCategoriesUid] = useState('');
    const [categoriesList, setCategoriesList] = useState([]);
    const [isOpenCategoriesList, setIsOpenCategoriesList] = useState(false);
    const [isActive, setIsActive] = useState(0);
    const [isNewTag, setIsNewTag] = useState(0);
    const [file, setFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [newTagText, setNewTagText] = useState('');
    const fileInputRef = useRef(null);
    const coverImageInputRef = useRef(null);
    const CategoryMenuRef = useRef(null);
    const { uid } = useParams();
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate();




    const addCategory = async (event) => {
        event.preventDefault(); // Prevent default form submission
        setIsLoading(true);
        let jsonData;
        console.log(selectedCategoriesUid)
        try {
            let fileData = '';
            if (file) {
                // Convert file to Base64 string and wait for the result
                fileData = await readFileAsBase64(file);
            }

            let coverFileData = '';
            if (coverFile) {
                // Convert cover file to Base64 string and wait for the result
                coverFileData = await readFileAsBase64(coverFile);
            }

            if (selectedCategoriesUid == '') {
                toast.error('please select a category', {
                    position: 'top-center',
                });
                setIsLoading(false);
                return;
            } else if (categoryName == '') {
                toast.error('please add category name', {
                    position: 'top-center',
                });
                setIsLoading(false);
                return;
            } else if (fileData == '') {
                toast.error('please Upload a Category Icon', {
                    position: 'top-center',
                });
                setIsLoading(false);
                return;
            } else {

                // Create JSON object with files as base64 strings
                jsonData = {
                    file: fileData,
                    coverFile: coverFileData,
                    parent_id: selectedCategoriesUid,
                    new_tag_text: newTagText,
                    name: categoryName,
                    meta_title: metaTitle,
                    meta_description: metaDescription,
                    new_tag: isNewTag,
                    status: isActive,
                    isStoreOnly: 0,
                };


                // Send the request
                const response = await fetch(`${config.backEndBaseUrl}api/category/add`, {
                    method: 'POST',
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
                    resetForm();
                    navigate(`/admin/sub-category/list/${uid}`);

                }
            }

        } catch (error) {
            console.error('Error adding data:', error);
        } finally {
            setIsLoading(false);
        }
    };


    const resetForm = () => {
        setSelectedCategories('Categories');
        setMetaTitle('');
        setMetaDescription('');
        setSelectedCategoriesUid('');
        // setSelectedIcon('FaList');
        // setIsOpen(false);
        // setSearchTerm('');
        setIsActive(1);
        setIsNewTag(1);
        setFile(null);
        setPreview(null);
        setCoverFile(null);
        setCoverImagePreview(null);
        setCategoryName('');
        setNewTagText('')
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset file input
        }
        if (coverImageInputRef.current) {
            coverImageInputRef.current.value = ''; // Reset cover image input
        }
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
        setIsActive(isActive == 1 ? 0 : 1);
    };

    const handleIsNewTagCheckboxChange = () => {
        setIsNewTag(isNewTag == 1 ? 0 : 1);
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

    useEffect(() => {
        fetchCategories();
        setSelectedCategoriesUid(uid)
    }, []); // Fetch categories once on component mount

    useEffect(() => {
        if (categoriesList.length > 0) {
            const selectedItem = categoriesList.find((item) => item.uid === uid);
            if (selectedItem) {
                setSelectedCategories(selectedItem.name);
            }
        }
    }, [categoriesList, uid]);

    const handleSearchCategories = (event) => {
        setSearchCategories(event.target.value);
    };

    const filteredCategoriesList = categoriesList.filter(item =>
        item.name.toLowerCase().includes(searchCategories.toLowerCase())
    );

    const handlefilteredCategoriesList = (itemName, itemUid) => {
        setSelectedCategories(itemName);
        setSelectedCategoriesUid(itemUid)
        setIsOpenCategoriesList(false);
    };

    // const handleSelectChange = (iconName) => {
    //     setSelectedIcon(iconName);
    //     setIsOpen(false);
    // };

    // const handleSearchChange = (event) => {
    //     setSearchTerm(event.target.value);
    // };

    // const filteredIconsList = iconsList.filter(iconName =>
    //     iconName.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    // Dropdown menu close on outside click
    // useOutsideClickListener(IconMenuRef, () => {
    //     setIsOpen(false);
    // })
    useOutsideClickListener(CategoryMenuRef, () => {
        setIsOpenCategoriesList(false);
    })

    const handleIsNewTagTextChange = (event) => {
        setNewTagText(event.target.value);
    }



    return (
        <>
            <ToastContainer />
            <div className="wg-box">
                <form className="form-new-product form-style-1" onSubmit={addCategory}>
                    <fieldset className="name">
                        <div className="body-title">Sub Category name: <span className="tf-color-1">*</span></div>
                        <input className="flex-grow" type="text" placeholder="Sub Category name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                    </fieldset>

                    <fieldset className="name">
                        <div className="body-title">Choose Category: <span className="tf-color-1">*</span></div>
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
                                            <li key={item.uid} onClick={() => handlefilteredCategoriesList(item.name, item.uid)} className="custom-dropdown-item">
                                                <span>{item.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </fieldset>

                    <fieldset className="name">
                        <div className="body-title">Meta Title:</div>
                        <input className="flex-grow" type="text" placeholder="Meta title" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
                    </fieldset>

                    <fieldset className="name">
                        <div className="body-title">Meta Description:</div>
                        <input className="flex-grow" type="text" placeholder="Meta descriptions" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
                    </fieldset>

                    <fieldset>
                        <div className="body-title">Upload bg image: </div>
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
                        <div className="body-title">Upload icon: <span className="tf-color-1">*</span></div>
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
                        <div className="body-title">Category Disable/Enable:</div>
                        <label className="switch">
                            <input type="checkbox" checked={isActive} onChange={handleIsActiveCheckboxChange} />
                            <span className="slider round"></span>
                        </label>
                    </fieldset>

                    <fieldset>
                        <div className="body-title">Category New Tag:</div>
                        <label className="switch">
                            <input type="checkbox" checked={isNewTag} onChange={handleIsNewTagCheckboxChange} />
                            <span className="slider round"></span>
                        </label>
                    </fieldset>

                    <fieldset>
                        <div className="body-title">Category New Tag Text:</div>
                        <input className="flex-grow" type="text" placeholder="Category New Tag Text" value={newTagText} onChange={handleIsNewTagTextChange} />
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

export default CategoryForm;
