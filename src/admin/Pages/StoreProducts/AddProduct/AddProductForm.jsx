import React, { useState, useContext, useRef, useEffect } from 'react';
import useOutsideClickListener from '../../../customhook/useOutsideClickListener';
import useArrowKeyDisable from '../../../customhook/useArrowKeyDisable';
import './AddProduct.css'
import { useParams } from 'react-router-dom';
import { AiOutlineClose } from "react-icons/ai";
import { config } from '../../../../config';
import { ToastContainer, toast } from 'react-toastify';
import { readFileAsBase64 } from '../../../../utils/fileHandle'
import { useNavigate } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function AddProductForm() {
    const { uid } = useParams();


    const KeywordsMenuRef = useRef(null);
    const inputRef1 = useRef(null);
    const inputRef2 = useRef(null);
    const inputRef3 = useRef(null);
    const [isOpenKeywordList, setIsOpenKeywordList] = useState(false);
    const [productName, setProductName] = useState('');
    // const [file, setFile] = useState(null);
    // const [preview, setPreview] = useState(null);
    // const fileInputRef = useRef(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [keywordList, setKeywordList] = useState([]);
    const [selectedKeyword, setSelectedKeyword] = useState([]);
    const [isActive, setIsActive] = useState(0);
    const [stockStatus, setStockStatus] = useState('');
    const [cartAction, setCartAction] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    const [taxAmount, setTaxAmount] = useState(0);
    // const [taxTitle, setTaxTitle] = useState('');
    const [taxPercent, setTaxPercent] = useState(0);
    const [delAmount, setDelAmount] = useState(0);
    // const [delTitle, setDelTitle] = useState('');
    const [price, setPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [sellingPrice, setSellingPrice] = useState(0);
    const [storeShortDesc, setStoreShortDesc] = useState('');
    const numericPrice = parseFloat(price) || 0;
    const numericDiscount = parseFloat(discount) || 0;
    const numericTaxPercent = parseFloat(taxPercent) || 0;
    const numericDelAmount = parseFloat(delAmount) || 0;


    const [searchType, setSearchType] = useState('');
    const [categoriesList, setTypeList] = useState([]);
    const [isOpenTypeList, setIsOpenTypeList] = useState(false);
    const CategoryMenuRef = useRef(null);
    const [selectedType, setSelectedType] = useState('Select Product/Service Type ⮟');

    useEffect(() => {
        setTypeList(['product', 'service'])
    }, [])


    useEffect(() => {
        const numericPrice = parseFloat(price) || 0;
        const numericDiscount = parseFloat(discount) || 0;
        const numericTaxPercent = parseFloat(taxPercent) || 0;
        const numericDelAmount = parseFloat(delAmount) || 0;

        // Calculate the discounted price
        const discountedPrice = numericPrice - (numericPrice * numericDiscount / 100);

        // Calculate the tax based on the discounted price
        const calculatedTaxAmount = discountedPrice * (numericTaxPercent / 100);

        // Set the tax amount state
        setTaxAmount(calculatedTaxAmount);

        // Calculate the final selling price
        const finalSellingPrice = discountedPrice + numericDelAmount;

        // Set the selling price state
        setSellingPrice(finalSellingPrice);

    }, [price, discount, taxPercent, delAmount]);

    const navigate = useNavigate();

    const addProduct = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            // let fileData = '';

            // if (file) {
            //     // Convert file to Base64 string and wait for the result
            //     fileData = await readFileAsBase64(file);
            // }

            if (!productName) {
                toast.error('Please add Product Name', {
                    position: 'top-center',
                });
                setIsLoading(false)
                return
            } else if (selectedType == 'Select Product/Service Type ⮟') {
                toast.error('Please add Product Type', {
                    position: 'top-center',
                });
                setIsLoading(false);
                return;
            } else if (sellingPrice < 1) {
                toast.error('Selling Price Must Be More Than 0', {
                    position: 'top-center',
                });
                setIsLoading(false);
                return;
            }



            const productData = {
                productName: productName,
                keyWords: selectedKeyword,
                price: price,
                discount: discount,
                sellingPrice: sellingPrice,
                gst: taxPercent,
                isActive: isActive,
                stockStatus: stockStatus,
                cartAction: cartAction,
                storeShortDesc: storeShortDesc,
                type: selectedType
            };

            // console.log(price)
            // console.log(discount)
            // console.log(sellingPrice)
            // console.log(taxPercent)
            // return

            const response = await fetch(`${config.backEndBaseUrl}api/product/add/${uid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
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
                // Uncomment these lines if you want to reset the form or navigate after success
                resetForm();
                navigate(`/admin/store/products/${uid}`);
            }
        } catch (error) {
            console.error('Error adding data:', error);
            toast.error('An error occurred while adding the product.', {
                position: 'top-center',
            });
        } finally {
            setIsLoading(false);
        }
    };

    // const fetchStore = async () => {
    //     const response = await fetch(`${config.backEndBaseUrl}api/store/${uid}`, {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     });
    //     if (!response.ok) {
    //         throw new Error(`HTTP error! status: ${response.status}`);
    //     }

    //     const result = await response.json();
    //     if (result.status) {
    //         let store = result.data
    //         console.log(store)
    //         setTaxPercent(store.gst_charge)
    //         setTaxTitle(store.gst_title)
    //         setDelAmount(store.delivery_charge)
    //         setDelTitle(store.delivery_title)
    //         setTaxAmount((price * (taxPercent / 100)))
    //     }
    // }


    const resetForm = async () => {
        setProductName('')
        // setFile(null)
        // setPreview(null)
        setPrice(0)
        setDiscount(0)
        setSellingPrice(0)
        setKeywordList([])
        setSelectedKeyword([])
        setIsActive(0)
        setStockStatus('')
        setCartAction('')
        getKeywords()
    }


    const getKeywords = async () => {

        try {
            const response = await fetch(`${config.backEndBaseUrl}api/keywords/${uid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setKeywordList(result.data); // Assuming response.data is the correct structure
            //console.log(result.data)

        } catch (error) {
            console.error('Error fetching categories:', error);
            // Handle error state or display error message
        }
    }

    // Keywords fields
    const filteredKeywordList = keywordList.length > 0 ? keywordList.filter(item =>
        item.keyword.toLowerCase().includes(searchKeyword.toLowerCase())
    ) : [];


    const handleFilteredKeywordList = (itemName, itemUid) => {
        setSelectedKeyword(prevSelectedKeyword => [
            ...prevSelectedKeyword,
            { name: itemName, uid: itemUid }
        ]);
        setKeywordList(keywordList.filter(entry => entry.uid !== itemUid));
        setIsOpenKeywordList(false);
    };

    const removeKeywords = (name, uid) => {
        setSelectedKeyword(selectedKeyword.filter(ele => ele.uid !== uid));
        setKeywordList(prevKeywords => [...prevKeywords, { keyword: name, uid: uid }]);
    };

    useOutsideClickListener(KeywordsMenuRef, () => {
        setIsOpenKeywordList(false);
    });

    useArrowKeyDisable(inputRef1);
    useArrowKeyDisable(inputRef2);
    useArrowKeyDisable(inputRef3);

    useEffect(() => {
        getKeywords()
    }, [])

    const handleIsActiveCheckboxChange = () => {
        setIsActive(isActive == 1 ? 0 : 1);
    };

    // const handleFileChange = (e) => {
    //     const selectedFile = e.target.files[0];
    //     setFile(selectedFile);

    //     if (selectedFile) {
    //         const fileReader = new FileReader();
    //         fileReader.onloadend = () => {
    //             setPreview(fileReader.result);
    //         };
    //         fileReader.readAsDataURL(selectedFile);
    //     } else {
    //         setPreview(null);
    //     }
    // };

    useOutsideClickListener(CategoryMenuRef, () => {
        setIsOpenTypeList(false);
    })

    const handlefilteredTypeList = (itemName) => {
        setSelectedType(itemName);
        setIsOpenTypeList(false);
    };

    const handleSearchType = (event) => {
        setSearchType(event.target.value);
    };

    const filteredTypeList = categoriesList.filter(item =>
        item.toLowerCase().includes(searchType.toLowerCase())
    );

    return (
        <>

            <div className="wg-box wg-box-container">
                <ToastContainer />
                <form className="form-new-product form-style-1" onSubmit={addProduct}>

                    <fieldset>
                        <div className="body-title">Product/Service Name: <span class="tf-color-1">*</span> </div>
                        <input className="flex-grow" type="text" placeholder="Product/Service Name" name="text" tabindex="0" value={productName} onChange={(e) => setProductName(e.target.value)} aria-required="true" required="" />
                    </fieldset>
                    <fieldset className="name">
                        <div className="body-title">Select Category: </div>
                        <div className="custom-select-container" ref={KeywordsMenuRef}>
                            <div className="custom-selected-item" onClick={() => setIsOpenKeywordList(!isOpenKeywordList)}>
                                <span>Select  Category ⮟</span>
                            </div>
                            {isOpenKeywordList && (
                                <div className="custom-dropdown-menu">
                                    <div className="custom-search-input-wrapper">
                                        <input type="text" placeholder='search...' value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} className="custom-search-input" />
                                    </div>
                                    <ul className="custom-dropdown-list">
                                        {filteredKeywordList.length > 0 ? (
                                            filteredKeywordList.map((item) => (
                                                <li key={item.uid} onClick={() => handleFilteredKeywordList(item.keyword, item.uid)} className="custom-dropdown-item">
                                                    <span>{item.keyword}</span>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="custom-dropdown-item">No keywords found</li>
                                        )}
                                    </ul>
                                </div>
                            )}
                            <div className="selected_categories">
                                {selectedKeyword.length > 0 ? (
                                    selectedKeyword.map((item) => (
                                        <div key={item.uid} className='selectedCats'>
                                            <span>{item.name}</span>
                                            <AiOutlineClose className='icon' onClick={() => removeKeywords(item.name, item.uid)} />
                                        </div>
                                    ))
                                ) : ''}
                            </div>
                        </div>
                    </fieldset>

                    <fieldset className="name">
                        <div className="body-title">Product/Service Type: <span className="tf-color-1">*</span></div>
                        <div className="custom-select-container" ref={CategoryMenuRef}>
                            <div className="custom-selected-item" onClick={() => setIsOpenTypeList(!isOpenTypeList)}>
                                <span>{selectedType}</span>
                            </div>
                            {isOpenTypeList && (
                                <div className="custom-dropdown-menu">
                                    <div className="custom-search-input-wrapper">
                                        <input type="text" placeholder='search...' value={searchType} onChange={handleSearchType} className="custom-search-input" />
                                    </div>
                                    <ul className="custom-dropdown-list">
                                        {filteredTypeList.map((item) => (
                                            <li key={item} onClick={() => handlefilteredTypeList(item)} className="custom-dropdown-item">
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </fieldset>

                    <fieldset>
                        <div className="body-title">Price (MRP):</div>
                        <input
                            ref={inputRef1}
                            className="flex-grow"
                            type="number"
                            placeholder="MRP"
                            name="text"
                            tabIndex="0"
                            value={price}
                            onChange={(e) => {
                                const newPrice = parseFloat(e.target.value);
                                setPrice(newPrice);

                            }}
                            aria-required="true"
                            required
                        />
                    </fieldset>

                    <fieldset>
                        <div className="body-title">Discount Amount ({numericPrice * numericDiscount / 100}):</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <input
                                ref={inputRef2}
                                className="flex-grow"
                                type="number"
                                placeholder="Discount in %"
                                name="text"
                                tabIndex="0"
                                value={discount}
                                onChange={(e) => {
                                    const newDiscount = parseFloat(e.target.value);
                                    setDiscount(newDiscount);
                                }}
                                aria-required="true"
                                required
                            />
                            <span style={{ fontSize: '40px' }}>%</span>
                        </div>
                    </fieldset>

                    <fieldset>
                        <div className="body-title">Tax ({parseInt(taxAmount)}): </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <input
                                className="flex-grow"
                                type="number"
                                placeholder="Tax"
                                name="text"
                                tabIndex="0"
                                value={taxPercent}
                                onChange={(e) => {
                                    const newTaxPercent = parseFloat(e.target.value);
                                    setTaxPercent(newTaxPercent);
                                }}
                                aria-required="true"
                                required
                            />
                            <span style={{ fontSize: '40px' }}>%</span>
                        </div>
                    </fieldset>

                    <fieldset>
                        <div className="body-title">Selling Price: </div>
                        <input
                            readOnly
                            ref={inputRef3}
                            className="flex-grow"
                            type="number"
                            placeholder="Selling Price"
                            name="text"
                            tabIndex="0"
                            value={sellingPrice}
                            aria-required="true"
                            required
                        />
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

                    <fieldset>
                        <div className="body-title">Product Disable/Enable:</div>
                        <label className="switch">
                            <input type="checkbox" checked={isActive} onChange={handleIsActiveCheckboxChange} />
                            <span className="slider round"></span>
                        </label>
                    </fieldset>



                    <fieldset>
                        <div className="body-title">Stock: </div>
                        <div className="radio-buttons">
                            <div className="item">
                                <input
                                    type="radio"
                                    name="stock-status"
                                    id="inStock"
                                    value="inStock"
                                    checked={stockStatus === 'inStock'}
                                    onClick={(e) => setStockStatus(e.target.value ? 'inStock' : '')}
                                />
                                <label htmlFor="inStock">
                                    <span className="body-title-2">In Stock</span>
                                </label>
                            </div>
                            <div className="item">
                                <input
                                    type="radio"
                                    name="stock-status"
                                    id="outOfStock"
                                    value="outOfStock"
                                    checked={stockStatus === 'outOfStock'}
                                    onClick={(e) => setStockStatus(e.target.value ? 'outOfStock' : '')}
                                />
                                <label htmlFor="outOfStock">
                                    <span className="body-title-2">Out of Stock</span>
                                </label>
                            </div>
                        </div>
                    </fieldset>

                    <fieldset>
                        <div className="body-title">Select your Cart: </div>
                        <div className="radio-buttons">
                            <div className="item">
                                <input
                                    type="radio"
                                    name="cart-action"
                                    id="addToCart"
                                    value="addToCart"
                                    checked={cartAction === 'addToCart'}
                                    onClick={(e) => setCartAction(e.target.checked ? 'addToCart' : '')}
                                />
                                <label htmlFor="addToCart">
                                    <span className="body-title-2">Add To Cart</span>
                                </label>
                            </div>
                            <div className="item">
                                <input
                                    type="radio"
                                    name="cart-action"
                                    id="orderNow"
                                    value="orderNow"
                                    checked={cartAction === 'orderNow'}
                                    onClick={(e) => setCartAction(e.target.checked ? 'orderNow' : '')}
                                />
                                <label htmlFor="orderNow">
                                    <span className="body-title-2">Order Now</span>
                                </label>
                            </div>
                            <div className="item">
                                <input
                                    type="radio"
                                    name="cart-action"
                                    id="bookNow"
                                    value="bookNow"
                                    checked={cartAction === 'bookNow'}
                                    onClick={(e) => setCartAction(e.target.checked ? 'bookNow' : '')}
                                />
                                <label htmlFor="bookNow">
                                    <span className="body-title-2">Book Now</span>
                                </label>
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
export default AddProductForm