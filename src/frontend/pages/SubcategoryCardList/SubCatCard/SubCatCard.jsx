import React from 'react';
import './SubCatCard.css';
import './mediaQuery.css';
import { Link } from 'react-router-dom';
import { config } from '../../../../config';
import { leadsAdd } from '../../../../utils/apiCall'; // Import leadsAdd function

const SubCatCard = ({ category }) => {
    const user_id = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).uid : '';

    const handleCardClick = async () => {
        try {
            const result = await leadsAdd(user_id, category.uid, 'sub-category'); // Assuming category.uid is the item_id
            console.log('Lead added:', result);
        } catch (error) {
            console.error('Error adding lead:', error);
        }
    };

    return (
        <Link to={`/stores/view/${category.uid}`} className='Sub-Cat-Card' onClick={handleCardClick}>
            <div className="subcategory-card">
                {/* Image Section */}
                <div className="subcategory-image">
                    <img
                        src={category.cover_img_path ? config.backEndBaseUrl + category.cover_img_path : config.backEndBaseUrl + config.placeHolderImage}
                        alt={category.name}
                        className="subcategory-img"
                    />
                </div>

                {/* Content Section */}
                <div className="subcategory-content">
                    <div className="subcategory-info">
                        <p className="subcategory-name">{category.name} ({category.store_count})</p>
                        {/* <p className="subcategory-count">Stores: </p> */}
                    </div>

                    {/* New Tag */}
                    {category.new_tag === 1 && (
                        <div className="new-tag">
                            <span>{category.new_tag_text}</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default SubCatCard;
