import React from 'react';
import { config } from '../../../config';


function AddImg() {
    const { frontEndBaseUrl } = config;

    return (
        <>
            <div className="col-12 mb-20">
                <div className="wg-box">
                    <h3>Add image</h3>
                    <div className="row">
                        <div className="col-12 mb-20">
                            <div className="upload-image mb-16">
                                <div className="item">
                                    <img src={`${frontEndBaseUrl}adminAssets/images/images-section/gallery-1.png`} alt="gallery_img" />
                                </div>
                                <div className="item">
                                    <img src={`${frontEndBaseUrl}adminAssets/images/images-section/gallery-2.png`} alt="gallery_img" />
                                </div>
                                <div className="item">
                                    <img src={`${frontEndBaseUrl}adminAssets/images/images-section/gallery-3.png`} alt="gallery_img" />
                                </div>
                                <div className="item">
                                    <img src={`${frontEndBaseUrl}adminAssets/images/images-section/gallery-4.png`} alt="gallery_img" />
                                </div>
                                <div className="item up-load">
                                    <label className="uploadfile" for="myFile">
                                        <span className="icon">
                                            <i className="icon-upload-cloud"></i>
                                        </span>
                                        <span className="text-tiny">Drop your images here or select <span className="tf-color">click to browse</span></span>
                                        <input type="file" id="myFile" name="filename" />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddImg
