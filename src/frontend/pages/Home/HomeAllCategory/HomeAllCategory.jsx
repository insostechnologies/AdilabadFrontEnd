import React, { useEffect, useState } from 'react';
import '../HomeSomeCategory/HomeSomeCategory.css';
import MobileHeader from '../../../components/MobileHeader/MobileHeader.jsx';
import SearchBar from '../../../components/SearchBar/SearchBar.jsx';
import CategoryRoundCard from '../../../components/CategoryRoundCard/CategoryRoundCard.jsx';
import Spinner from 'react-bootstrap/Spinner';
import { config } from '../../../../config.js';

const HomeAllCategory = () => {
    let [allCategoryList, setAllCategoryList] = useState([]);
    let [loading, setLoading] = useState(true);
    const [filterCategories, setFilterCategories] = useState([]);
    const [searchCategory, setSearchCategory] = useState('');

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/category/parents?status=1`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setAllCategoryList(result.data);
            setFilterCategories(result.data);
        } catch (error) {
            console.error('Fetching categories failed', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // filter search category name from category list
    useEffect(() => {
        const filter = allCategoryList.filter(cat => cat.name.toLowerCase().includes(searchCategory.toLowerCase()));
        setFilterCategories(filter);
    }, [searchCategory, allCategoryList]);

    return (
        <div className="category-container" style={{ marginTop: '45px' }}>
            <MobileHeader title={'Categories'} />
            <SearchBar searchItem={searchCategory} setSearchItem={setSearchCategory} />
            {loading ? (
                <div className="spinnerCon">
                    <Spinner animation="border" />
                </div>
            ) : filterCategories.length > 0 ? (
                <div className="category-section">
                    {filterCategories.map((category, index) => (
                        <CategoryRoundCard key={index} category={category} />
                    ))}
                </div>
            ) : (
                <p>No categories found.</p>
            )}
        </div>
    );
};

export default HomeAllCategory;
