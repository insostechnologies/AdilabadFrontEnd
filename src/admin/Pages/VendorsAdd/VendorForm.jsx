import React, { useState, useRef, useEffect } from 'react';
import './VendorForm.css';
import { config } from '../../../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { readFileAsBase64 } from '../../../utils/fileHandle'
import { useNavigate } from 'react-router-dom';
import useArrowKeyDisable from '../../customhook/useArrowKeyDisable';
import useOutsideClickListener from '../../customhook/useOutsideClickListener';



function VendorForm() {

    const CategoryMenuRef = useRef(null);

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [vendorState, setVendorState] = useState('');
    const [vendorCity, setVendorCity] = useState('');
    const [vendorArea, setVendorArea] = useState('');
    const [vendorNearBy, setVendorNearBy] = useState('');
    const [vendorPin, setVendorPin] = useState('');

    const [isOpenStoreList, setIsOpenStoreList] = useState(false);
    const [selectedStore, setSelectedStore] = useState('Select store');
    const [searchStore, setSearchStore] = useState('');
    const [storeList, setStoreList] = useState([]);

    const fileInputRef = useRef(null);
    const inputRef3 = useRef(null);

    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate();


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
                name: name,
                phone: phone,
                email: email,
                vendorState: vendorState,
                vendorCity: vendorCity,
                vendorArea: vendorArea,
                vendorPin: vendorPin,
            }


            if (name == '') {
                toast.error('please add Name', {
                    position: 'top-center',
                });
                setIsLoading(false);
                return;
            }else if ( phone == ''){
                toast.error('please add phone number', {
                    position: 'top-center',
                });
            }else {
                // Send the request
                const response = await fetch(`${config.backEndBaseUrl}api/user/vendor/add`, {
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
                    toast.error(result.message, {
                        position: 'top-center',
                    });
                } else {
                    toast.success(result.message, {
                        position: 'top-center',
                    });
                    resetForm();
                    navigate('/admin/vendors');
                }
            }

        } catch (error) {
            console.error('Error adding data:', error);
        }finally {
            setIsLoading(false);
        }
    };


    const resetForm = () => {
        setFile(null);
        setPreview(null);
        setName('');
        setPhone('');
        setEmail('');
        setVendorState('');
        setVendorCity('');
        setVendorArea('');
        setVendorNearBy('');
        setVendorPin('');
        setSearchStore('');
        
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

    // const fetchStore = async () => {
    //     try {
    //         const response = await fetch(`${config.backEndBaseUrl}api/`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });

    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }

    //         const result = await response.json();
    //         setStoreList(result.data); 


    //     } catch (error) {
    //         console.error('Error fetching categories:', error);
    //     }
    // };

    // useEffect(() => {
    //     fetchStore();
    // }, []);


    // const filteredStoreList = storeList.filter(item =>
    //     item.name.toLowerCase().includes(searchStore.toLowerCase())
    // );

    // const handleFilteredStoreList = (itemName, itemUid) => {
    //     setSelectedStore(itemName);
    //     setIsOpenStoreList(false);
    // };


    // custom hooks
    useArrowKeyDisable(inputRef3);
    useOutsideClickListener(CategoryMenuRef, () => {
        setIsOpenStoreList(false);
    })

    return (
        <>
            <ToastContainer />
            <div className="wg-box">
                <form className="form-new-product form-style-1" onSubmit={addCategory}>
                    <fieldset className="name">
                        <div className="body-title">Name: <span className="tf-color-1">*</span></div>
                        <input className="flex-grow" type="text" placeholder="Vendor name" value={name} onChange={(e) => setName(e.target.value)} />
                    </fieldset>

                    <fieldset className="name">
                        <div className="body-title">Phone Number: <span className="tf-color-1">*</span></div>
                        <input className="flex-grow" type="text" placeholder="Vendor phone no." value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </fieldset>

                    <fieldset className="name">
                        <div className="body-title">Email:</div>
                        <input className="flex-grow" type="text" placeholder="Vendor email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </fieldset>

                    <fieldset className="name">
                        <div className="body-title">Address:</div>
                        <div>
                            <input className="flex-grow mb-4 addr_inp" type="text" placeholder="State" name="text" tabIndex="0" value={vendorState} onChange={(e) => setVendorState(e.target.value)} />
                            <input className="flex-grow mb-4 addr_inp" type="text" placeholder="City" name="text" tabIndex="0" value={vendorCity} onChange={(e) => setVendorCity(e.target.value)} />
                            <input className="flex-grow mb-4 addr_inp" type="text" placeholder="Area" name="text" tabIndex="0" value={vendorArea} onChange={(e) => setVendorArea(e.target.value)} />
                            {/* <input className="flex-grow mb-4 addr_inp" type="text" placeholder="Near by" name="text" tabIndex="0" value={vendorNearBy} onChange={(e) => setVendorNearBy(e.target.value)} /> */}
                            <input ref={inputRef3} className="flex-grow addr_inp" type="number" placeholder="Pin" name="text" tabIndex="0" value={vendorPin} onChange={(e) => setVendorPin(e.target.value)} />
                        </div>

                    </fieldset>

                    {/* <fieldset className="name">
                        <div className="body-title">Choose Store: <span className="tf-color-1">*</span></div>
                        <div className="custom-select-container" ref={CategoryMenuRef}>
                            <div className="custom-selected-item" onClick={() => setIsOpenStoreList(!isOpenStoreList)}>
                                <span>{selectedStore}</span>
                            </div>
                            {isOpenStoreList && (
                                <div className="custom-dropdown-menu">
                                    <div className="custom-search-input-wrapper">
                                        <input type="text" placeholder='search...' value={searchStore} onChange={(e)=>setSearchStore(e.target.value)} className="custom-search-input" />
                                    </div>
                                    <ul className="custom-dropdown-list">
                                        {filteredStoreList.map((item) => (
                                            <li key={item.uid} onClick={() => handleFilteredStoreList(item.name, item.uid)} className="custom-dropdown-item">
                                                <span>{item.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </fieldset> */}

                    <fieldset>
                        <div className="body-title">Upload Photo:</div>
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
                        <div></div>
                        <button type="submit" className="tf-button w208 h10" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default VendorForm;
