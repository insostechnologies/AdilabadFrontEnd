import React from 'react'
import { Link } from 'react-router-dom';
import { config } from '../../../config';



function ChartDropdowns() {
    const { frontEndBaseUrl } = config;
    
    return (
        <>
            <div className="col-12 mb-20">
                <div className="wg-box">
                    <h3>Chart</h3>
                    <div className="row">
                        <div className="col-xl-6 mb-20">
                            <div>
                                <h5 className="mb-16">Chart default</h5>
                                <div className="wrap-chart">
                                    <div id="line-chart-1"></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 mb-20">
                            <div>
                                <h5 className="mb-16">Chart bar</h5>
                                <div className="wrap-chart">
                                    <div id="line-chart-6"></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 mb-20">
                            <div>
                                <h5 className="mb-16">Chart area</h5>
                                <div className="wrap-chart">
                                    <div id="line-chart-7"></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 mb-20">
                            <div>
                                <h5 className="mb-16">Chart bar two column</h5>
                                <div className="wrap-chart">
                                    <div id="line-chart-14"></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 mb-20">
                            <div>
                                <h5 className="mb-16">Chart bar full column</h5>
                                <div className="wrap-chart">
                                    <div id="line-chart-18"></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 mb-20">
                            <div>
                                <h5 className="mb-16">Chart line</h5>
                                <div className="wrap-chart">
                                    <div id="line-chart-15"></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 mb-20">
                            <div>
                                <h5 className="mb-16">Chart half donut</h5>
                                <div className="wrap-chart">
                                    <div id="line-chart-9"></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 mb-20">
                            <div>
                                <h5 className="mb-16">Chart donut</h5>
                                <div className="flex justify-center">
                                    <div id="morris-donut-1"></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 mb-20">
                            <div>
                                <h5 className="mb-16">Chart map</h5>
                                <div id="usa-vectormap"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 mb-20">
                <div className="wg-box">
                    <h3>Dropdowns</h3>
                    <div className="row">
                        <div className="col-xl-4 mb-20">
                            <div>
                                <h6 className="mb-10">Select has image</h6>
                                <div className="flex items-center gap10 flex-wrap">
                                    <p>Use &lt;select&gt; and class .image-select.no-text</p>
                                    <select className="image-select no-text">
                                        <option data-thumbnail={`${frontEndBaseUrl}adminAssets/images/country/1.png`}>ENG</option>
                                        <option data-thumbnail={`${frontEndBaseUrl}adminAssets/images/country/9.png`}>VIE</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 mb-20">
                            <div>
                                <h6 className="mb-10">Dropdowns has content</h6>
                                <div className="flex items-center gap10 flex-wrap">
                                    <p>Dropdown default</p>
                                    <div className="popup-wrap noti type-header">
                                        <div className="dropdown">
                                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                <span className="item">
                                                    <span className="text-tiny">1</span>
                                                    <i className="icon-bell"></i>
                                                </span>
                                            </button>
                                            <ul className="dropdown-menu has-content" aria-labelledby="dropdownButton1" >
                                                <li>
                                                    <h6>Message</h6>
                                                </li>
                                                <li>
                                                    <div className="noti-item w-full wg-user active">
                                                        <div className="image">
                                                            <img src={`${frontEndBaseUrl}adminAssets/images/avatar/user-11.png`} alt="avatar_img" />
                                                        </div>
                                                        <div className="flex-grow">
                                                            <div className="flex items-center justify-between">
                                                                <Link to="#" className="body-title">Cameron Williamson</Link>
                                                                <div className="time">10:13 PM</div>
                                                            </div>
                                                            <div className="text-tiny">Hello?</div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="noti-item w-full wg-user active">
                                                        <div className="image">
                                                            <img src={`${frontEndBaseUrl}adminAssets/images/avatar/user-12.png`} alt="avatar_img" />
                                                        </div>
                                                        <div className="flex-grow">
                                                            <div className="flex items-center justify-between">
                                                                <Link to="#" className="body-title">Ralph Edwards</Link>
                                                                <div className="time">10:13 PM</div>
                                                            </div>
                                                            <div className="text-tiny">Are you there?  interested i this...</div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="noti-item w-full wg-user active">
                                                        <div className="image">
                                                            <img src={`${frontEndBaseUrl}adminAssets/images/avatar/user-13.png`} alt="avatar_img" />
                                                        </div>
                                                        <div className="flex-grow">
                                                            <div className="flex items-center justify-between">
                                                                <Link to="#" className="body-title">Eleanor Pena</Link>
                                                                <div className="time">10:13 PM</div>
                                                            </div>
                                                            <div className="text-tiny">Interested in this loads?</div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="noti-item w-full wg-user active">
                                                        <div className="image">
                                                            <img src={`${frontEndBaseUrl}adminAssets/images/avatar/user-11.png`} alt="avatar_img" />
                                                        </div>
                                                        <div className="flex-grow">
                                                            <div className="flex items-center justify-between">
                                                                <Link to="#" className="body-title">Jane Cooper</Link>
                                                                <div className="time">10:13 PM</div>
                                                            </div>
                                                            <div className="text-tiny">Okay...Do we have a deal?</div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li><Link to="#" className="tf-button w-full">View all</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap10 flex-wrap">
                                    <p>Dropdown end : add class .dropdown-menu-end in ul.dropdown-menu</p>
                                    <div className="popup-wrap noti type-header">
                                        <div className="dropdown">
                                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownButton2" data-bs-toggle="dropdown" aria-expanded="false">
                                                <span className="item">
                                                    <span className="text-tiny">1</span>
                                                    <i className="icon-bell"></i>
                                                </span>
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end has-content" aria-labelledby="dropdownButton2" >
                                                <li>
                                                    <h6>Message</h6>
                                                </li>
                                                <li>
                                                    <div className="noti-item w-full wg-user active">
                                                        <div className="image">
                                                            <img src={`${frontEndBaseUrl}adminAssets/images/avatar/user-11.png`} alt="avatar_img" />
                                                        </div>
                                                        <div className="flex-grow">
                                                            <div className="flex items-center justify-between">
                                                                <Link to="#" className="body-title">Cameron Williamson</Link>
                                                                <div className="time">10:13 PM</div>
                                                            </div>
                                                            <div className="text-tiny">Hello?</div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="noti-item w-full wg-user active">
                                                        <div className="image">
                                                            <img src={`${frontEndBaseUrl}adminAssets/images/avatar/user-12.png`} alt="avatar_img" />
                                                        </div>
                                                        <div className="flex-grow">
                                                            <div className="flex items-center justify-between">
                                                                <Link to="#" className="body-title">Ralph Edwards</Link>
                                                                <div className="time">10:13 PM</div>
                                                            </div>
                                                            <div className="text-tiny">Are you there?  interested i this...</div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="noti-item w-full wg-user active">
                                                        <div className="image">
                                                            <img src={`${frontEndBaseUrl}adminAssets/images/avatar/user-13.png`} alt="avatar_img" />
                                                        </div>
                                                        <div className="flex-grow">
                                                            <div className="flex items-center justify-between">
                                                                <Link to="#" className="body-title">Eleanor Pena</Link>
                                                                <div className="time">10:13 PM</div>
                                                            </div>
                                                            <div className="text-tiny">Interested in this loads?</div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="noti-item w-full wg-user active">
                                                        <div className="image">
                                                            <img src={`${frontEndBaseUrl}adminAssets/images/avatar/user-11.png`} alt="avatar_img" />
                                                        </div>
                                                        <div className="flex-grow">
                                                            <div className="flex items-center justify-between">
                                                                <Link to="#" className="body-title">Jane Cooper</Link>
                                                                <div className="time">10:13 PM</div>
                                                            </div>
                                                            <div className="text-tiny">Okay...Do we have a deal?</div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li><Link to="#" className="tf-button w-full">View all</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 mb-20">
                            <div>
                                <h6 className="mb-10">More</h6>
                                <div className="flex items-center gap10 flex-wrap">
                                    <p>Dropdown more</p>
                                    <div className="dropdown default">
                                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <span className="icon-more"><i className="icon-more-horizontal"></i></span>
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-end">
                                            <li>
                                                <Link to="javascript:void(0);">This Week</Link>
                                            </li>
                                            <li>
                                                <Link to="javascript:void(0);">Last Week</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 mb-20">
                            <div>
                                <h6 className="mb-10">View all</h6>
                                <div className="flex items-center gap10 flex-wrap">
                                    <p>Dropdown view all</p>
                                    <div className="dropdown default">
                                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <span className="view-all">View all<i className="icon-chevron-down"></i></span>
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-end">
                                            <li>
                                                <Link to="javascript:void(0);">3 days</Link>
                                            </li>
                                            <li>
                                                <Link to="javascript:void(0);">7 days</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 mb-20">
                            <div>
                                <h6 className="mb-10">Sort</h6>
                                <div className="flex items-center gap10 flex-wrap">
                                    <p>Use &lt;select&gt; and class .style-default</p>
                                    <div className="select style-default">
                                        <select className="">
                                            <option>Sort</option>
                                            <option>Name</option>
                                            <option>Day</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 mb-20">
                            <div>
                                <h6 className="mb-10">Box dropdown no select</h6>
                                <div className="dropdown default style-box">
                                    <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <span className="view-all">Week<i className="icon-chevron-down"></i></span>
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <Link to="javascript:void(0);">Month</Link>
                                        </li>
                                        <li>
                                            <Link to="javascript:void(0);">Year</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 mb-20">
                            <div>
                                <h6 className="mb-10">Box dropdown select</h6>
                                <div className="select">
                                    <select className="">
                                        <option>EU - 44</option>
                                        <option>EU - 40</option>
                                        <option>EU - 50</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default ChartDropdowns