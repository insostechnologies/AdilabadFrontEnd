import React from 'react';
import { Link } from 'react-router-dom';


function BreadCrumbs() {

    return (
        <>
            <ul className="breadcrumbs flex items-center flex-wrap justify-start gap10">
                <li>
                    <Link to="/admin"><div className="text-tiny">Dashboard</div></Link>
                </li>
                <li>
                    <i className="icon-chevron-right"></i>
                </li>
                <li>
                    <Link to="/admin/sub/category"><div className="text-tiny">Sub Category</div></Link>
                </li>
                <li>
                    <i className="icon-chevron-right"></i>
                </li>
                <li>
                    <Link to="/admin/sub/category/list"><div className="text-tiny">Sub Category List</div></Link>
                </li>
            </ul>
        </>
    )
}

export default BreadCrumbs