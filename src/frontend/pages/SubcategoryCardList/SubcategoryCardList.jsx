import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import Spinner from 'react-bootstrap/Spinner';
import MobileHeader from '../../components/MobileHeader/MobileHeader';
import SearchBar from '../../components/SearchBar/SearchBar';
import SubCatCard from './SubCatCard/SubCatCard';
import { config } from '../../../config';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './SubcategoryCardList.css';
import './mediaQuery.css';

const SubcategoryCardList = () => {
    const [allCategoryList, setAllCategoryList] = useState([]);
    const [categoryBanner, setCategoryBanner] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingBanner, setLoadingBanner] = useState(true);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const [searchSubCategory, setSearchSubCategory] = useState("");
    const { id } = useParams();
    const [bannerData, setBannerData] = useState({})
    const [categoryName, setCategoryName] = useState();
    const [leads, setLeads] = useState(0)

    const fetchCategories = async (uid) => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/category/sub-category/${uid}?status=1`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setAllCategoryList(result.data);
            setFilteredSubCategories(result.data);
        } catch (error) {
            console.error('Fetching categories failed', error);
        } finally {
            setLoadingCategories(false);
        }
    };

    const fetchCategoryById = async (uid) => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/category/${uid}`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setCategoryBanner(result.data.banners);
            setBannerData(result.data)
            setCategoryName(result.data.name)
            setLeads(result.data.leadsCat)
        } catch (error) {
            console.error('Fetching banners failed', error);
        } finally {
            setLoadingBanner(false);
        }
    };

    useEffect(() => {
        fetchCategories(id);
        fetchCategoryById(id);
    }, [id]);


    // filter search category name from category list
    useEffect(() => {
        const filterCat = allCategoryList.filter(cat => cat.name.toLowerCase().includes(searchSubCategory.toLowerCase()));
        setFilteredSubCategories(filterCat);
    }, [searchSubCategory, allCategoryList]);
    
    const formatCount = (count) => {
        if (count >= 1000000) {
            return (count / 1000000).toFixed(1) + 'M'; // Format to millions
        } else if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'K'; // Format to thousands
        }
        return count; // Return the original count if less than 1000
    };

    return (
        <>
            <MobileHeader title={`${categoryName ? categoryName : ''} (${allCategoryList ? formatCount(allCategoryList.length) : 0})`} shareCount={`${0}`} views={`${leads}`} />

            <div className='category-detail'>
                {loadingBanner ? (
                    <div className='spinner-container'>
                        <Spinner animation="border" />
                    </div>
                ) : (
                    <div className='car-con-card-type'>
                        <Carousel infiniteLoop={true} showThumbs={false} showArrows={false} showStatus={false}>
                            {categoryBanner.length > 0 && bannerData.banner_status == 1 ? (
                                categoryBanner.map((banner, index) => (
                                    <div
                                        className='Home-banner'
                                        key={index}
                                        onClick={() => banner.url ? window.open(banner.url) : null}
                                    >
                                        <img
                                            src={banner.banner_path ? config.backEndBaseUrl + banner.banner_path : config.backEndBaseUrl + config.placeHolderImage}
                                            alt={banner.banner_path || "Banner Image"}
                                            className='img'
                                        />
                                    </div>
                                ))
                            ) : ''}
                        </Carousel>
                    </div>

                )}
                <SearchBar searchItem={searchSubCategory} setSearchItem={setSearchSubCategory} />

                <div className={`sub-category ${loadingCategories ? 'loadingCat' : ''}`}>
                    {loadingCategories ? (
                        <div className='spinner-container'>
                            <Spinner animation="border" />
                        </div>
                    ) : filteredSubCategories.length > 0 ? (
                        filteredSubCategories.map((category, index) => (
                            <SubCatCard category={category} key={index} />
                        ))
                    ) : (
                        <p className='no-subcategories'>No Sub categories Found.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default SubcategoryCardList;
