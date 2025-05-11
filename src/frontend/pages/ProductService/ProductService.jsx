import React, { useState, useEffect, useRef } from 'react';
import './ProductService.css';
import './MediaQuery.css';
import { FaArrowLeft, FaEye, FaStar } from 'react-icons/fa6';
import { IoSearch } from 'react-icons/io5';
import { CiShare2 } from 'react-icons/ci';
import image from '../../components/Assets/Images/Vector.png';
import { RxCross1 } from 'react-icons/rx';
import ProductCard from './ProductCard/ProductCard.jsx';
import image1 from '../../components/Assets/Images/card1.png';
import { useNavigate, useParams } from 'react-router-dom';
import { config } from '../../../config.js';
import Spinner from 'react-bootstrap/Spinner';
import MobileHeader from '../../components/MobileHeader/MobileHeader';
import Comments from '../../components/Comments/Comments.jsx';
import SearchBar from "../../components/SearchBar/SearchBar";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import share from '../../components/Assets/Images/share1.png';

const ProductService = () => {
    let { id } = useParams();
    let [products, setProducts] = useState(null);
    const [loadingStores, setLoadingStores] = useState(true);
    const [error, setError] = useState(null);
    const [store, setStore] = useState();
    const [showComments, setShowComments] = useState(false);
    const [commentList, setCommentList] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [isSearchBarEnable, setIsSearchBarEnable] = useState(false);
    const [searchStore, setSearchStore] = useState("");
    const [filterProductList, setFilterProductList] = useState([]);
    const [keyWords, setKeyWords] = useState([]);
    const [selectedKeywords, setSelectedKeywords] = useState([]); // Array to store selected keywords
    const [leads, setLeads] = useState(0)
    const [siteTitle, setSiteTitle] = useState('')
    const [permissions, setPermissions] = useState([])

    const handleToggleComments = () => {
        setShowComments(prevState => !prevState);
    };

    // Handle Search Bar
    const handleSearchBar = () => {
        setIsSearchBarEnable(!isSearchBarEnable);
    };

    const fetchPermissions = async () => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/store/permissions?t=u`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.status) {
                setPermissions(result.data);
            } else {
                throw new Error('Failed to fetch permissions');
            }
        } catch (error) {
            console.error('Error fetching permissions:', error);
            toast.error('Failed to fetch permissions');
        }
    };

    useEffect(() => {
        fetchPermissions()
    }, [])

    // Product Search and Filter
    useEffect(() => {
        let filterProduct = products;

        // If "All" is selected, show all products
        if (selectedKeywords.length === 0) {
            filterProduct = products;  // No filtering
        } else {
            // Filter by selected keywords (multi-select)
            filterProduct = filterProduct?.filter(product =>
                selectedKeywords.some(selectedKeyword =>
                    product.keywords.some(keyword => keyword.keyword.toLowerCase() === selectedKeyword.toLowerCase())
                )
            );
        }

        // Further filter by search input if entered
        if (searchStore) {
            filterProduct = filterProduct?.filter(product =>
                product.name.toLowerCase().includes(searchStore.toLowerCase())
            );
        }

        setFilterProductList(filterProduct);
    }, [products, searchStore, selectedKeywords]);

    // Fetch store comments
    const getStoresComments = async (id) => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/store/comments/${id}?status=1`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            let commentList = result.data;
            const totalRatings = commentList.reduce((sum, comment) => sum + comment.rating, 0);
            const averageRating = (totalRatings / commentList.length).toFixed(1);
            setCommentCount(commentList.length);
            setAvgRating(averageRating);
            setCommentList(commentList);
        } catch (error) {
            console.error('Fetching comments failed', error);
        }
    };

    useEffect(() => {
        getStoresComments(id);
    }, [id]);

    // Fetch store details
    const fetchStore = async (uid) => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/store/${uid}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            if (result.status) {
                let store = result.data;
                const sortedProducts = store.products.sort((a, b) => {
                    // Null values first
                    if (!a.updated_at) return -1;
                    if (!b.updated_at) return 1;
                    // Sort by date, recent first
                    return new Date(b.updated_at) - new Date(a.updated_at);
                });
                setStore(store);
                setProducts(sortedProducts);
                setLeads(store.total_product_views);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error('Fetching stores failed', error);
            setError('Failed to load stores. Please try again later.');
        } finally {
            setLoadingStores(false);
        }
    };



    // Fetch keywords
    const fetchKeyWords = async (id) => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/keywords/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            if (result.status) {
                let words = result.data;
                setKeyWords(words);
            } else {
                setKeyWords([]);
            }
        } catch (error) {
            console.error('Fetching keywords failed', error);
        }
    };

    useEffect(() => {
        fetchKeyWords(id);
        fetchStore(id);
    }, [id]);

    // Handle keyword selection (single-select)
    const toggleKeywordSelection = (keyword) => {
        if (keyword === "All") {
            // If "All" is selected, clear all selected keywords
            setSelectedKeywords([]);
        } else {
            // Select the new keyword and deselect the previous one
            setSelectedKeywords([keyword]);
        }
    };

    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    };


    const fetchSiteDetails = async () => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/site/details`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.status) {
                setSiteTitle(result.data.seoDetails.name);
            } else {
                console.log('Internal server error');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    const handleShareClick = () => {
        // Customize the message format
        const shareTitle = siteTitle
        const shareUrl = window.location.href; // Use the current page's URL
        const customMessage = `Hi, Link: ${shareUrl}\n\nPlease reply...\n\nMessage from ${siteTitle}`;

        const shareData = {
            title: shareTitle,
            text: customMessage,
        };

        if (navigator.share) {
            navigator.share(shareData)
                .then(() => console.log('Share successful'))
                .catch((error) => console.error('Error sharing:', error));
        } else {
            // Fallback for browsers that do not support the Web Share API
            alert('Sharing is not supported in this browser. Copy the link: ' + customMessage);
        }
    };

    useEffect(() => {
        fetchSiteDetails()

    }, [])

    if (loadingStores) {
        return (
            <>
                <MobileHeader title={"Store"} />
                <div className='loading-container'>
                    <Spinner animation="border" />
                </div>
            </>
        );
    }


    return (
        <>
            <ToastContainer />
            <div className='product-service'>
                <div className="product-header">
                    <FaArrowLeft onClick={goBack} className='icons' />
                    <div className="title">
                        <h3>Product/Service ({products ? products.length : 0})</h3>
                        <p> <FaEye /> {leads} views </p>
                    </div>
                    <div className="action">
                        <IoSearch className='icons' onClick={handleSearchBar} />
                        <span >
                            <img src={share} alt="Share" onClick={handleShareClick} style={{ cursor: 'pointer', height: '30px', width: '30px' }} />
                            {/* <span className='share-count' style={{ fontSize: '12px', color: '#fff', marginBottom: '4px' }}>0</span> */}
                        </span>
                    </div>
                </div>

                <div className="body-product-service">
                    {isSearchBarEnable && (
                        <span >
                            <SearchBar searchItem={searchStore} setSearchItem={setSearchStore} />
                        </span>
                    )}
                    <div className="store-title">
                        <img src={image} alt="" />
                        <h3>{store ? store.name : ''}</h3>
                    </div>

                    {/* Render Keyword Buttons with Multi-Select and All Button */}
                    <div className="product-types-btn">
                        <button
                            className={selectedKeywords.length === 0 ? 'btn-on' : 'btn-off'}
                            onClick={() => toggleKeywordSelection("All")}
                        >
                            All
                        </button>
                        {keyWords.map((keyword) => (
                            <button
                                key={keyword.id}
                                className={selectedKeywords.includes(keyword.keyword) ? 'btn-on' : 'btn-off'}
                                onClick={() => toggleKeywordSelection(keyword.keyword)}
                            >
                                {keyword.keyword}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="product-service-lists">
                    {filterProductList && filterProductList.length > 0 ? (
                        filterProductList.map((item, index) => (
                            <ProductCard product={item} store={store} key={index} permissions={permissions} />
                        ))
                    ) : (
                        <p>No product found!</p>
                    )}
                </div>
            </div>

            <Comments rating={avgRating} isShown={showComments} comments={commentList} onClose={handleToggleComments} />
        </>
    );
};

export default ProductService;
