import React from 'react';

function FormFormtext() {

    return (
        <>
            <div className="col-12 mb-20">
                <div className="wg-box">
                    <h3>Form</h3>
                    <div className="row">
                        <div className="col-xl-4 mb-20">
                            <div>
                                <h5 className="mb-16">Form search</h5>
                                <form className="form-search">
                                    <fieldset className="name">
                                        <input type="text" placeholder="Search here..." className="" name="name" tabindex="2" value="" aria-required="true" required="" />
                                    </fieldset>
                                    <div className="button-submit">
                                        <button className="" type="submit"><i className="icon-search"></i></button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-xl-4 mb-20">
                            <div>
                                <h5 className="mb-16">Form select date</h5>
                                <form className="" >
                                    <div className="select">
                                        <input type="date" name="date" value="2023-11-20" />
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-xl-4 mb-20">
                            <div>
                                <h5 className="mb-16">Form checkbox</h5>
                                <form className="">
                                    <div className="wrap-checkbox">
                                        <ul className="table-title flex gap20 mb-14">
                                            <li className="countries-item">
                                                <div className="mb-10">
                                                    <input className="total-checkbox" type="checkbox" />
                                                </div>
                                                <div className="body-text">Stt</div>
                                            </li>
                                            <li className="countries-item">
                                                <div className="mb-10">
                                                    <input className="checkbox-item" type="checkbox" />
                                                </div>
                                                <div className="body-text">#01</div>
                                            </li>
                                            <li className="countries-item">
                                                <div className="mb-10">
                                                    <input className="checkbox-item" type="checkbox" />
                                                </div>
                                                <div className="body-text">#02</div>
                                            </li>
                                            <li className="countries-item">
                                                <div className="mb-10">
                                                    <input className="checkbox-item" type="checkbox" />
                                                </div>
                                                <div className="body-text">#03</div>
                                            </li>
                                            <li className="countries-item">
                                                <div className="mb-10">
                                                    <input className="checkbox-item" type="checkbox" />
                                                </div>
                                                <div className="body-text">#04</div>
                                            </li>
                                            <li className="countries-item">
                                                <div className="mb-10">
                                                    <input className="checkbox-item" type="checkbox" />
                                                </div>
                                                <div className="body-text">#05</div>
                                            </li>
                                        </ul>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 mb-20">
                <div className="wg-box">
                    <h3>Form text</h3>
                    <div className="row">
                        <div className="col-12 mb-20">
                            <div>
                                <form className="">
                                    <fieldset className="name mb-24">
                                        <div className="body-title mb-10">Name <span className="tf-color-1">*</span></div>
                                        <input className="" type="text" placeholder="Name" name="text" tabindex="0" value="" aria-required="true" required="" />
                                    </fieldset>
                                    <fields className="email mb-24">
                                        <div className="body-title mb-10">Admin email</div>
                                        <input className="flex-grow" type="email" placeholder="Enter your email" name="email" tabindex="0" value="" aria-required="true" required="" />
                                    </fields>
                                    <fieldset className="description mb-24">
                                        <div className="body-title mb-10">Description <span className="tf-color-1">*</span></div>
                                        <textarea className="" name="description" placeholder="Description" tabindex="0" aria-required="true" required=""></textarea>
                                    </fieldset>
                                    <div className="bot">
                                        <button className="tf-button w208" type="submit">Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 mb-20">
                <div className="wg-box">
                    <h3>Form text</h3>
                    <div className="row">
                        <div className="col-12 mb-20">
                            <form className="form-style-1" >
                                <fieldset className="name mb-24">
                                    <div className="body-title">Product name <span className="tf-color-1">*</span></div>
                                    <input className="flex-grow" type="text" placeholder="Category name" name="text" tabindex="0" value="" aria-required="true" required="" />
                                </fieldset>
                                <fieldset className="email mb-24">
                                    <div className="body-title mb-10">Admin email</div>
                                    <input className="flex-grow" type="email" placeholder="Enter your email" name="email" tabindex="0" value="" aria-required="true" required="" />
                                </fieldset>
                                <div className="bot">
                                    <div></div>
                                    <button className="tf-button w208" type="submit">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default FormFormtext