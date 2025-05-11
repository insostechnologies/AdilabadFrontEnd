import React from 'react'


function AlertButtonBadges() {

    return (
        <>
            <div className="col-xl-4 mb-20">
                <div className="wg-box h-full">
                    <h3>Alerts</h3>
                    <div className="block-warning">
                        <i className="icon-alert-octagon"></i>
                        <div className="body-title-2">Your license is invalid. Please activate your license!</div>
                    </div>
                    <div className="block-warning w-full">
                        <i className="icon-alert-octagon"></i>
                        <div className="body-title-2">Your license is invalid. Please activate your license!</div>
                    </div>
                    <div className="block-warning type-main">
                        <i className="icon-alert-octagon"></i>
                        <div className="body-title-2">Blacklist contact requests if it includes those keywords in the content field (separate by comma).</div>
                    </div>
                    <div className="block-warning type-main w-full">
                        <i className="icon-alert-octagon"></i>
                        <div className="body-title-2">Blacklist contact requests if it includes those keywords in the content field (separate by comma).</div>
                    </div>
                </div>
            </div>
            <div className="col-xl-4 mb-20">
                <div className="wg-box h-full">
                    <h3>Button</h3>
                    <div className="flex items-center gap10 flex-wrap">
                        <p>Use class .tf-button</p>
                        <button className="tf-button" style={{ "padding": "0 8px", "height": "35px", "fontSize": "12px" }}>Add product</button>
                    </div>
                    <div className="flex items-center gap10 flex-wrap">
                        <p>Use .style-1 in class .btn class to change style 1</p>
                        <button className="tf-button style-1" style={{ "padding": "0 8px", "height": "35px", "fontSize": "12px" }}>Add product</button>
                    </div>
                    <div className="flex items-center gap10 flex-wrap">
                        <p>Use .style-2 in class .btn class to change style 2</p>
                        <button className="tf-button style-2" style={{ "padding": "0 8px", "height": "35px", "fontSize": "12px" }}>Add product</button>
                    </div>
                    <div className="flex items-center gap10 flex-wrap">
                        <p>Button funtion</p>
                        <div className="tf-button-funtion">
                            <i className="icon-upload-cloud"></i>
                            <div className="body-title">Upload</div>
                        </div>
                    </div>
                    <div className="flex items-center gap10 flex-wrap">
                        <p>Radio buttons</p>
                        <div className="radio-buttons">
                            <div className="item" >
                                <input className="" type="radio" name="admin-language" id="admin-language1" checked="" />
                                <label className="" for="admin-language1"><span className="body-title-2" style={{ "fontSize": "10px" }}>Left to Right</span></label>
                            </div>
                            <div className="item">
                                <input className="" type="radio" name="admin-language" id="admin-language2" />
                                <label className="" for="admin-language2"><span className="body-title-2" style={{ "fontSize": "10px" }}>Right to Left</span></label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-4 mb-20">
                <div className="wg-box h-full">
                    <h3>Badges</h3>
                    <div className="flex items-center gap10 flex-wrap">
                        <p>Use class .block-not-available</p>
                        <div className="block-not-available">Not Available</div>
                    </div>
                    <div className="flex items-center gap10 flex-wrap">
                        <p>Use class .block-available</p>
                        <div className="block-available">Available</div>
                    </div>
                    <div className="flex items-center gap10 flex-wrap">
                        <p>Use class .block-published</p>
                        <div className="block-published">Published</div>
                    </div>
                    <div className="flex items-center gap10 flex-wrap">
                        <p>Use class .block-pending</p>
                        <div className="block-pending">Pending</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AlertButtonBadges