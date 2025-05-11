import React, { useEffect, useRef, useState } from 'react';
import './UpdateStore.css';
import useArrowKeyDisable from '../../customhook/useArrowKeyDisable';
import { config } from '../../../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';

function ContactDetailsForm() {
    const inputRef1 = useRef(null);
    const inputRef2 = useRef(null);
    const inputRef3 = useRef(null);

    const [whatsappNumbers, setWhatsappNumbers] = useState([]);
    const [phoneNumbers, setPhoneNumbers] = useState([]);
    const [googleMapLinks, setGoogleMapLinks] = useState([]);
    const [gmails, setGmails] = useState([]);
    const [youtubeLinks, setYoutubeLinks] = useState([]);
    const [facebookLinks, setFacebookLinks] = useState([]);
    const [instagramLinks, setInstagramLinks] = useState([]);
    const [twitterLinks, setTwitterLinks] = useState([]);
    const [websiteLinks, setWebsiteLinks] = useState([]);
    const [upiLinks, setUpiLinks] = useState([]);
    const [others, setOthers] = useState([]);
    const { uid } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const mapDetailsToState = (details) => {
        const map = {
            whatsapp: setWhatsappNumbers,
            phone: setPhoneNumbers,
            google_map: setGoogleMapLinks,
            gmail: setGmails,
            youtube: setYoutubeLinks,
            facebook: setFacebookLinks,
            instagram: setInstagramLinks,
            twitter: setTwitterLinks,
            website: setWebsiteLinks,
            others: setOthers
        };

        details.forEach(detail => {
            const setState = map[detail.type];
            if (setState) {
                if (detail.type === 'others') {
                    setState(prev => [...prev, { title: detail.title, value: detail.value, isEnabled: detail.status === 1, isNew: false }]);
                } else {
                    setState(prev => [...prev, { value: detail.value, isEnabled: detail.status === 1, isNew: false }]);
                }
            }
        });

        Object.values(map).forEach(setState => {
            setState(prev => prev.length === 0 ? [{ value: '', isEnabled: true, isNew: true }] : prev);
        });
    };

    const handleAddField = (setField, field, isOther = false) => {
        if (isOther) {
            setField([...field, { title: '', value: '', isEnabled: true, isNew: true }]);
        } else {
            setField([...field, { value: '', isEnabled: true, isNew: true }]);
        }
    };

    const handleRemoveField = (setState, state, index) => {
        setState(state.filter((_, i) => i !== index));
    };

    const handleFieldChange = (setField, field, index, value, key = 'value') => {
        const newField = [...field];
        newField[index][key] = value;
        setField(newField);
    };

    const handleFieldToggle = (setField, field, index) => {
        const newField = [...field];
        newField[index].isEnabled = !newField[index].isEnabled;
        setField(newField);
    };

    const submitContactData = async (event) => {
        event.preventDefault();
        // setIsLoading(true);

        const contactData = {
            whatsappNumbers: whatsappNumbers.filter(item => item.value !== ''),
            phoneNumbers: phoneNumbers.filter(item => item.value !== ''),
            googleMapLinks: googleMapLinks.filter(item => item.value !== ''),
            gmails: gmails.filter(item => item.value !== ''),
            youtubeLinks: youtubeLinks.filter(item => item.value !== ''),
            facebookLinks: facebookLinks.filter(item => item.value !== ''),
            instagramLinks: instagramLinks.filter(item => item.value !== ''),
            twitterLinks: twitterLinks.filter(item => item.value !== ''),
            websiteLinks: websiteLinks.filter(item => item.value !== ''),
            others: others.filter(item => item.title !== '' && item.value !== ''),
            upiLinks: upiLinks.filter(item => item.value !== '')
        };

        // console.log(contactData)
        // return;

        try {
            const response = await fetch(`${config.backEndBaseUrl}api/store/details/update/${uid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contactData),
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
        } catch (error) {
            console.error('Error adding data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStore = async (uid) => {
        setIsLoading(true);
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
            if (result.status && result.data.details) {
                const details = result.data.details;

                // Initialize state for each type
                const whatsapp = [];
                const phone = [];
                const googleMap = [];
                const gmail = [];
                const youtube = [];
                const facebook = [];
                const instagram = [];
                const twitter = [];
                const website = [];
                const others = [];
                const upi = []; // Initialize UPI links array

                // Map details to the corresponding state
                details.forEach((detail) => {
                    const contactObject = {
                        value: detail.value,
                        isEnabled: detail.status === 1,
                        isNew: false,
                    };

                    switch (detail.type) {
                        case 'whatsapp':
                            whatsapp.push(contactObject);
                            break;
                        case 'phone':
                            phone.push(contactObject);
                            break;
                        case 'map':
                            googleMap.push(contactObject);
                            break;
                        case 'gmail':
                            gmail.push(contactObject);
                            break;
                        case 'youtube':
                            youtube.push(contactObject);
                            break;
                        case 'facebook':
                            facebook.push(contactObject);
                            break;
                        case 'instagram':
                            instagram.push(contactObject);
                            break;
                        case 'twitter':
                            twitter.push(contactObject);
                            break;
                        case 'website':
                            website.push(contactObject);
                            break;
                        case 'others':
                            others.push({
                                title: detail.title,
                                value: detail.value,
                                isEnabled: detail.status === 1,
                                isNew: false,
                            });
                            break;
                        case 'upi': // Handle UPI links
                            upi.push(contactObject);
                            break;
                        default:
                            break;
                    }
                });

                // Set state with the mapped data
                setWhatsappNumbers(whatsapp.length ? whatsapp : [{ value: '', isEnabled: true, isNew: true }]);
                setPhoneNumbers(phone.length ? phone : [{ value: '', isEnabled: true, isNew: true }]);
                setGoogleMapLinks(googleMap.length ? googleMap : [{ value: '', isEnabled: true, isNew: true }]);
                setGmails(gmail.length ? gmail : [{ value: '', isEnabled: true, isNew: true }]);
                setYoutubeLinks(youtube.length ? youtube : [{ value: '', isEnabled: true, isNew: true }]);
                setFacebookLinks(facebook.length ? facebook : [{ value: '', isEnabled: true, isNew: true }]);
                setInstagramLinks(instagram.length ? instagram : [{ value: '', isEnabled: true, isNew: true }]);
                setTwitterLinks(twitter.length ? twitter : [{ value: '', isEnabled: true, isNew: true }]);
                setWebsiteLinks(website.length ? website : [{ value: '', isEnabled: true, isNew: true }]);
                setOthers(others.length ? others : [{ title: '', value: '', isEnabled: true, isNew: true }]);
                setUpiLinks(upi.length ? upi : [{ value: '', isEnabled: true, isNew: true }]); // Set UPI links state
            }
        } catch (error) {
            console.error('Error fetching store details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStore(uid);
    }, [uid]);

    // Custom hooks
    useArrowKeyDisable(inputRef1);
    useArrowKeyDisable(inputRef2);
    useArrowKeyDisable(inputRef3);
    // _______
    return (
        <>
            <div className="wg-box wg-box-container">
                <ToastContainer />
                <form className="form-new-product form-style-1" onSubmit={submitContactData}>

                    {phoneNumbers.map((phone, index) => (
                        <fieldset key={index}>
                            <div className="body-title">Phone Number {index + 1}: </div>

                            <button className='remove-field' type="button" onClick={() => handleRemoveField(setPhoneNumbers, phoneNumbers, index)}> X </button>

                            <input ref={inputRef2} className="flex-grow" type="number" placeholder="Phone Number" value={phone.value} onChange={(e) => handleFieldChange(setPhoneNumbers, phoneNumbers, index, e.target.value)} />
                            <div>
                                <label className="switch">
                                    <input type="checkbox" checked={phone.isEnabled} onChange={() => handleFieldToggle(setPhoneNumbers, phoneNumbers, index)} />
                                    <span className="slider round"></span>
                                </label>
                            </div>

                        </fieldset>
                    ))}
                    <button type="button" className='Add-more bg-success text-light' onClick={() => handleAddField(setPhoneNumbers, phoneNumbers)}>Add Phone Number +</button>

                    {whatsappNumbers.map((whatsapp, index) => (
                        <fieldset key={index}>
                            <div className="body-title">WhatsApp Number {index + 1}: </div>
                            <button className='remove-field' type="button" onClick={() => handleRemoveField(setWhatsappNumbers, whatsappNumbers, index)}> X </button>
                            <input ref={inputRef1} className="flex-grow" type="number" placeholder="WhatsApp Number" value={whatsapp.value} onChange={(e) => handleFieldChange(setWhatsappNumbers, whatsappNumbers, index, e.target.value)} />
                            <div>
                                <label className="switch">
                                    <input type="checkbox" checked={whatsapp.isEnabled} onChange={() => handleFieldToggle(setWhatsappNumbers, whatsappNumbers, index)} />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </fieldset>
                    ))}
                    <button type="button" className='Add-more bg-success text-light' onClick={() => handleAddField(setWhatsappNumbers, whatsappNumbers)}>Add WhatsApp Number +</button>

                    {googleMapLinks.map((googleMapLink, index) => (
                        <fieldset key={index}>
                            <div className="body-title">Google Map Link {index + 1}: </div>

                            <button className='remove-field' type="button" onClick={() => handleRemoveField(setGoogleMapLinks, googleMapLinks, index)}> X </button>

                            <input ref={inputRef3} className="flex-grow" type="text" placeholder="Google Map Link" value={googleMapLink.value} onChange={(e) => handleFieldChange(setGoogleMapLinks, googleMapLinks, index, e.target.value)} />
                            <div>
                                <label className="switch">
                                    <input type="checkbox" checked={googleMapLink.isEnabled} onChange={() => handleFieldToggle(setGoogleMapLinks, googleMapLinks, index)} />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </fieldset>
                    ))}
                    <button type="button" className='Add-more bg-success text-light' onClick={() => handleAddField(setGoogleMapLinks, googleMapLinks)}>Add Google Map Link +</button>

                    {upiLinks.map((upiLink, index) => (
                        <fieldset key={index}>
                            <div className="body-title">UPI Link {index + 1}: </div>

                            <button className='remove-field' type="button" onClick={() => handleRemoveField(setUpiLinks, upiLinks, index)}> X </button>

                            <input className="flex-grow" type="text" placeholder="UPI Link" value={upiLink.value} onChange={(e) => handleFieldChange(setUpiLinks, upiLinks, index, e.target.value)} />
                            <div>
                                <label className="switch">
                                    <input type="checkbox" checked={upiLink.isEnabled} onChange={() => handleFieldToggle(setUpiLinks, upiLinks, index)} />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </fieldset>
                    ))}
                    <button type="button" className='Add-more bg-success text-light' onClick={() => handleAddField(setUpiLinks, upiLinks)}>Add UPI Link +</button>

                    {websiteLinks.map((websiteLink, index) => (
                        <fieldset key={index}>
                            <div className="body-title">Website Link {index + 1}: </div>

                            <button className='remove-field' type="button" onClick={() => handleRemoveField(setWebsiteLinks, websiteLinks, index)}> X </button>

                            <input className="flex-grow" type="text" placeholder="Website Link" value={websiteLink.value} onChange={(e) => handleFieldChange(setWebsiteLinks, websiteLinks, index, e.target.value)} />
                            <div>
                                <label className="switch">
                                    <input type="checkbox" checked={websiteLink.isEnabled} onChange={() => handleFieldToggle(setWebsiteLinks, websiteLinks, index)} />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </fieldset>
                    ))}
                    <button type="button" className='Add-more bg-success text-light' onClick={() => handleAddField(setWebsiteLinks, websiteLinks)}>Add Website Link +</button>

                    {gmails.map((gmail, index) => (
                        <fieldset key={index}>
                            <div className="body-title">Email {index + 1}: </div>

                            <button className='remove-field' type="button" onClick={() => handleRemoveField(setGmails, gmails, index)}> X </button>

                            <input className="flex-grow" type="email" placeholder="Email" value={gmail.value} onChange={(e) => handleFieldChange(setGmails, gmails, index, e.target.value)} />
                            <div>
                                <label className="switch">
                                    <input type="checkbox" checked={gmail.isEnabled} onChange={() => handleFieldToggle(setGmails, gmails, index)} />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </fieldset>
                    ))}
                    <button type="button" className='Add-more bg-success text-light' onClick={() => handleAddField(setGmails, gmails)}>Add Email +</button>

                    {youtubeLinks.map((youtubeLink, index) => (
                        <fieldset key={index}>
                            <div className="body-title">YouTube Link {index + 1}: </div>

                            <button className='remove-field' type="button" onClick={() => handleRemoveField(setYoutubeLinks, youtubeLinks, index)}> X </button>

                            <input className="flex-grow" type="text" placeholder="YouTube Link" value={youtubeLink.value} onChange={(e) => handleFieldChange(setYoutubeLinks, youtubeLinks, index, e.target.value)} />
                            <div>
                                <label className="switch">
                                    <input type="checkbox" checked={youtubeLink.isEnabled} onChange={() => handleFieldToggle(setYoutubeLinks, youtubeLinks, index)} />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </fieldset>
                    ))}
                    <button type="button" className='Add-more bg-success text-light' onClick={() => handleAddField(setYoutubeLinks, youtubeLinks)}>Add YouTube Link +</button>

                    {instagramLinks.map((instagramLink, index) => (
                        <fieldset key={index}>
                            <div className="body-title">Instagram Link {index + 1}: </div>

                            <button className='remove-field' type="button" onClick={() => handleRemoveField(setInstagramLinks, instagramLinks, index)}> X </button>

                            <input className="flex-grow" type="text" placeholder="Instagram Link" value={instagramLink.value} onChange={(e) => handleFieldChange(setInstagramLinks, instagramLinks, index, e.target.value)} />
                            <div>
                                <label className="switch">
                                    <input type="checkbox" checked={instagramLink.isEnabled} onChange={() => handleFieldToggle(setInstagramLinks, instagramLinks, index)} />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </fieldset>
                    ))}
                    <button type="button" className='Add-more bg-success text-light' onClick={() => handleAddField(setInstagramLinks, instagramLinks)}>Add Instagram Link +</button>

                    {facebookLinks.map((facebookLink, index) => (
                        <fieldset key={index}>
                            <div className="body-title">Facebook Link {index + 1}: </div>

                            <button className='remove-field' type="button" onClick={() => handleRemoveField(setFacebookLinks, facebookLinks, index)}> X </button>

                            <input className="flex-grow" type="text" placeholder="Facebook Link" value={facebookLink.value} onChange={(e) => handleFieldChange(setFacebookLinks, facebookLinks, index, e.target.value)} />
                            <div>
                                <label className="switch">
                                    <input type="checkbox" checked={facebookLink.isEnabled} onChange={() => handleFieldToggle(setFacebookLinks, facebookLinks, index)} />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </fieldset>
                    ))}
                    <button type="button" className='Add-more bg-success text-light' onClick={() => handleAddField(setFacebookLinks, facebookLinks)}>Add Facebook Link +</button>

                    {twitterLinks.map((twitterLink, index) => (
                        <fieldset key={index}>
                            <div className="body-title">Twitter Link {index + 1}: </div>

                            <button className='remove-field' type="button" onClick={() => handleRemoveField(setTwitterLinks, twitterLinks, index)}> X </button>

                            <input className="flex-grow" type="text" placeholder="Twitter Link" value={twitterLink.value} onChange={(e) => handleFieldChange(setTwitterLinks, twitterLinks, index, e.target.value)} />
                            <div>
                                <label className="switch">
                                    <input type="checkbox" checked={twitterLink.isEnabled} onChange={() => handleFieldToggle(setTwitterLinks, twitterLinks, index)} />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </fieldset>
                    ))}
                    <button type="button" className='Add-more bg-success text-light' onClick={() => handleAddField(setTwitterLinks, twitterLinks)}>Add Twitter Link +</button>

                    {others.map((other, index) => (
                        <fieldset key={index}>
                            <div className="body-title">Other Link {index + 1}: </div>

                            <button className='remove-field' type="button" onClick={() => handleRemoveField(setOthers, others, index)}> X </button>

                            <input className="flex-grow" type="text" placeholder="Other Title" value={other.title} onChange={(e) => handleFieldChange(setOthers, others, index, e.target.value, 'title')} />
                            <input className="flex-grow" type="text" placeholder="Other Link" value={other.value} onChange={(e) => handleFieldChange(setOthers, others, index, e.target.value)} />
                            <div>
                                <label className="switch">
                                    <input type="checkbox" checked={other.isEnabled} onChange={() => handleFieldToggle(setOthers, others, index)} />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </fieldset>
                    ))}
                    <button type="button" className='Add-more bg-success text-light' onClick={() => handleAddField(setOthers, others, true)}>Add Other Link +</button>

                    <div className="bot">
                        <button className="tf-button w208 mx-auto" type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default ContactDetailsForm;