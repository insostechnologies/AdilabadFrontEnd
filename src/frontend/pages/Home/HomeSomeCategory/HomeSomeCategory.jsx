import React, { useState } from 'react';
import './HomeSomeCategory.css';
import "./mediaQuery.css";
import { useNavigate } from 'react-router-dom';
import CategoryRoundCard from '../../../components/CategoryRoundCard/CategoryRoundCard.jsx';

const HomeSomeCategory = ({ category }) => {
    const [showMore, setShowMore] = useState(false);
    const navigate = useNavigate();

    // Display 8 categories, and show more if the user clicks view all
    const visibleCategories = showMore ? category : category.slice(0, 16);

    const seeAll = () => {
        navigate('/all-categories');
    };

    return (
        <div className="category-container">
            <div className="category-section">
                {visibleCategories.map((category, index) => (
                    <CategoryRoundCard key={index} category={category} />
                ))}
            </div>

            {/* Add View All button only if there are more than 8 categories */}
            {!showMore && category.length > 16 && (
                <div className="view-all-button-container">
                    <button className="view-all-button" onClick={seeAll}>
                        View All
                    </button>
                </div>
            )}
        </div>
    );
};

export default HomeSomeCategory;