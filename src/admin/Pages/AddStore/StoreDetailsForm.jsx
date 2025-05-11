import React, { useEffect, useRef, useState } from 'react';
import useOutsideClickListener from '../../customhook/useOutsideClickListener';
import useArrowKeyDisable from '../../customhook/useArrowKeyDisable';
import { config } from '../../../config';
import { AiOutlineClose } from "react-icons/ai";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Modal from '../../components/Modal/Modal';


function StoreDetailsForm() {
    const CategoryMenuRef = useRef(null);
    const subCategoryMenuRef = useRef(null);
    const inputRef1 = useRef(null);
    const inputRef2 = useRef(null);
    const inputRef3 = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [searchCategories, setSearchCategories] = useState('');
    const [searchSubCategories, setSearchSubCategories] = useState('');
    const [isOpenCategoriesList, setIsOpenCategoriesList] = useState(false);
    const [isOpenSubCategoriesList, setIsOpenSubCategoriesList] = useState(false);
    const [categoriesList, setCategoriesList] = useState([]);
    const [subCategoriesList, setSubCategoriesList] = useState([]);
    const [selectedSubCategories, setSelectedSubCategories] = useState([]);
    const [selectedCategoryName, setSelectedCategoryName] = useState('Select Category');

    const [storeName, setStoreName] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [whatsApp, setWhatsApp] = useState('');
    const [storeState, setStoreState] = useState('');
    const [storeCity, setStoreCity] = useState('');
    const [storeArea, setStoreArea] = useState('');
    const [storeNearBy, setStoreNearBy] = useState('');
    const [storePin, setStorePin] = useState('');
    const [storeShortDesc, setStoreShortDesc] = useState('');
    const [storeLongDesc, setStoreLongDesc] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [isVerified, setIsVerified] = useState(0)
    const [validityDate, setValidityDate] = useState('')
    const [amountPaid, setAmountPaid] = useState(0)

    const [storeTiming, setStoreTiming] = useState([
        { day: 'Sunday', fromTime: '', toTime: '', isEnabled: true },
        { day: 'Monday', fromTime: '', toTime: '', isEnabled: true },
        { day: 'Tuesday', fromTime: '', toTime: '', isEnabled: true },
        { day: 'Wednesday', fromTime: '', toTime: '', isEnabled: true },
        { day: 'Thursday', fromTime: '', toTime: '', isEnabled: true },
        { day: 'Friday', fromTime: '', toTime: '', isEnabled: true },
        { day: 'Saturday', fromTime: '', toTime: '', isEnabled: true },
    ]);

    const navigate = useNavigate();

    const validateTimeFormat = (time) => {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        return timeRegex.test(time);
    };

    const validateStoreTiming = () => {
        let hasValidDay = false;

        for (const entry of storeTiming) {
            if (entry.isEnabled) {
                if (entry.fromTime && entry.toTime) {
                    if (!validateTimeFormat(entry.fromTime) || !validateTimeFormat(entry.toTime)) {
                        return { valid: false, message: `Invalid time format for ${entry.day}` };
                    }
                    if (entry.fromTime >= entry.toTime) {
                        return { valid: false, message: `From time should be earlier than to time for ${entry.day}` };
                    }
                    hasValidDay = true;
                }
            } else {
                return { valid: false, message: 'At least one day must have valid timings And Enabled' };
            }
        }

        if (!hasValidDay) {
            return { valid: false, message: 'At least one day must have valid timings' };
        }

        return { valid: true, message: 'All entries are valid' };
    };

    const handleFieldToggle = (setField, field, index) => {
        const newField = [...field];
        newField[index].isEnabled = !newField[index].isEnabled;
        setField(newField);
    };

    const handleStoreTimingChange = (index, field, value) => {
        const newStoreTiming = [...storeTiming];
        if (newStoreTiming[index].isEnabled) {
            newStoreTiming[index][field] = value;
            setStoreTiming(newStoreTiming);
        }
    };

    // Fetch Parent Categories
    const fetchCategories = async (status) => {
        let params = '';
        if (status && status !== 'all') {
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

        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Fetch Subcategories based on Category ID (uid)
    const fetchSubCategories = async (status, uid) => {
        let params = '';
        if (status && status !== 'all') {
            params = `?status=${status}`;
        }
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/category/sub-category/${uid}${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setSubCategoriesList(result.data); // Assuming response.data is the correct structure

        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
    };

    // Handle Category Selection
    const handleGetSubCategoriesList = (itemName, itemUid) => {
        fetchSubCategories(1, itemUid);
        setIsOpenCategoriesList(false);
        // setSelectedCategoryName(itemName); // Set selected category name
    };

    // Filter Categories after selection
    const handleFilteredCategoriesList = (itemName, itemUid) => {
        setSelectedSubCategories(prevSelectedCategories => {
            // Check if the item is already selected
            if (prevSelectedCategories.some(category => category.uid === itemUid && category.type === 'category')) {
                return prevSelectedCategories; // Do not add duplicate category
            }
            return [
                ...prevSelectedCategories,
                { name: itemName, uid: itemUid, type: 'category' } // Using 'category' as the type
            ];
        });
        setIsOpenCategoriesList(false); // Close dropdown
    };

    // Filter Subcategories after selection
    const handleFilteredSubCategoriesList = (itemName, itemUid) => {
        setSelectedSubCategories(prevSelectedCategories => {
            // Check if the item is already selected
            if (prevSelectedCategories.some(subCategory => subCategory.uid === itemUid && subCategory.type === 'subcategory')) {
                return prevSelectedCategories; // Do not add duplicate subcategory
            }
            return [
                ...prevSelectedCategories,
                { name: itemName, uid: itemUid, type: 'subcategory' } // Using 'subcategory' as the type
            ];
        });
        setIsOpenSubCategoriesList(false); // Close dropdown
    };

    const removeCategory = (name, uid, type) => {
        // Remove the selected category or subcategory from the selected list
        setSelectedSubCategories(prevSelectedSubCategories =>
            prevSelectedSubCategories.filter(entry => entry.uid !== uid)
        );

        if (type === 'subcategory') {
            // Add the removed subcategory back to the subCategoriesList
            setSubCategoriesList(prevSubCategoriesList => {
                if (!prevSubCategoriesList.some(entry => entry.uid === uid)) {
                    return [...prevSubCategoriesList, { name, uid }];
                }
                return prevSubCategoriesList;
            });
        } else if (type === 'category') {
            // Add the removed category back to the categoriesList
            setCategoriesList(prevCategoriesList => {
                if (!prevCategoriesList.some(entry => entry.uid === uid)) {
                    return [...prevCategoriesList, { name, uid }];
                }
                return prevCategoriesList;
            });
        }
    };

    // Filtered Categories/Subcategories for Search
    const filteredCategoriesList = categoriesList.length > 0
        ? categoriesList.filter(item => item.name.toLowerCase().includes(searchCategories.toLowerCase()))
        : [];

    const filteredSubCategoriesList = subCategoriesList.length > 0
        ? subCategoriesList.filter(item => item.name.toLowerCase().includes(searchSubCategories.toLowerCase()))
        : [];


    const addStore = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        // console.log(isVerified)
        // return
        // // Removed time validation since it's no longer mandatory
        // // const timeValidate = validateStoreTiming();

        // if (storeName == '') {
        //     toast.error('Store Name is Required', {
        //         position: 'top-center',
        //     });
        //     setIsLoading(false);
        //     return;
        // } else if (!filteredSubCategoriesList ) {
        //     toast.error('Please Select a category', {
        //         position: 'top-center',
        //     });
        //     setIsLoading(false);
        //     return;
        // } else if (ownerName == '') {
        //     toast.error('Owner Name is Required', {
        //         position: 'top-center',
        //     });
        //     setIsLoading(false);
        //     return;
        // } else if (storeState == '') {
        //     toast.error('Store State is Required', {
        //         position: 'top-center',
        //     });
        //     setIsLoading(false);
        //     return;
        // } else if (phoneNumber == '') {
        //     toast.error('Phone Number is Required', {
        //         position: 'top-center',
        //     });
        //     setIsLoading(false);
        //     return;
        // } else if (storeCity == '') {
        //     toast.error('Store City is Required', {
        //         position: 'top-center',
        //     });
        //     setIsLoading(false);
        //     return;
        // } else if (storeArea == '') {
        //     toast.error('Store Area is Required', {
        //         position: 'top-center',
        //     });
        //     setIsLoading(false);
        //     return;
        // } else if (storeNearBy == '') {
        //     toast.error('Store Near by is Required', {
        //         position: 'top-center',
        //     });
        //     setIsLoading(false);
        //     return;
        // } else if (storePin == '') {
        //     toast.error('Store Pin is Required', {
        //         position: 'top-center',
        //     });
        //     setIsLoading(false);
        //     return;
        // }



        // If storeTiming is not provided, it will default to an empty array
        const filteredTime = storeTiming.filter(item => item.fromTime && item.toTime);
        const storeData = {
            storeName: storeName,
            ownerName: ownerName,
            storeState: storeState,
            phoneNumber: phoneNumber,
            whatsApp: whatsApp,
            storeCity: storeCity,
            storeArea: storeArea,
            storeNearBy: storeNearBy,
            storePin: storePin,
            storeTiming: filteredTime && filteredTime.length > 0 ? filteredTime : undefined, // Include only if not empty
            storeShortDesc: storeShortDesc,
            storeLongDesc: storeLongDesc,
            selectedSubCategories: selectedSubCategories,
            isVerified: isVerified,
            validityDate: validityDate + " 00:00:00",
            amountPaid: amountPaid
        };

        // console.log(storeData);
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/store/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(storeData),
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
                let categorystr = ''
                if (selectedSubCategories && selectedSubCategories.length > 0) {
                    categorystr = `?cid=${selectedSubCategories[0].uid}`
                }

                navigate(`/admin/store/list${categorystr}`);
                await resetForm();
            }
        } catch (error) {
            console.error('Error adding data:', error);
        } finally {
            setIsLoading(false);
        }
    }



    const resetForm = async () => {
        setSelectedSubCategories([])
        setStoreName('')
        setOwnerName('')
        // setKeywords([])
        // setKeywordInput('')
        setStoreState('')
        setStoreCity('')
        setStoreArea('')
        setStoreNearBy('')
        storePin('')
        setStoreShortDesc('')
        setStoreLongDesc('')
        setStoreTiming([
            { day: 'Sunday', fromTime: '', toTime: '', isEnabled: true },
            { day: 'Monday', fromTime: '', toTime: '', isEnabled: true },
            { day: 'Tuesday', fromTime: '', toTime: '', isEnabled: true },
            { day: 'Wednesday', fromTime: '', toTime: '', isEnabled: true },
            { day: 'Thursday', fromTime: '', toTime: '', isEnabled: true },
            { day: 'Friday', fromTime: '', toTime: '', isEnabled: true },
            { day: 'Saturday', fromTime: '', toTime: '', isEnabled: true },
        ])
        await fetchCategories(1)
    }


    useEffect(() => {
        fetchCategories(1)
    }, []);


    // custom hooks
    useOutsideClickListener(CategoryMenuRef, () => {
        setIsOpenCategoriesList(false);
    });
    useOutsideClickListener(subCategoryMenuRef, () => {
        setIsOpenSubCategoriesList(false);
    });

    useArrowKeyDisable(inputRef1);
    useArrowKeyDisable(inputRef2);
    useArrowKeyDisable(inputRef3);
    // _______


    return (
        <>
            <div className="wg-box wg-box-container">
                <ToastContainer />
                <form className="form-new-product form-style-1" onSubmit={addStore}>

                    <fieldset className="name">
                        <div className="body-title">Store/Business name: <span className="tf-color-1">*</span></div>
                        <input className="flex-grow" type="text" placeholder="Store name" name="text" tabIndex="0" value={storeName} onChange={(event) => setStoreName(event.target.value)} />
                    </fieldset>

                    <fieldset className="name">
                        <div className="body-title">Owner name: <span className="tf-color-1">*</span></div>
                        <input className="flex-grow" type="text" placeholder="Owner name" name="text" tabIndex="0" value={ownerName} onChange={(event) => setOwnerName(event.target.value)} />
                    </fieldset>
                    <fieldset className="name">
                        <div className="body-title">Phone Number: <span className="tf-color-1">*</span></div>
                        <input className="flex-grow" type="number" placeholder="Phone Number" name="number" tabIndex="0" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} />
                    </fieldset>
                    <fieldset className="name">
                        <div className="body-title">WhatsApp Number: <span className="tf-color-1">*</span></div>
                        <input className="flex-grow" type="number" placeholder="WhatsApp Number" name="number" tabIndex="0" value={whatsApp} onChange={(event) => setWhatsApp(event.target.value)} />
                    </fieldset>

                    <fieldset className="name">
                        <div className="body-title">Select Category <span className="tf-color-1">*</span></div>
                        <div className="custom-select-container" ref={CategoryMenuRef}>
                            <div
                                className="custom-selected-item"
                                onClick={() => setIsOpenCategoriesList(!isOpenCategoriesList)}
                            >
                                <span>{selectedCategoryName || "Select Category"}</span>
                            </div>
                            {isOpenCategoriesList && (
                                <div className="custom-dropdown-menu">
                                    <div className="custom-search-input-wrapper">
                                        <input
                                            type="text"
                                            placeholder="search..."
                                            value={searchCategories}
                                            onChange={(e) => setSearchCategories(e.target.value)}
                                            className="custom-search-input"
                                        />
                                    </div>
                                    <ul className="custom-dropdown-list">
                                        {filteredCategoriesList.map((item) => (
                                            <li
                                                key={item.uid}
                                                onClick={() => {
                                                    handleFilteredCategoriesList(item.name, item.uid);
                                                    handleGetSubCategoriesList(item.name, item.uid);
                                                }}
                                                className="custom-dropdown-item"
                                            >
                                                <span>{item.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="selected_categories">
                                {selectedSubCategories
                                    .filter(item => item.type === 'category')
                                    .map((item) => (
                                        <div key={item.uid} className="selectedCats">
                                            <span>{item.name}</span>
                                            <AiOutlineClose
                                                className="icon"
                                                onClick={() => removeCategory(item.name, item.uid, item.type)}
                                            />
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </fieldset>

                    <fieldset className="name">
                        <div className="body-title">Select Sub Category </div>
                        <div className="custom-select-container" ref={subCategoryMenuRef}>
                            <div
                                className="custom-selected-item"
                                onClick={() => setIsOpenSubCategoriesList(!isOpenSubCategoriesList)}
                            >
                                <span>Select Sub Category</span>
                            </div>
                            {isOpenSubCategoriesList && (
                                <div className="custom-dropdown-menu">
                                    <div className="custom-search-input-wrapper">
                                        <input
                                            type="text"
                                            placeholder="search..."
                                            value={searchSubCategories}
                                            onChange={(e) => setSearchSubCategories(e.target.value)}
                                            className="custom-search-input"
                                        />
                                    </div>
                                    <ul className="custom-dropdown-list">
                                        {filteredSubCategoriesList.map((item) => (
                                            <li
                                                key={item.uid}
                                                onClick={() => handleFilteredSubCategoriesList(item.name, item.uid)}
                                                className="custom-dropdown-item"
                                            >
                                                <span>{item.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="selected_categories">
                                {selectedSubCategories
                                    .filter(item => item.type === 'subcategory')
                                    .map((item) => (
                                        <div key={item.uid} className="selectedCats">
                                            <span>{item.name}</span>
                                            <AiOutlineClose
                                                className="icon"
                                                onClick={() => removeCategory(item.name, item.uid, item.type)}
                                            />
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </fieldset>


                    <fieldset className="name">
                        <div className="body-title">Store Address: <span className="tf-color-1">*</span></div>
                        <div>
                            <input className="flex-grow mb-3 addr_inp" type="text" placeholder="State" name="text" tabIndex="0" value={storeState} onChange={(e) => setStoreState(e.target.value)} />
                            <input className="flex-grow addr_inp" type="text" placeholder="City" name="text" tabIndex="0" value={storeCity} onChange={(e) => setStoreCity(e.target.value)} />
                            <input className="flex-grow mb-3 addr_inp" type="text" placeholder="Area" name="text" tabIndex="0" value={storeArea} onChange={(e) => setStoreArea(e.target.value)} />
                            <input className="flex-grow addr_inp" type="text" placeholder="Near by" name="text" tabIndex="0" value={storeNearBy} onChange={(e) => setStoreNearBy(e.target.value)} />
                            <input ref={inputRef3} className="flex-grow addr_inp" type="number" placeholder="Pin" name="text" tabIndex="0" value={storePin} onChange={(e) => setStorePin(e.target.value)} />
                        </div>

                    </fieldset>

                    <fieldset>
                        <button className='Toggle_Btn' type="button" onClick={() => setIsModalOpen(true)}>
                            Add Store Timing
                        </button>

                        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} setIsOpen={setIsModalOpen}>
                            <div className='store-timing'>
                                {storeTiming.map((timing, index) => (
                                    <div key={index} className='days_con' >
                                        <span className='days' >{timing.day}</span>
                                        <div className='days_inp'>
                                            <div className='days_con_bx'>
                                                <input
                                                    type="time"
                                                    value={timing.fromTime}
                                                    onChange={(e) =>
                                                        handleStoreTimingChange(index, 'fromTime', e.target.value)
                                                    }
                                                />
                                                <div className='days_to'>to</div>
                                                <input
                                                    type="time"
                                                    value={timing.toTime}
                                                    onChange={(e) =>
                                                        handleStoreTimingChange(index, 'toTime', e.target.value)
                                                    }
                                                />
                                            </div>
                                            <label className="switch">
                                                <input type="checkbox" checked={timing.isEnabled} onChange={() => handleFieldToggle(setStoreTiming, storeTiming, index)} />
                                                <span className="slider round"></span>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Modal>
                    </fieldset>


                    <fieldset className="description ckEdit">
                        <div className="body-title mb-10">Short Description: </div>
                        <CKEditor
                            editor={ClassicEditor}
                            data={storeShortDesc}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setStoreShortDesc(data);
                            }}
                            config={{
                                placeholder: 'Short Description..',
                                removePlugins: ['MediaEmbed']
                            }}
                        />
                    </fieldset>

                    <fieldset className="name ckEdit">
                        <div className="body-title">Long Description: </div>
                        <CKEditor
                            editor={ClassicEditor}
                            data={storeLongDesc}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setStoreLongDesc(data);
                            }}
                            config={{
                                placeholder: 'Long Description..',
                            }}
                        />
                    </fieldset>

                    <fieldset className="name">
                        <div className="body-title">Validity Date:</div>
                        <input className="flex-grow" type="date" placeholder="Validity Date" value={validityDate} onChange={(event) => setValidityDate(event.target.value)} />
                    </fieldset>

                    <fieldset>
                        <div className="body-title">Is Verified:</div>
                        <label className="switch">
                            <input type="checkbox" checked={isVerified} onChange={() => setIsVerified(isVerified == 1 ? 0 : 1)} />
                            <span className="slider round"></span>
                        </label>
                    </fieldset>

                    <fieldset className="name">
                        <div className="body-title">Amount Paid: </div>
                        <input className="flex-grow" type="number" placeholder="Amount Paid" name="text" tabIndex="0" value={amountPaid} onChange={(event) => setAmountPaid(event.target.value)} />
                    </fieldset>

                    <div className="bot mx-auto">
                        <button type="submit" className="tf-button w208 h10 px-5" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default StoreDetailsForm;
