import React, { useEffect, useRef, useState } from 'react';
import useOutsideClickListener from '../../../customhook/useOutsideClickListener';
import { config } from '../../../../config';
import { readFileAsBase64 } from '../../../../utils/fileHandle'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


function LogoOwnerPhotosForm() {
    
    const StoreMenuRef = useRef(null);
    const [isOpenStoreList, setIsOpenStoreList] = useState(false);
    const [searchStore, setSearchStore] = useState('');
    const [storeName, setStoreName] = useState('');
    const [storeList, setStoreList] = useState([]);
    const [selectedStore, setSelectedStore] = useState('')
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const navigate = useNavigate();

    const handlefilteredStoreList = (storeId, storeName) => {
        setIsOpenStoreList(false);
        setStoreName(storeName)
        setSelectedStore(storeId)
    };

    const filteredStoreList = storeList.length > 0 ? storeList.filter(item =>
        item.name.toLowerCase().includes(searchStore.toLowerCase())
    ) : []


    useOutsideClickListener(StoreMenuRef, () => {
        setIsOpenStoreList(false);
    })

    const fetchStore = async () => {

        try {
            const response = await fetch(`${config.backEndBaseUrl}api/store`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setStoreList(result.data); // Assuming response.data is the correct structure
            //console.log(result.data)

        } catch (error) {
            console.error('Error fetching categories:', error);
            // Handle error state or display error message
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

    const addLogo = async (event) => {
        event.preventDefault(); // Prevent default form submission


        try {
            let fileData = ''
            if (file) {
                // Convert file to Base64 string and wait for the result
                const str = await readFileAsBase64(file);
                fileData = str
            }

            let jsonData = {
                file: fileData,
            }


            if (fileData == '') {
                toast.error('please Upload a logo Image', {
                    position: 'top-center',
                });
            } else if (selectedStore == '') {
                toast.error('please Select a store', {
                    position: 'top-center',
                });
            } else {
                // Send the request
                const response = await fetch(`${config.backEndBaseUrl}api/store/logo/add/${selectedStore}`, {
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
                    // navigate('/admin/store/list');
                }
            }

        } catch (error) {
            console.error('Error adding data:', error);
        }
    };

    const resetForm = () => {
        setFile(null);
        setPreview(null);
        setSelectedStore('');
        setStoreName('')
    };


    useEffect(() => {
        fetchStore(1)
    }, [])

    return (
        <>
            <div className="wg-box wg-box-container">
                <ToastContainer />
                <form className="form-new-product form-style-1" onSubmit={addLogo}>
                    <fieldset className="name">
                        <div className="body-title">Choose Store: <span className="tf-color-1">*</span></div>
                        <div className="custom-select-container" ref={StoreMenuRef}>
                            <div className="custom-selected-item" onClick={() => setIsOpenStoreList(!isOpenStoreList)}>
                                <span>{storeName == '' ? 'select Store' : storeName}</span>
                            </div>
                            {isOpenStoreList && (
                                <div className="custom-dropdown-menu">
                                    <div className="custom-search-input-wrapper">
                                        <input type="text" placeholder='search...' value={searchStore} onChange={(e) => setSearchStore(e.target.value)} className="custom-search-input" />
                                    </div>
                                    <ul className="custom-dropdown-list">
                                        {filteredStoreList.map((item) => (
                                            <li key={item.uid} onClick={() => handlefilteredStoreList(item.uid, item.name)} className="custom-dropdown-item">
                                                <span>{item.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </fieldset>
                    <fieldset>
                        <div className="body-title">Cover Photo :<span className="tf-color-1">*</span></div>
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
                        <button className="tf-button w208 mx-auto" type="submit">Save</button>
                    </div>
                </form>
            </div>


        </>
    )
}

export default LogoOwnerPhotosForm