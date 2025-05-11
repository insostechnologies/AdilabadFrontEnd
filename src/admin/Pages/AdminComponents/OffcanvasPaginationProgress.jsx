import React from 'react'
import { Link } from 'react-router-dom'

function OffcanvasPaginationProgress() {
    
    return (
        <>
            <div className="col-xl-4 mb-20">
                <div className="wg-box h-full">
                    <h3>Offcanvas</h3>
                    <div className="setting cursor-pointer" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight1" aria-controls="offcanvasRight1">
                        <p>Offcanvas Right</p>
                    </div>
                    <div className="setting cursor-pointer" data-bs-toggle="offcanvas" data-bs-target="#offcanvasStart1" aria-controls="offcanvasStart1">
                        <p>Offcanvas Left</p>
                    </div>
                    <div className="setting cursor-pointer" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop1" aria-controls="offcanvasTop1">
                        <p>Offcanvas Top</p>
                    </div>
                    <div className="setting cursor-pointer" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom1" aria-controls="offcanvasBottom1">
                        <p>Offcanvas Bottom</p>
                    </div>
                </div>
            </div>
            <div className="col-xl-4 mb-20">
                <div className="wg-box h-full">
                    <h3>Pagination</h3>
                    <div>
                        <p className="mb-10">Pagination start</p>
                        <ul className="wg-pagination">
                            <li>
                                <Link to="#"><i className="icon-chevron-left"></i></Link>
                            </li>
                            <li>
                                <Link to="#">1</Link>
                            </li>
                            <li className="active">
                                <Link to="#">2</Link>
                            </li>
                            <li>
                                <Link to="#">3</Link>
                            </li>
                            <li>
                                <Link to="#"><i className="icon-chevron-right"></i></Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <p className="mb-10">Pagination center : add class .justify-content-center</p>
                        <ul className="wg-pagination justify-content-center">
                            <li>
                                <Link to="#"><i className="icon-chevron-left"></i></Link>
                            </li>
                            <li>
                                <Link to="#">1</Link>
                            </li>
                            <li className="active">
                                <Link to="#">2</Link>
                            </li>
                            <li>
                                <Link to="#">3</Link>
                            </li>
                            <li>
                                <Link to="#"><i className="icon-chevron-right"></i></Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <p className="mb-10">Pagination end : add class .justify-content-end</p>
                        <ul className="wg-pagination justify-content-end">
                            <li>
                                <Link to="#"><i className="icon-chevron-left"></i></Link>
                            </li>
                            <li>
                                <Link to="#">1</Link>
                            </li>
                            <li className="active">
                                <Link to="#">2</Link>
                            </li>
                            <li>
                                <Link to="#">3</Link>
                            </li>
                            <li>
                                <Link to="#"><i className="icon-chevron-right"></i></Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="col-xl-4 mb-20">
                <div className="wg-box h-full">
                    <h3>Progress</h3>
                    <div className="flex items-center justify-between gap10">
                        <div className="text-tiny">20%</div>
                        <div className="progress-level-bar w-full">
                            <span data-progress="20" data-max="100" className=""></span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap10">
                        <div className="text-tiny">40%</div>
                        <div className="progress-level-bar t1 w-full">
                            <span data-progress="40" data-max="100" className=""></span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap10">
                        <div className="text-tiny">50%</div>
                        <div className="progress-level-bar t2 w-full">
                            <span data-progress="50" data-max="100" className=""></span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap10">
                        <div className="text-tiny">60%</div>
                        <div className="progress-level-bar t3 w-full">
                            <span data-progress="60" data-max="100" className=""></span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap10">
                        <div className="text-tiny">80%</div>
                        <div className="progress-level-bar t4 w-full">
                            <span data-progress="80" data-max="100" className=""></span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap10">
                        <div className="text-tiny">100%</div>
                        <div className="progress-level-bar t5 w-full">
                            <span data-progress="100" data-max="100" className=""></span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OffcanvasPaginationProgress