import React, { useState, useRef, useEffect } from 'react';
import './CategoryForm.css';
import { config } from '../../../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { readFileAsBase64 } from '../../../utils/fileHandle'
import useOutsideClickListener from '../../customhook/useOutsideClickListener';
import { useNavigate } from 'react-router-dom';

function CategoryForm() {

    const [isActive, setIsActive] = useState(0);
    const [isNewTag, setIsNewTag] = useState(0);
    const [isStoreOnly, setIsStoreOnly] = useState(0);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const fileInputRef = useRef(null);
    const [newTagText, setNewTagText] = useState('');

    const [selectedListType, setSelectedListType] = useState('Select Category List Type');
    const [selectedListTypeList, setSelectedListTypeList] = useState([]);
    const [isOpenListType, setIsOpenListType] = useState(false);
    const listTypeMenuRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate();

    useOutsideClickListener(listTypeMenuRef, () => {
        setIsOpenListType(false);
    })

    const addCategory = async (event) => {
        event.preventDefault(); // Prevent default form submission
        setIsLoading(true);

        try {
            let fileData = ''
            if (file) {
                // Convert file to Base64 string and wait for the result
                const str = await readFileAsBase64(file);
                fileData = str
            }

            let jsonData = {
                file: fileData,
                name: categoryName,
                new_tag_text: newTagText,
                list_type: selectedListType,
                meta_title: metaTitle,
                meta_description: metaDescription,
                new_tag: isNewTag,
                status: isActive,
                isStoreOnly: isStoreOnly
            }


            if (fileData == '') {
                toast.error('please Upload a Category Icon', {
                    position: 'top-center',
                });
                setIsLoading(false);
                return;
            } else if (categoryName == '') {
                toast.error('please add Category Name', {
                    position: 'top-center',
                });
                setIsLoading(false);
                return;
            }else if (selectedListType == 'Select Category List Type'){
                toast.error('please add Category List Type', {
                    position: 'top-center',
                });
            }else {
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
                    navigate('/admin/category/list');
                }
            }

        } catch (error) {
            console.error('Error adding data:', error);
        }finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setSelectedListTypeList(['List_type', 'Bg_image_type'])
    }, [])


    const resetForm = () => {
        // setSelectedIcon('FaList');
        // setIsOpen(false);
        // setSearchTerm('');
        setIsActive(1);
        setIsNewTag(1);
        setFile(null);
        setPreview(null);
        setCategoryName('');
        setMetaTitle('');
        setMetaDescription('');
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset file input
        }
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

    const handleIsActiveCheckboxChange = () => {
        setIsActive(isActive == 1 ? 0 : 1);
    };

    const handleIsNewTagCheckboxChange = () => {
        setIsNewTag(isNewTag == 1 ? 0 : 1);
    };

    const handleIsStoreOnlyChange = () => {
        setIsStoreOnly(isStoreOnly == 1 ? 0 : 1);
    }

    const handleIsNewTagTextChange = (event) => {
        setNewTagText(event.target.value);
    }

   
    const handleListTypeChange = (type) => {
        setSelectedListType(type);
        setIsOpenListType(false);
    };
    return (
        <>
            <ToastContainer />
            <div className="wg-box">
                <form className="form-new-product form-style-1" onSubmit={addCategory}>
                    <fieldset className="name">
                        <div className="body-title">Category name: <span className="tf-color-1">*</span></div>
                        <input className="flex-grow" type="text" placeholder="Category name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
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
                        <div className="body-title">Upload icon: <span className="tf-color-1">*</span></div>
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


                    <fieldset className="name">
                        <div className="body-title">Catrgory List Type: <span className="tf-color-1">*</span></div>
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
                        <div className="body-title">Store Only:</div>
                        <label className="switch">
                            <input type="checkbox" checked={isStoreOnly} onChange={handleIsStoreOnlyChange} />
                            <span className="slider round"></span>
                        </label>
                    </fieldset>

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
