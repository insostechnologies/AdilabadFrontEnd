import React from 'react';
import './CategoryRoundCard.css';
import './mediaQuery.css';
import { config } from '../../../config';
import { Link } from 'react-router-dom';
import { leadsAdd } from '../../../utils/apiCall';

function CategoryRoundCard({ category }) {
    const user_id = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).uid : '';

    const handleCardClick = async () => {
        try {
            const result = await leadsAdd(user_id, category.uid, 'category'); // Assuming 'category' as the type
            console.log('Lead added:', result);
        } catch (error) {
            console.error('Error adding lead:', error);
        }
    };

    return (
        <div className="category">
            <Link 
                className="img-wrapper" 
                to={category.is_store_only == 1 ? `/stores/view/${category.uid}` : (category.list_type === 'List_type' ? `/sub-categories/list/${category.uid}` : `/sub-categories/${category.uid}`)} 
                onClick={handleCardClick} // Call the function on click
            >
                {category.new_tag ? <span className='tag-text'>{category.new_tag_text}</span> : ''}
                <img 
                    src={category.icon_img_path ? config.backEndBaseUrl + category.icon_img_path : config.backEndBaseUrl + config.placeHolderImage} 
                    className="category-icon" 
                    alt='icons'
                />
            </Link>
            <span className="category-label">{category.name}</span>
        </div>
    );
}

export default CategoryRoundCard;