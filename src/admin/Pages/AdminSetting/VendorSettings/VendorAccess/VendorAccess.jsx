import React, { useState, useEffect } from 'react';
import './VendorAccess.css';
import { config } from '../../../../../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function VendorAccess({ permissions }) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        storeDetails: permissions.store_details === '1',
        contactDetails: permissions.contact_social_details === '1',
        imagesAll: permissions.img_all === '1',
        imagesBanner: permissions.img_banner === '1',
        imagesGallery: permissions.img_gallery === '1',
        imagesCover: permissions.img_cover === '1',
        imagesLogo: permissions.img_logo === '1',
        imagesVideo: permissions.img_video === '1',
        offers: permissions.offers === '1',
        products: permissions.product_and_service === '1',
        seoDetails: permissions.seo_details === '1',
        keyWords: permissions.key_words === '1',
        deliveryCharges: permissions.delivery_charge === '1',
        gstCharges: permissions.gst_charges === '1',
        sendNotification: permissions.send_notification === '1',
        totalViews: permissions.total_views === '1',
        followers: permissions.followers_count === '1',
        calls: permissions.call_count === '1',
        chat: permissions.chat_count === '1',
        share: permissions.share === '1',
    });

    useEffect(() => {
        if (permissions) {
            setFormData({
                storeDetails: permissions.store_details === '1',
                contactDetails: permissions.contact_social_details === '1',
                imagesAll: permissions.img_all === '1',
                imagesBanner: permissions.img_banner === '1',
                imagesGallery: permissions.img_gallery === '1',
                imagesCover: permissions.img_cover === '1',
                imagesLogo: permissions.img_logo === '1',
                imagesVideo: permissions.img_video === '1',
                offers: permissions.offers === '1',
                products: permissions.product_and_service === '1',
                seoDetails: permissions.seo_details === '1',
                keyWords: permissions.key_words === '1',
                deliveryCharges: permissions.delivery_charge === '1',
                gstCharges: permissions.gst_charges === '1',
                sendNotification: permissions.send_notification === '1',
                totalViews: permissions.total_views === '1',
                followers: permissions.followers_count === '1',
                calls: permissions.call_count === '1',
                chat: permissions.chat_count === '1',
                share: permissions.share === '1',
            });
        }
    }, [permissions]);

    const handleChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prevData) => {
            if (name === 'imagesAll') {
                return {
                    ...prevData,
                    imagesAll: checked,
                    imagesBanner: checked,
                    imagesGallery: checked,
                    imagesCover: checked,
                    imagesLogo: checked,
                    imagesVideo: checked,
                };
            }
            return {
                ...prevData,
                [name]: checked,
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const updatedPermissions = {
                ...permissions,
                store_details: formData.storeDetails ? '1' : '0',
                contact_social_details: formData.contactDetails ? '1' : '0',
                img_all: formData.imagesAll ? '1' : '0',
                img_banner: formData.imagesBanner ? '1' : '0',
                img_gallery: formData.imagesGallery ? '1' : '0',
                img_cover: formData.imagesCover ? '1' : '0',
                img_logo: formData.imagesLogo ? '1' : '0',
                img_video: formData.imagesVideo ? '1' : '0',
                offers: formData.offers ? '1' : '0',
                product_and_service: formData.products ? '1' : '0',
                seo_details: formData.seoDetails ? '1' : '0',
                key_words: formData.keyWords ? '1' : '0',
                delivery_charge: formData.deliveryCharges ? '1' : '0',
                gst_charges: formData.gstCharges ? '1' : '0',
                send_notification: formData.sendNotification ? '1' : '0',
                total_views: formData.totalViews ? '1' : '0',
                followers_count: formData.followers ? '1' : '0',
                call_count: formData.calls ? '1' : '0',
                chat_count: formData.chat ? '1' : '0',
                share: formData.share ? '1' : '0',
            };

            const response = await fetch(`${config.backEndBaseUrl}api/store/permissions?t=v`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedPermissions),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (!result.status) {
                throw new Error('Failed to update vendor access');
            }

            toast.success('Vendor access updated successfully', { position: 'top-center' });

        } catch (error) {
            console.error('Error updating vendor access:', error);
            toast.error('Failed to update vendor access', { position: 'top-center' });

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="wg-box wg-box-container">
                <form className="form-new-product form-style-1" onSubmit={handleSubmit}>
                    <fieldset>
                        <div className="body-title">Store Details :</div>
                        <label className="switch">
                            <input type="checkbox" name="storeDetails" checked={formData.storeDetails} onChange={handleChange} />
                            <span className="slider round"></span>
                        </label>
                    </fieldset>
                    <fieldset>
                        <div className="body-title">Contact And Social Details :</div>
                        <label className="switch">
                            <input type="checkbox" name="contactDetails" checked={formData.contactDetails} onChange={handleChange} />
                            <span className="slider round"></span>
                        </label>
                    </fieldset>
                    <fieldset>
                        <div className="body-title">Images :</div>
                        <div>
                            <div className='switch-container'>
                                <div className="body-title">All :</div>
                                <label className="switch">
                                    <input type="checkbox" name="imagesAll" checked={formData.imagesAll} onChange={handleChange} />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            <div className='switch-container'>
                                <div className="body-title">Banner :</div>
                                <label className="switch">
                                    <input type="checkbox" name="imagesBanner" checked={formData.imagesBanner} onChange={handleChange} />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            <div className='switch-container'>
                                <div className="body-title">Gallery :</div>
                                <label className="switch">
                                    <input type="checkbox" name="imagesGallery" checked={formData.imagesGallery} onChange={handleChange} />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            <div className='switch-container'>
                                <div className="body-title">Cover :</div>
                                <label className="switch">
                                    <input type="checkbox" name="imagesCover" checked={formData.imagesCover} onChange={handleChange} />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            <div className='switch-container'>
                                <div className="body-title">Logo :</div>
                                <label className="switch">
                                    <input type="checkbox" name="imagesLogo" checked={formData.imagesLogo} onChange={handleChange} />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            <div className='switch-container'>
                                <div className="body-title">Video :</div>
                                <label className="switch">
                                    <input type="checkbox" name="imagesVideo" checked={formData.imagesVideo} onChange={handleChange} />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <div className="body-title">Offers :</div>
                        <label className="switch">
                            <input type="checkbox" name="offers" checked={formData.offers} onChange={handleChange} />
                            <span className="slider round"></span>
                        </label>
                    </fieldset>
                    <fieldset>
                        <div className="body-title">Product & Service :</div>
                        <label className="switch">
                            <input type="checkbox" name="products" checked={formData.products} onChange={handleChange} />
                            <span className="slider round"></span>
                        </label>
                    </fieldset>
                    <fieldset>
                        <div className="body-title">SEO Details :</div>
                        <label className="switch">
                            <input type="checkbox" name="seoDetails" checked={formData.seoDetails} onChange={handleChange} />
                            <span className="slider round"></span>
                        </label>
                    </fieldset>
                    {/* <fieldset>
                        <div className="body-title">Key Words :</div>
                        <label className="switch">
                            <input type="checkbox" name="keyWords" checked={formData.keyWords} onChange={handleChange} />
                            <span className="slider round"></span>
                        </label>
                    </fieldset> */}
                    <fieldset>
                        <div className="body-title">Delivery Charges :</div>
                        <label className="switch">
                            <input type="checkbox" name="deliveryCharges" checked={formData.deliveryCharges} onChange={handleChange} />
                            <span className="slider round"></span>
                        </label>
                    </fieldset>
                    <fieldset>
                        <div className="body-title">Gst Charges :</div>
                        <label className="switch">
                            <input type="checkbox" name="gstCharges" checked={formData.gstCharges} onChange={handleChange} />
                            <span className="slider round"></span>
                        </label>
                    </fieldset>
                    <fieldset>
                        <div className="body-title">Send Notification :</div>
                        <label className="switch">
                            <input type="checkbox" name="sendNotification" checked={formData.sendNotification} onChange={handleChange} />
                            <span className="slider round"></span>
                        </label>
                    </fieldset>
                    <fieldset>
                        <div className="body-title">Total Views :</div>
                        <label className="switch">
                            <input type="checkbox" name="totalViews" checked={formData.totalViews} onChange={handleChange} />
                            <span className="slider round"></span>
                        </label>
                    </fieldset>
                    <fieldset>
                        <div className="body-title">Followers :</div>
                        <label className="switch">
                            <input type="checkbox" name="followers" checked={formData.followers} onChange={handleChange} />
                            <span className="slider round"></span>
                        </label>
                    </fieldset>
                    <fieldset>
                        <div className="body-title">Calls :</div>
                        <label className="switch">
                            <input type="checkbox" name="calls" checked={formData.calls} onChange={handleChange} />
                            <span className="slider round"></span>
                        </label>
                    </fieldset>
                    <fieldset>
                        <div className="body-title">Chat :</div>
                        <label className="switch">
                            <input type="checkbox" name="chat" checked={formData.chat} onChange={handleChange} />
                            <span className="slider round"></span>
                        </label>
                    </fieldset>
                    <fieldset>
                        <div className="body-title">Share :</div>
                        <label className="switch">
                            <input type="checkbox" name="share" checked={formData.share} onChange={handleChange} />
                            <span className="slider round"></span>
                        </label>
                    </fieldset>

                    <div className="bot">
                        <button type="submit" className="tf-button w208 h10" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default VendorAccess;
