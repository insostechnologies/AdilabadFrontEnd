import React, { useState, useRef, useEffect } from 'react';
import './AboutSettings.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { config } from '../../../../../config';
import { readFileAsBase64 } from '../../../../../utils/fileHandle'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AiOutlineClose } from "react-icons/ai";

function AboutSettings() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [userId, setUserId] = useState(null);
    const [seoId, setSeoId] = useState(null);
    const [name, setName] = useState('');
    const [storeState, setStoreState] = useState('');
    const [storeCity, setStoreCity] = useState('');
    const [storeCountry, setStoreCountry] = useState('');
    const [storeContinent, setStoreContinent] = useState('');
    const [copyWrite, setCopyWrite] = useState('');
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDesc, setMetaDesc] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const fileInputRef = useRef(null);
    const [keywordInput, setKeywordInput] = useState('');
    const [keywords, setKeywords] = useState([]);
    const [filePath, setFilePath] = useState(null)
    const [user, setUserData] = useState(null)
    const [websiteLink, setWebsiteLink] = useState('')
    const [appStoreLink, setAppStoreLink] = useState('')
    const [playStoreLink, setPlayStoreLink] = useState('')

    let uid = localStorage.getItem('adminUserId')

    const fetchAdmin = async (uid) => {
        try {

            // Send the request
            const response = await fetch(`${config.backEndBaseUrl}api/user/${uid}?q=v`, {
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
                setUserData(result.data)
            } else {
                console.log('internal server error')
            }

        } catch (error) {
            console.error('Error update data:', error);
        }
    }

    useEffect(() => {
        fetchAdmin(uid)
    }, [uid])

    const addKeyword = () => {
        const trimmedKeyword = keywordInput.trim();

        // Check if the keyword is not empty and does not already exist
        if (trimmedKeyword && !keywords.some(keyword => keyword.keyword === trimmedKeyword)) {
            setKeywords(prevKeywords => [...prevKeywords, { keyword: trimmedKeyword }]);
            setKeywordInput(''); // Clear the input field
        } else if (trimmedKeyword && keywords.some(keyword => keyword.keyword === trimmedKeyword)) {
            toast.warning('Keyword already exists', {
                position: 'top-center',
            });
        } else if (!trimmedKeyword) {
            toast.warning('Keyword cannot be empty', {
                position: 'top-center',
            });
        }
    };

    useEffect(() => {
        if (user && user.seoVendorDetails) {
            setUserId(user.uid || '');
            setSeoId(user.seoVendorDetails.uid || '')
            setPreview(user.seoVendorDetails.logo == '' ? config.backEndBaseUrl + config.placeHolderImage : config.backEndBaseUrl + user.seoVendorDetails.logo || '');
            setFilePath(user.seoVendorDetails.logo || '')
            setName(user.seoVendorDetails.name || '')
            setStoreState(user.seoVendorDetails.state || '')
            setStoreCity(user.seoVendorDetails.city || '')
            setStoreCountry(user.seoVendorDetails.country || '')
            setStoreContinent(user.seoVendorDetails.continent || '')
            setCopyWrite(user.seoVendorDetails.copywrite || '')
            setMetaTitle(user.seoVendorDetails.meta_title || '')
            setMetaDesc(user.seoVendorDetails.meta_desc || '')
            setWebsiteLink(user.seoVendorDetails.website_link || '')
            setAppStoreLink(user.seoVendorDetails.app_store_link || '')
            setPlayStoreLink(user.seoVendorDetails.play_store_link || '')
            // Set keywords
            const keywords = user.seoVendorDetails.key_words
                ? user.seoVendorDetails.key_words.split(',')
                    .map(keyword => keyword.trim()) // Trim whitespace
                    .filter(keyword => keyword) // Remove empty keywords
                    .map(keyword => ({ keyword })) // Convert to objects
                : [];
            setKeywords(keywords);
        }
    }, [user]);

    const removeKeyword = (index) => {
        setKeywords(keywords.filter((_, i) => i !== index));
    };


    const handleForm = async (event) => {
        event.preventDefault();

        let jsonData;

        try {
            const keywordsString = keywords.map(keywordObj => keywordObj.keyword).join(',');
            if (file) {
                const fileData = await readFileAsBase64(file);

                jsonData = {
                    file: fileData,
                    name: name,
                    storeState: storeState,
                    storeCity: storeCity,
                    storeCountry: storeCountry,
                    storeContinent: storeContinent,
                    copyWrite: copyWrite,
                    metaTitle: metaTitle,
                    metaDesc: metaDesc,
                    websiteLink: websiteLink,
                    appStoreLink: appStoreLink,
                    playStoreLink: playStoreLink,
                    keywords: keywordsString,
                    seoId: seoId
                };
            } else {
                jsonData = {
                    path: filePath,
                    name: name,
                    storeState: storeState,
                    storeCity: storeCity,
                    storeCountry: storeCountry,
                    storeContinent: storeContinent,
                    copyWrite: copyWrite,
                    metaTitle: metaTitle,
                    metaDesc: metaDesc,
                    websiteLink: websiteLink,
                    appStoreLink: appStoreLink,
                    playStoreLink: playStoreLink,
                    keywords: keywordsString,
                    seoId: seoId
                };
            }

            // console.log(jsonData)
            // return

            const response = await fetch(`${config.backEndBaseUrl}api/user/seo/update/${userId}?q=v`, {
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
                // resetForm();
            }

        } catch (error) {
            console.error('Error update data:', error);
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

    return (
        <>
            <ToastContainer />
            <div className="wg-box wg-box-container">
                <form className="form-new-product form-style-1" onSubmit={handleForm}>
                    <fieldset className="name">
                        <div className="body-title input_label">Name :</div>
                        <input className="flex-grow input_field" type="text" placeholder="Enter company name" value={name} onChange={(e) => setName(e.target.value)} />
                    </fieldset>
                    <fieldset className="name">
                        <div className="body-title address-title">Address:</div>
                        <div>
                            <input className="flex-grow mb-4 addr_inp address-input" type="text" placeholder="City" name="text" tabIndex="0" value={storeCity} onChange={(e) => setStoreCity(e.target.value)} />
                            <input className="flex-grow mb-4 addr_inp address-input" type="text" placeholder="State" name="text" tabIndex="0" value={storeState} onChange={(e) => setStoreState(e.target.value)} />
                            <input className="flex-grow mb-4 addr_inp address-input" type="text" placeholder="Country" name="text" tabIndex="0" value={storeCountry} onChange={(e) => setStoreCountry(e.target.value)} />
                            <input className="flex-grow addr_inp address-input" type="text" placeholder="Continent" name="text" tabIndex="0" value={storeContinent} onChange={(e) => setStoreContinent(e.target.value)} />
                        </div>
                    </fieldset>
                    <fieldset className="name">
                        <div className="body-title input_label">Website Link :</div>
                        <input className="flex-grow input_field" type="text" placeholder="Website Link" value={websiteLink} onChange={(e) => setWebsiteLink(e.target.value)}/>
                    </fieldset>
                    <fieldset className="name">
                        <div className="body-title input_label">App Store Link :</div>
                        <input className="flex-grow input_field" type="text" placeholder="App Store Link" value={appStoreLink} onChange={(e) => setAppStoreLink(e.target.value)}/>
                    </fieldset>
                    <fieldset className="name">
                        <div className="body-title input_label">Play Store Link :</div>
                        <input className="flex-grow input_field" type="text" placeholder="Play Store Link" value={playStoreLink} onChange={(e) => setPlayStoreLink(e.target.value)}/>
                    </fieldset>
                    <fieldset>
                        <div className="body-title input_label">Logo :</div>
                        <div className="upload-image flex-grow input_field">
                            <div className="item up-load">
                                <label className="uploadfile" htmlFor="myFile">
                                    <span className="icon">
                                        <i className="icon-upload-cloud"></i>
                                    </span>
                                    <span className="body-text">Drop your images here or select <span className="tf-color">click to browse</span></span>
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
                    <fieldset className="name pass_input_div">
                        <div className="body-title input_label">Copy write :</div>
                        <input className="flex-grow input_field pasInput" type="text" placeholder="Enter Company name" value={copyWrite} onChange={(e) => setCopyWrite(e.target.value)} />
                    </fieldset>
                    <fieldset className="name pass_input_div">
                        <div className="body-title input_label">Meta Title:</div>
                        <input className="flex-grow input_field pasInput" type="text" placeholder="Enter Meta title" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
                    </fieldset>
                    <fieldset className="name pass_input_div">
                        <div className="body-title input_label">Meta Description:</div>
                        <CKEditor
                            editor={ClassicEditor}
                            data={metaDesc}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setMetaDesc(data);
                            }}
                            config={{
                                placeholder: 'Meta Description..',
                                removePlugins: ['MediaEmbed']
                            }}
                        />
                    </fieldset>

                    <fieldset className="name">
                        <div className="body-title keywords-title">Set Keywords:</div>
                        <div className="custom-select-container">
                            <div className="keyword-input-container keyword-wrapper">
                                <input
                                    type="text"
                                    placeholder="Enter keywords"
                                    value={keywordInput}
                                    onChange={(e) => setKeywordInput(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="btn-success"
                                    onClick={addKeyword}
                                >
                                    Add
                                </button>
                            </div>
                            <div className="selected_categories">
                                {keywords.map((keyword, index) => (
                                    <div key={index} className='selectedCats'>
                                        <span>{keyword.keyword}</span>
                                        <AiOutlineClose
                                            className='icon'
                                            onClick={() => removeKeyword(index)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </fieldset>

                    <div className="bot from_btn_wrap">
                        <button type="submit" className="tf-button w208 h10 from_btn">Submit</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AboutSettings;
