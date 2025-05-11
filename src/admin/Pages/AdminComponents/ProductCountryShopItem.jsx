import React from 'react';
import { Link } from 'react-router-dom';
import { config } from '../../../config';


function ProductCountryShopItem() {
    const { frontEndBaseUrl } = config;

    return (
        <>
            <div className="col-12 mb-20">
                <div className="wg-box h-full">
                    <h3>Product item</h3>
                    <div className="row">
                        <div className="col-12 mb-20">
                            <div className="product-item">
                                <div className="image">
                                    <img src={`${frontEndBaseUrl}adminAssets/images/products/1.png`} alt="product_img" />
                                </div>
                                <div className="flex items-center justify-between flex-grow">
                                    <div className="name">
                                        <Link to="product-list.html" className="body-title-2">Patimax Fragrance Long...</Link>
                                        <div className="text-tiny mt-3">100 Items</div>
                                    </div>
                                    <div>
                                        <div className="text-tiny mb-3">Coupon Code</div>
                                        <div className="body-text">Sflat</div>
                                    </div>
                                    <div className="country">
                                        <img src={`${frontEndBaseUrl}adminAssets/images/country/2.png`} alt="country_img" />
                                    </div>
                                    <div>
                                        <div className="body-title-2 mb-3">-15%</div>
                                        <div className="text-tiny">$27.00</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 mb-20">
                <div className="wg-box h-full">
                    <h3>Country item</h3>
                    <div className="row">
                        <div className="col-12 mb-20">
                            <div className="country-item">
                                <div className="image">
                                    <img src={`${frontEndBaseUrl}adminAssets/images/country/6.png`} alt="country_img" />
                                </div>
                                <div className="flex-grow flex items-center justify-between">
                                    <Link to="countries.html" className="body-text name">Turkish Flag</Link>
                                    <div className="box-icon-trending up">
                                        <i className="icon-trending-up"></i>
                                    </div>
                                    <div className="body-text number">6,972</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 mb-20">
                <div className="wg-box h-full">
                    <h3>Shop item</h3>
                    <div className="row">
                        <div className="col-12 mb-20">
                            <div className="shop-item">
                                <div className="image">
                                    <img src={`${frontEndBaseUrl}adminAssets/images/shop/1.png`} alt="shop_img" />
                                </div>
                                <div className="flex-grow flex items-center justify-between gap20">
                                    <div>
                                        <Link to="#" className="body-text name">Robert</Link>
                                        <div className="text-tiny mt-4">73 Purchases</div>
                                    </div>
                                    <div className="body-text">Kitchen, Pets</div>
                                    <div className="body-text">$1,000</div>
                                    <div className="flex items-center justify-between gap10">
                                        <div className="progress-level-bar">
                                            <span data-progress="29" data-max="70" className="" style={{ "width": "41.4286%" }}></span>
                                        </div>
                                        <div className="text-tiny">100%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductCountryShopItem