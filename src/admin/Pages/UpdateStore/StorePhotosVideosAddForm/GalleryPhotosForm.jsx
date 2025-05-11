import React, { useState, useEffect, useRef } from 'react';
import './BannerSlider.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useOutsideClickListener from '../../../customhook/useOutsideClickListener';
import ImageUploading from "react-images-uploading";
import { config } from '../../../../config';
import { readFileAsBase64 } from '../../../../utils/fileHandle'
function GalleryPhotosForm() {
    const StoreMenuRef = useRef(null);
    const [isOpenStoreList, setIsOpenStoreList] = useState(false);
    const [searchStore, setSearchStore] = useState('');
    const [storeName, setStoreName] = useState('');
    const [images, setImages] = useState([]);
    const [selectedStore, setSelectedStore] = useState('')
    const [storeList, setStoreList] = useState([]);

    const maxNumber = 69;

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

    useOutsideClickListener(StoreMenuRef, () => {
        setIsOpenStoreList(false);
    })

    const onChange = (imageList) => {
        setImages(imageList);
    };
    const handlefilteredStoreList = (storeId, storeName) => {
        setIsOpenStoreList(false);
        setStoreName(storeName)
        setSelectedStore(storeId)
    };

    const filteredStoreList = storeList.length > 0 ? storeList.filter(item =>
        item.name.toLowerCase().includes(searchStore.toLowerCase())
    ) : []


    const addGallery= async (e) => {
        e.preventDefault();


        if (images.length === 0) {
            toast.error('Please select galary images', { position: 'top-center' });
        } else if (selectedStore == '') {
            toast.error('please Select a store', {
                position: 'top-center',
            });
        } else {
            const imgArr = await Promise.all(images.map(async (img) => {
                const base64String = await readFileAsBase64(img.file);
                return base64String;
            }));

            const galaryData = {
                images: imgArr.map((img, index) => ({
                    base64: img,
                }))
            };

            try {
                const response = await fetch(`${config.backEndBaseUrl}api/store/gallery/add/${selectedStore}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(galaryData)
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                if (result.status) {
                    toast.success(result.message, { position: 'top-center' });
                    resetForm();
                } else {
                    toast.error('Error uploading galary', { position: 'top-center' });
                }
            } catch (error) {
                console.error('Error uploading banner:', error);
                toast.error('Internal server error', { position: 'top-center' });
            }
        }
    }
    const resetForm = () => {
        setImages([]);
        setStoreName('')
    };
    useEffect(() => {
        fetchStore(1)
    }, [])
    return (
        <>
            <div className="wg-box wg-box-container">
                <ToastContainer />
                <form className="form-new-product form-style-1" onSubmit={addGallery}>
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
                        <div className="body-title">Gallery Image<span className="tf-color-1">*</span></div>
                        <div className="upload-image flex-grow">
                            <div className="App">
                                <ImageUploading
                                    multiple
                                    value={images}
                                    onChange={onChange}
                                    maxNumber={maxNumber}
                                    dataURLKey="data_url"
                                    acceptType={["jpg","png","jpeg"]}
                                >
                                    {({
                                        imageList,
                                        onImageUpload,
                                        onImageRemoveAll,
                                        onImageRemove,
                                        isDragging,
                                        dragProps
                                    }) => (
                                        <div className="upload__image-wrapper">
                                            <button
                                                type='button'
                                                style={isDragging ? { color: "red" } : null}
                                                onClick={onImageUpload}
                                                {...dragProps}
                                                className='btn btn-lg btn-success p-4 m-4'
                                            >
                                                Select Gallery Images
                                            </button>
                                            &nbsp;
                                            <button
                                                type='button'
                                                style={imageList.length === 0 ? { display: 'none' } : {}}
                                                className='btn btn-lg btn-danger p-4 m-2'
                                                onClick={onImageRemoveAll}
                                            >
                                                Remove all images
                                            </button>
                                            <div className='prv_img m-2 '>
                                                {imageList.map((image, index) => (
                                                    <div key={index} className="image-item">
                                                        <img src={image.data_url} alt="" width="100" />
                                                        <div className="image-item__btn-wrapper">
                                                            <h4 align="left">image : {index + 1}</h4>
                                                            <div className='btn_con'>
                                                                <button
                                                                    type='button'
                                                                    className='btn btn-lg btn-danger p-2 m-1'
                                                                    onClick={() => onImageRemove(index)}
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>

                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </ImageUploading>
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

export default GalleryPhotosForm