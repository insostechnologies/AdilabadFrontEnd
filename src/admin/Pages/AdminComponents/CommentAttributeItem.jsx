import React from 'react';
import { config } from '../../../config';
import { Link } from 'react-router-dom';


function CommentAttributeItem() {
    const { frontEndBaseUrl } = config;

    
    return (
        <>
            <div className="col-12 mb-20">
                <div className="wg-box h-full">
                    <h3>Comment item</h3>
                    <div className="row">
                        <div className="col-12 mb-20">
                            <div className="comment-item">
                                <div className="image">
                                    <img src={`${frontEndBaseUrl}adminAssets/images/avatar/user-4.png`} alt="avatar_img" />
                                </div>
                                <div className="">
                                    <div className="mb-4 name">
                                        <Link to="all-user.html" className="body-title-2">Devon Lane</Link>
                                    </div>
                                    <div className="ratings mb-10">
                                        <i className="icon-star1 active"></i>
                                        <i className="icon-star1 active"></i>
                                        <i className="icon-star1 active"></i>
                                        <i className="icon-star1 active"></i>
                                        <i className="icon-star1"></i>
                                    </div>
                                    <div className="text-tiny">Morbi eget commodo diam. Praesent dignissim purus ac turpis porta</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 mb-20">
                <div className="wg-box h-full">
                    <h3>Attribute item</h3>
                    <div className="row">
                        <div className="col-12 mb-20">
                            <div className="attribute-item flex items-center justify-between gap20 mb-10">
                                <div className="name">
                                    <Link to="add-attributes.html" className="body-title-2">Color</Link>
                                </div>
                                <div className="body-text">Blue, green, white</div>
                                <div className="list-icon-function">
                                    <div className="item eye">
                                        <i className="icon-eye"></i>
                                    </div>
                                    <div className="item edit">
                                        <i className="icon-edit-3"></i>
                                    </div>
                                    <div className="item trash">
                                        <i className="icon-trash-2"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="attribute-item flex items-center justify-between gap20">
                                <div className="name">
                                    <Link to="add-attributes.html" className="body-title-2">Size</Link>
                                </div>
                                <div className="body-text">S, M, L, XL</div>
                                <div className="list-icon-function">
                                    <div className="item eye">
                                        <i className="icon-eye"></i>
                                    </div>
                                    <div className="item edit">
                                        <i className="icon-edit-3"></i>
                                    </div>
                                    <div className="item trash">
                                        <i className="icon-trash-2"></i>
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

export default CommentAttributeItem