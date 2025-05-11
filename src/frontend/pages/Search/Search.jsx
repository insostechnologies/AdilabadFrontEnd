import React, { useState,useEffect } from 'react';
import './Search.css';
import MobileHeader from '../../components/MobileHeader/MobileHeader';
import search_icon from '../../components/Assets/Images/red_search.png';
import { useNavigate } from 'react-router-dom';
import { config } from '../../../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import StoreViewCard from '../../components/StoreViewCard/StoreViewCard.jsx';
const user = JSON.parse(localStorage.getItem('user'))



const Search = () => {
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [loading, setLoading] = useState(false); // State for loading indicator
    const navigate = useNavigate(); // Hook for navigation
    const [storeList, setStoresList] = useState([]);
	const [savedStores, setSavedStores] = useState([])
    const fetchUserSavedStores = async () => {
		try {
			const response = await fetch(`${config.backEndBaseUrl}api/user/stores/${user.uid}`, {
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
				let stores = result.data;
				setSavedStores(stores)
			} else {
				setSavedStores([]);
			}
		} catch (error) {
			console.error('Fetching stores failed', error);
		}
	}

    // Function to handle search button click
    const handleSearch = async () => {
        if (searchTerm.trim()) {
            setLoading(true); // Set loading to true when search starts
            try {
                const response = await fetch(`${config.backEndBaseUrl}api/store/search?q=${encodeURIComponent(searchTerm)}&status=1`, {
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
                setStoresList(data.data)
            } catch (error) {
                console.error('Error:', error);
                toast.error('An error occurred while searching. Please try again later.', {
                    position: 'top-center',
                });
            } finally {
                setLoading(false); // Set loading to false when search completes
            }
        } else {
            toast.error("Please enter a search term.", {
                position: 'top-center',
            });
        }
    };

    useEffect(() => {
		fetchUserSavedStores()
	}, []);

    return (
        <>
            {/* <ToastContainer /> */}
            <MobileHeader title={"Search Stores"} />
            <div className='search'>
                <div id="myHeader" className='search-bar'>
                    <input
                        type="text"
                        placeholder='Search here..'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
                    />
                    <img src={search_icon} alt="search_icon" onClick={handleSearch} />
                </div>
                {loading ? (
                    <div className="text-center mt-3">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : storeList.length == 0 ? (
                    ''
                ) : (
                    <>
                        <div className='sub-category'>
                            {storeList.map((store, i) => (
                                <StoreViewCard store={store} key={i} saved={savedStores} />
                            ))}

                        </div>
                        {/* Modify sub-category for desktop screen layout */}
                        <div className='sub-category-desktop-only'>
                            <div className='card1-container'>
                                {storeList.map((store, i) => (
                                    <StoreViewCard store={store} key={i} saved={savedStores} />
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Search;