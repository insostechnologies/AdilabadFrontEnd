import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from "react-icons/ai";
import { config } from '../../../../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


function AddKeyword({ storeId }) {
    const [keywordInput, setKeywordInput] = useState('');
    const [keywords, setKeywords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { uid } = useParams();

    const getKeywords = async (storeId) => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/keywords/${storeId}`, {
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
                setKeywords(result.data);
            }

        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        getKeywords(storeId);
    }, [storeId]);

    const addKeyword = async () => {
        setIsLoading(true);
        try {
            let jsonData = {
                keyword: keywordInput,
            };
            let keywordExists = keywords.some(item => item.keyword === keywordInput);
            if (keywordInput === '') {
                toast.error('Please Add Keyword', {
                    position: 'top-center',
                });
            } else if (keywordExists) {
                toast.error('Key Word Already exists', {
                    position: 'top-center',
                });
            } else {
                const response = await fetch(`${config.backEndBaseUrl}api/keywords/${storeId}`, {
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
                    setKeywordInput('');
                    getKeywords(storeId);
                }
            }

        } catch (error) {
            console.error('Error adding data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const removeKeyword = async (keywordUid) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this keyword ?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            const response = await fetch(`${config.backEndBaseUrl}api/keywords/${keywordUid}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            });

                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }

                            const result = await response.json();
                            if (result.status) {
                                getKeywords(storeId);
                                toast.success(result.message, {
                                    position: 'top-center',
                                });
                            }

                        } catch (error) {
                            console.error('Error deleting keyword:', error);
                        }
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });

    };

    return (
        <>
            <div className="wg-box wg-box-container">
                <ToastContainer />
                <form className="form-new-product form-style-1" >

                    <fieldset className="name">
                        <div className="body-title">Set Product & Service Category:</div>
                        <div className="custom-select-container">
                            <div className="keyword-input-container">
                                <input
                                    type="text"
                                    placeholder="Enter Product & Service Category"
                                    value={keywordInput}
                                    onChange={(e) => setKeywordInput(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="add-more-btn btn-success"
                                    onClick={addKeyword}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Saving...' : 'Add'}
                                </button>
                            </div>
                            <div className="selected_categories">
                                {keywords && keywords.length > 0 ? keywords.map((keyword, index) => (
                                    <div key={index} className='selectedCats'>
                                        <span>{keyword.keyword}</span>
                                        <AiOutlineClose className='icon' onClick={() => removeKeyword(keyword.uid)} />
                                    </div>
                                )) : ''}
                            </div>
                        </div>
                    </fieldset>
                </form>
            </div>
        </>
    );
}

export default AddKeyword;
