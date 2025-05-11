import React, { useEffect, useState } from 'react';
import './StoresView.css';
import './mediaQuery.css';
import MobileHeader from '../../components/MobileHeader/MobileHeader';
import SearchBar from '../../components/SearchBar/SearchBar';
import { config } from '../../../config.js';
import StoreViewCard from '../../components/StoreViewCard/StoreViewCard.jsx';
import EnquiryCard from './EnquiryCard/EnquiryCard.jsx';
import Spinner from 'react-bootstrap/Spinner';
import { useParams } from 'react-router-dom';

const StoresView = () => {
    const { id } = useParams();
    const [storeList, setStoreList] = useState([]);
    const [loadingStores, setLoadingStores] = useState(true);
    const [filteredStore, setFilteredStore] = useState([]);
    const [searchStore, setSearchStore] = useState("");
    const [error, setError] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const [savedStores, setSavedStores] = useState([]);
    const [categoryData, setCategoryData] = useState({})
    const [leads, setLeads] = useState(0)

  


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
                setSavedStores(stores);
            } else {
                setSavedStores([]);
            }
        } catch (error) {
            console.error('Fetching stores failed', error);
            setError('Failed to load stores. Please try again later.');
        }
    };

    const fetchStores = async (uid) => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/store?cid=${uid}&status=1`, {
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
                // Filter out stores where status is 0
                let filteredStores = result.data.filter(store => store.status == 1);

                // Sort stores by updated_at in descending order
                let stores = filteredStores.sort((a, b) => {
                    const dateA = new Date(a.updated_at);
                    const dateB = new Date(b.updated_at);
                    return dateB - dateA; // Descending order
                });

                setStoreList(stores);
                setFilteredStore(stores);
                console.log(categoryData.name)
            } else {
                setStoreList([]);
            }
            setCategoryData(result.categoryData);
            setLeads(result.categoryData.leadsSubCat);
        } catch (error) {
            console.error('Fetching stores failed', error);
            setError('Failed to load stores. Please try again later.');
        } finally {
            setLoadingStores(false);
        }
    };





    useEffect(() => {
        fetchStores(id);
        fetchUserSavedStores();
    }, [id]);

    useEffect(() => {
        if (searchStore) {
            const filterCat = storeList.filter((store) => {
                // Check if store name matches
                const nameMatch = store.name?.toLowerCase().includes(searchStore.toLowerCase());

                // Check if any product name or keyword matches (ensure products is not null or undefined)
                const productMatch = store.products?.some((product) => {
                    const productNameMatch = product.name?.toLowerCase().includes(searchStore.toLowerCase());
                    const keywordMatch = product.keywords?.some((keyword) =>
                        keyword.keyword?.toLowerCase().includes(searchStore.toLowerCase())
                    );
                    return productNameMatch || keywordMatch;
                });

                return nameMatch || productMatch;
            });

            setFilteredStore(filterCat);
        } else {
            setFilteredStore(storeList);
        }
    }, [searchStore, storeList]);



    return (
        <>
            <MobileHeader title={`${categoryData.name} (${storeList.length})`} shareCount={`${0}`} views={`${categoryData.leadsCat ? categoryData.leadsCat : categoryData.leadsSubCat}`} />
            {loadingStores ? (
                <div className='loading-container'>
                    <Spinner animation="border" />
                </div>
            ) : error ? (
                <div className='error-container'>
                    <p>{error}</p>
                </div>
            ) : storeList.length === 0 ? (
                <div className='no-data-container'>
                    <p>No stores found.</p>
                </div>
            ) : (
                <>
                    <div className='search'>
                        <SearchBar searchItem={searchStore} setSearchItem={setSearchStore} />
                    </div>
                    <div className='sub-category'>
                        {filteredStore.slice(0, 4).map((store, i) => (
                            <StoreViewCard store={store} key={i} saved={savedStores} categoryId={id} />
                        ))}
                        {/* Only show EnquiryCard if there are 4 or more filtered stores */}
                        {filteredStore.length >= 4 && <EnquiryCard title={`Are you looking for (${categoryData.name}) Send Your Enquiry`} />}
                        {filteredStore.slice(4).map((store, i) => (
                            <StoreViewCard store={store} key={i + 3} saved={savedStores} categoryId={id} />
                        ))}
                    </div>
                    {/* Modify sub-category for desktop screen layout */}
                    <div className='sub-category-desktop-only'>
                        <div className='card1-container'>
                            {filteredStore.slice(0, 4).map((store, i) => (
                                <StoreViewCard store={store} key={i} saved={savedStores} categoryId={id}/>
                            ))}
                            {filteredStore.slice(4).map((store, i) => (
                                <StoreViewCard store={store} key={i + 3} saved={savedStores} categoryId={id} />
                            ))}
                        </div>
                        <div className='enquiry-card-container'>
                            {/* Only show EnquiryCard if there are 4 or more filtered stores */}
                            {filteredStore.length >= 4 && <EnquiryCard title={categoryData.name} />}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default StoresView;