import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from "react-icons/ai";
import { config } from '../../../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddFilterForm() {
    const [keywordInput, setKeywordInput] = useState('');
    const [keywords, setKeywords] = useState([]);

    const getKeywords = async () =>{

        try {
            const response = await fetch(`${config.backEndBaseUrl}api/keywords`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setKeywords(result.data); // Assuming response.data is the correct structure
            //console.log(result.data)
        
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Handle error state or display error message
        }
    }

  
    useEffect(() => {
        getKeywords()
    }, []);

    const addKeyword = async () => {
        try {
            let jsonData = {
                keyword: keywordInput,
            }
            let keywordExists = keywords.some(item => item.keyword === keywordInput);
            if(keywordInput == ''){
                toast.error('Please Add Keyword', {
                    position: 'top-center',
                });
            }else if(keywordExists){
                toast.error('Key Word Allreday exists', {
                    position: 'top-center',
                });
            }else{
                // Send the request
                const response = await fetch(`${config.backEndBaseUrl}api/keywords`, {
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
                    getKeywords()
                }
            }

        } catch (error) {
            console.error('Error adding data:', error);
        }
    };

    const removeKeyword = async (uid) => {
        
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/keywords/${uid}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if(result.status){
                toast.success(result.message, {
                    position: 'top-center',
                });
            }
            getKeywords()

        } catch (error) {
            console.error('Error fetching categories:', error);
            // Handle error state or display error message
        }


    };
    return (
        <>
            <div class="wg-box wg-box-container">
                <ToastContainer/>
                <form class="form-new-product form-style-1" >

                    <fieldset className="name">
                        <div className="body-title">Set Keywords:</div>
                        <div className="custom-select-container">
                            <div className="keyword-input-container">
                                <input type="text" placeholder="Enter keyword" value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} />
                                <button type="button" className="add-more-btn" onClick={addKeyword}> Add Keyword</button>
                            </div>
                            <div className="selected_categories">
                                {keywords.map((keyword, index) => (
                                    <div key={index} className='selectedCats'>
                                        <span>{keyword.keyword}</span>
                                        <AiOutlineClose className='icon' onClick={() => removeKeyword(keyword.uid)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </fieldset>
                </form>
            </div>
        </>
    )
}

export default AddFilterForm