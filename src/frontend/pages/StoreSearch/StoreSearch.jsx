import React, { useState, useEffect, useRef } from 'react';
import './StoreSearch.css';
import MobileHeader from '../../components/MobileHeader/MobileHeader';
import search_icon from '../../components/Assets/Images/red_search.png';
import { config } from '../../../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import StoreViewCard from '../../components/StoreViewCard/StoreViewCard.jsx';

const StoreSearch = () => {
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [storeList, setStoresList] = useState([]); // State to store the list of stores
    const searchInputRef = useRef(null); // Ref for search input
    const [leadsCount, setLeadsCount] = useState(0);

    // Focus the input when the component mounts
    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
        // Fetch all stores initially when the component mounts
        fetchAllStores();
        fetchSearchLeads();
    }, []);

    // Fetch stores based on the search term
    const fetchStores = async (term) => {
        setLoading(true); // Set loading to true when search starts
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/store/search/keywords?q=${encodeURIComponent(term)}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);
            setStoresList(data.data || []); // Ensure the list is set to an array
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred while fetching stores. Please try again later.', {
                position: 'top-center',
            });
        } finally {
            setLoading(false); // Set loading to false when fetch completes
        }
    };

    // Function to fetch all stores
    const fetchAllStores = async () => {
        setLoading(true); // Show loading indicator
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/store?status=1`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setStoresList(data.data); // Update state with all stores
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred while fetching all stores.', {
                position: 'top-center',
            });
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    // Handle the search input change
    const handleSearchChange = (e) => {
        const term = e.target.value; // Get the new search term
        setSearchTerm(term); // Update search term

        if (term === '') {
            // If search term is empty, fetch all stores
            fetchAllStores();
        } else {
            // Otherwise, fetch stores based on the search term
            fetchStores(term);
        }
    };

    // Clear the search term and fetch all stores again
    const handleClear = () => {
        setSearchTerm(''); // Clear the input field
        fetchAllStores(); // Fetch all stores again
    };

    const fetchSearchLeads = async () => {
        setLoading(true); // Show loading indicator
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/leads/search`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setLeadsCount(data.data); // Update state with all stores
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred while fetching all stores.', {
                position: 'top-center',
            });
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };



    return (
        <>
            <ToastContainer />
            <MobileHeader title="Search Stores" searchCount={leadsCount}/>
            <div className="search">
                <div id="myHeader" className="search-bar">
                    <input
                        type="text"
                        placeholder="Search here.."
                        value={searchTerm}
                        ref={searchInputRef} // Assign ref to input
                        onChange={handleSearchChange} // Handle input change
                    />
                    {/* <img src={search_icon} alt="search_icon" /> */}
                    {searchTerm && (
                        <button className="clear-btn" onClick={handleClear} style={{ marginRight: '20px' }}>
                            Clear
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="text-center mt-3">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : storeList.length === 0 ? (
                    <p className="text-center mt-3">No stores found.</p>
                ) : (
                    <div className="sub-category">
                        {storeList.map((store, i) => (
                            <StoreViewCard store={store} key={i} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default StoreSearch;
