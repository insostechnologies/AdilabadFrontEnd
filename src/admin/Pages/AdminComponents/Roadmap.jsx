import React from 'react';


function Roadmap() {
    return (
        <>
            <div className="col-12">
                <div className="wg-box h-full">
                    <h3>Roadmap</h3>
                    <div className="road-map">
                        <div className="road-map-item active">
                            <div className="icon"><i className="icon-check"></i></div>
                            <h6>Receiving orders</h6>
                            <div className="body-text">05:43 AM</div>
                        </div>
                        <div className="road-map-item active">
                            <div className="icon"><i className="icon-check"></i></div>
                            <h6>Order processing</h6>
                            <div className="body-text">01:21 PM</div>
                        </div>
                        <div className="road-map-item active">
                            <div className="icon"><i className="icon-check"></i></div>
                            <h6>Being delivered</h6>
                            <div className="body-text">Processing</div>
                        </div>
                        <div className="road-map-item">
                            <div className="icon"><i className="icon-check"></i></div>
                            <h6>Delivered</h6>
                            <div className="body-text">Pending</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Roadmap