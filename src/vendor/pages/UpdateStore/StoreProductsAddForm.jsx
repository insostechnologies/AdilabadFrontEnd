import React, { useRef, useState } from 'react';
import './UpdateStore.css';
import useOutsideClickListener from '../../customhook/useOutsideClickListener';
import useArrowKeyDisable from '../../customhook/useArrowKeyDisable';
import { AiOutlineClose } from "react-icons/ai";


function StoreProductsAddForm() {
    const KeywordsMenuRef = useRef(null);
    const inputRef1 = useRef(null);
    const inputRef2 = useRef(null);
    const inputRef3 = useRef(null);

    const [isOpenKeywordList, setIsOpenKeywordList] = useState(false);

    const [productName, setProductName] = useState('');
    const [newProductCategory, setNewProductCategory] = useState('');
    const [price, setPrice] = useState();
    const [discount, setDiscount] = useState();
    const [sellingPrice, setSellingPrice] = useState();

  

    const [searchKeyword, setSearchKeyword] = useState('');
    const [keywordList, setKeywordList] = useState([]);
    const [selectedKeyword, setSelectedKeyword] = useState([]);


   
    // Keywords fields
    const filteredKeywordList = keywordList.length > 0 ? keywordList.filter(item =>
        item.name.toLowerCase().includes(searchKeyword.toLowerCase())
    ) : [];

    const handleFilteredKeywordList = (itemName, itemUid) => {
        setSelectedKeyword(prevSelectedKeyword => [
            ...prevSelectedKeyword,
            { name: itemName, uid: itemUid }
        ]);
        setKeywordList(keywordList.filter(entry => entry.uid !== itemUid))
        setIsOpenKeywordList(false);
    };

    const removeKeywords = (name, uid) => {
        setSelectedKeyword(selectedKeyword.filter(ele => ele.uid !== uid));
        setKeywordList(preKeywords => [...preKeywords, { name: name, uid: uid }]);
    };
    // ________

    
    useOutsideClickListener(KeywordsMenuRef, () => {
        setIsOpenKeywordList(false);
    });

    useArrowKeyDisable(inputRef1);
    useArrowKeyDisable(inputRef2);
    useArrowKeyDisable(inputRef3);
    // _________

    return (
        <>
            <div className="wg-box wg-box-container ">
                <form className="form-new-product form-style-1 " >

                    <fieldset>
                        <div className="body-title">Product/Service Name: <span class="tf-color-1">*</span> </div>
                        <input className="flex-grow" type="text" placeholder="Product/Service Name" name="text" tabindex="0" value={productName} onChange={(e)=>setProductName(e.target.value)} aria-required="true" required="" />
                    </fieldset>

                    <fieldset className="name">
                        <div className="body-title">Select Keywords: </div>
                        <div className="custom-select-container" ref={KeywordsMenuRef}>
                            <div className="custom-selected-item" onClick={() => setIsOpenKeywordList(!isOpenKeywordList)}>
                                <span>Select keywords ⮟</span>
                            </div>
                            {isOpenKeywordList && (
                                <div className="custom-dropdown-menu">
                                    <div className="custom-search-input-wrapper">
                                        <input type="text" placeholder='search...' value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} className="custom-search-input" />
                                    </div>
                                    <ul className="custom-dropdown-list">
                                        {filteredKeywordList.map((item) => (
                                            <li key={item.uid} onClick={() => handleFilteredKeywordList(item.name, item.uid)} className="custom-dropdown-item">
                                                <span>{item.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="selected_categories">
                                {selectedKeyword.length > 0 ? (
                                    selectedKeyword.map((item) => (
                                        <div key={item.itemUid} className='selectedCats'>
                                            <span>{item.name}</span>
                                            <AiOutlineClose className='icon' onClick={() => removeKeywords(item.name, item.uid)} />
                                        </div>
                                    ))
                                ) : ''}
                            </div>
                        </div>
                    </fieldset>

                    <fieldset>
                        <div className="body-title">Create New Product/Service Category: </div>
                        <input className="flex-grow" type="text" placeholder="Create New Product/Service Category" name="text" tabindex="0" value={newProductCategory} onChange={(e)=>setNewProductCategory(e.target.value)} aria-required="true" required="" />
                    </fieldset>

                    <fieldset>
                        <div className="body-title">Price(MRP): </div>
                        <input ref={inputRef1} className="flex-grow" type="Number" placeholder="MRP" name="text" tabindex="0" value={price} onChange={(e)=>setPrice(e.target.value)} aria-required="true" required="" />
                    </fieldset>

                    <fieldset>
                        <div className="body-title">Discount Amount:</div>
                        <input ref={inputRef2} className="flex-grow" type="Number" placeholder="Discount in %" name="text" tabindex="0" value={discount} onChange={(e)=>setDiscount(e.target.value)} aria-required="true" required="" />
                    </fieldset>

                    <fieldset>
                        <div className="body-title">Selling Price:</div>
                        <input ref={inputRef3} className="flex-grow" type="Number" placeholder="Selling Price" name="text" tabindex="0" value={sellingPrice} onChange={(e)=>setSellingPrice(e.target.value)} aria-required="true" required="" />
                    </fieldset>

                    <fieldset>
                        <div className="body-title">Upload Product/Service Images: </div>
                        <div className="upload-image flex-grow">
                            <div className="item up-load">
                                <label className="uploadfile" for="myFile">
                                    <span className="icon">
                                        <i className="icon-upload-cloud"></i>
                                    </span>
                                    <span className="body-text">Drop your images here or select <span className="tf-color">click to browse</span></span>
                                    <input type="file" id="myFile" name="filename" />
                                </label>
                            </div>
                        </div>
                    </fieldset>

                    <fieldset>
                        <div className="body-title">Product Enable/Disable:</div>
                        <p>OFF</p>
                        <label className="switch">
                            <input type="checkbox" checked />
                            <span className="slider round"></span>
                        </label>
                        <p>ON</p>
                    </fieldset>


                    <fieldset>
                        <div className="body-title">Stock: </div>

                        <div className="radio-buttons">
                            <div className="item">
                                <input className="" type="radio" name="admin-language" id="admin-language1" checked="" />
                                <label className="" for="admin-language1"><span className="body-title-2">In Stock</span></label>
                            </div>
                            <div className="item">
                                <input className="" type="radio" name="admin-language" id="admin-language2" />
                                <label className="" for="admin-language2"><span className="body-title-2">Out off Stock</span></label>
                            </div>
                        </div>
                    </fieldset>

                    <fieldset>
                        <div className="body-title">Select your Cart: </div>
                        <div className="radio-buttons">
                            <div className="item">
                                <input className="" type="radio" name="admin-language" id="admin-language1" checked="" />
                                <label className="" for="admin-language1"><span className="body-title-2">Add To Cart</span></label>
                            </div>
                            <div className="item">
                                <input className="" type="radio" name="admin-language" id="admin-language2" />
                                <label className="" for="admin-language2"><span className="body-title-2">Order Now</span></label>
                            </div>
                            <div className="item">
                                <input className="" type="radio" name="admin-language" id="admin-language2" />
                                <label className="" for="admin-language2"><span className="body-title-2">Book Now</span></label>
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

export default StoreProductsAddForm