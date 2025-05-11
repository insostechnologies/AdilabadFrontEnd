import React, { useEffect, useRef, useState } from 'react';
import './UpdateStore.css';
import { config } from '../../../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate, useParams } from 'react-router-dom';


function StoreSEODetailsForm() {

    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [keywordInput, setKeywordInput] = useState('');
    const [keywords, setKeywords] = useState([]);
    const { uid } = useParams();
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();

    const fetchStore = async (uid) => {
        setIsLoading(true)
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/store/${uid}`, {
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
                let store = result.data
                if (store.metaData) {
                    setMetaTitle(store.metaData.meta_title)
                    setMetaDescription(store.metaData.meta_desc)
                    if(store.metaKeywords){
                        setKeywords(store.metaKeywords.map(item => item.keyword));
                    }
                }
            }

        } catch (error) {
            console.error('Error fetching categories:', error);
            // Handle error state or display error message
        } finally {
            setIsLoading(false)
        }
    };




    const addKeyword = () => {
        let keywordExists = keywords.some(item => item === keywordInput);
        if (keywordExists) {
            toast.error('Key Word Allreday exists', {
                position: 'top-center',
            });
        } else if (keywordInput == '') {
            toast.error('Input is Empty', {
                position: 'top-center',
            });
        } else if (keywordInput.trim() !== '') {
            setKeywords(prevKeywords => [...prevKeywords, keywordInput.trim()]);
            setKeywordInput('');
        }
    };

    const removeKeyword = (keywordToRemove) => {
        setKeywords(keywords.filter(keyword => keyword !== keywordToRemove));
    };


    // Form Submit sec.
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true)

        try {
            if (metaTitle == '') {
                toast.error('Please Add meta title', {
                    position: 'top-center',
                });
                setIsLoading(false);
                return;
            } else {
                let jsonData = {
                    metaTitle: metaTitle,
                    metaDescription: metaDescription,
                    keywords: keywords
                }
                // Send the request
                const response = await fetch(`${config.backEndBaseUrl}api/store/metadata/update/${uid}`, {
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
                    navigate('/admin/store/list');

                }
            }

        } catch (error) {
            console.error('Error adding data:', error);
        } finally {
            setIsLoading(false);
        }
    };
    // ____

    useEffect(()=>{
        fetchStore(uid)
    },[])




    return (
        <>
            <div class="wg-box wg-box-container">
                <form class="form-new-product form-style-1" onSubmit={handleSubmit}>
                    <ToastContainer />
                    {/* <fieldset className="name">
                        <div className="body-title">Choose Store: <span className="tf-color-1">*</span></div>
                        <div className="custom-select-container" ref={StoreMenuRef}>
                            <div className="custom-selected-item" onClick={() => setIsOpenStoreList(!isOpenStoreList)}>
                                <span>{storeName == '' ? 'Select Store ⮟' : storeName}</span>
                            </div>
                            {isOpenStoreList && (
                                <div className="custom-dropdown-menu">
                                    <div className="custom-search-input-wrapper">
                                        <input type="text" placeholder='search...' value={searchStore} onChange={(e) => setSearchStore(e.target.value)} className="custom-search-input" />
                                    </div>
                                    <ul className="custom-dropdown-list">
                                        {filteredStoreList.map((item) => (
                                            <li key={item.uid} onClick={() => handleFilteredStoreList(item.uid, item.name)} className="custom-dropdown-item">
                                                <span>{item.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </fieldset> */}

                    <fieldset className="name">
                        <div className="body-title">Meta Title:</div>
                        <input className="flex-grow" type="text" placeholder="Meta title" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
                    </fieldset>

                    <fieldset className="name">
                        <div className="body-title">Meta Description:</div>
                        <textarea className="flex-grow" type="text" placeholder="Meta descriptions" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
                    </fieldset>

                    <fieldset className="name">
                        <div className="body-title">Meta Keywords:</div>
                        <div className="custom-select-container">
                            <div className="keyword-input-container">
                                <input type="text" placeholder="Enter keyword" value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} />
                                <button type="button" className="add-more-btn" onClick={addKeyword}> Add Keyword</button>
                            </div>
                            <div className="selected_categories">
                                {keywords.map((keyword, index) => (
                                    <div key={index} className='selectedCats'>
                                        <span>{keyword}</span>
                                        <AiOutlineClose className='icon' onClick={() => removeKeyword(keyword)} />
                                    </div>
                                ))}
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

export default StoreSEODetailsForm