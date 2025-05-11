import React from 'react';
import { Link } from 'react-router-dom';
import { config } from '../../../config';


function BoxIconBreadcrumdGalleryItem() {
    const { frontEndBaseUrl } = config;

    return (
        <>
            <div className="col-xl-4 mb-20">
                <div className="wg-box h-full">
                    <h3>Box icon</h3>
                    <div className="">
                        <p>Change number up</p>
                        <div className="box-icon-trending up">
                            <i className="icon-trending-up"></i>
                            <div className="body-title number">1.56%</div>
                        </div>
                        <div className="flex items-center gap10">
                            <h4>$37,802</h4>
                            <div className="box-icon-trending up">
                                <i className="icon-trending-up"></i>
                                <div className="body-title number">1.56%</div>
                            </div>
                            <div className="text-tiny">since last weekend</div>
                        </div>
                    </div>
                    <div className="">
                        <p>No-change number</p>
                        <div className="box-icon-trending">
                            <i className="icon-trending-up"></i>
                            <div className="body-title number">0.00%</div>
                        </div>
                        <div className="flex items-center gap10">
                            <h4>$37,802</h4>
                            <div className="box-icon-trending">
                                <i className="icon-trending-up"></i>
                                <div className="body-title number">0.00%</div>
                            </div>
                            <div className="text-tiny">since last weekend</div>
                        </div>
                    </div>
                    <div className="">
                        <p>Change number down</p>
                        <div className="box-icon-trending down">
                            <i className="icon-trending-down"></i>
                            <div className="body-title number">1.56%</div>
                        </div>
                        <div className="flex items-center gap10">
                            <h4>$37,802</h4>
                            <div className="box-icon-trending down">
                                <i className="icon-trending-down"></i>
                                <div className="body-title number">1.56%</div>
                            </div>
                            <div className="text-tiny">since last weekend</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-4 mb-20">
                <div className="wg-box h-full">
                    <h3>Breadcrumb</h3>
                    <ul className="breadcrumbs flex items-center flex-wrap justify-start gap10">
                        <li>
                            <Link to="/admin/home"><div className="text-tiny">Dashboard</div></Link>
                        </li>
                        <li>
                            <i className="icon-chevron-right"></i>
                        </li>
                        <li>
                            <Link to="#"><div className="text-tiny">Ecommerce</div></Link>
                        </li>
                        <li>
                            <i className="icon-chevron-right"></i>
                        </li>
                        <li>
                            <div className="text-tiny">Add product</div>
                        </li>
                    </ul>
                    <ul className="breadcrumbs flex items-center flex-wrap justify-start gap10">
                        <li>
                            <Link to="/admin/home"><div className="text-tiny">Dashboard</div></Link>
                        </li>
                        <li>
                            <i className="icon-chevron-right"></i>
                        </li>
                        <li>
                            <div className="text-tiny">Setting</div>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="col-xl-4 mb-20">
                <div className="wg-box h-full">
                    <h3>Gallery item</h3>
                    <div className="row">
                        <div className="col-xl-12 mb-20">
                            <div className="flex">
                                <Link to="#" className="gallery-item">
                                    <div className="image">
                                        <img src={`${frontEndBaseUrl}adminAssets/images/images-section/all-gallery-4.png`} alt="gallery_img" />
                                    </div>
                                    <div className="text-tiny">Feed for dogs and cats – Brit</div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BoxIconBreadcrumdGalleryItem