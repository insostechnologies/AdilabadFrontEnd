import "./home.css";
import { config } from "../../../config";
import Navbar from "../../components/Navbar/Navbar";
import HomeMobHeader from "./HomeMobHeader/HomeMobHeader";
import HomeBannerHero from './HomeBanners/HomeBannerHero/HomeHeroBanner';
import SearchBar from "../../components/SearchBar/SearchBar";
import HomeSomeCategory from "./HomeSomeCategory/HomeSomeCategory";
import SaveCard from "../../components/SaveCard/SaveCard";
import HomeBanner1 from "./HomeBanners/HomeBanner1/HomeBanner1";
import HomeBanner2 from "./HomeBanners/HomeBanner2/HomeBanner2";
import HomeBanner3Rectangle from "./HomeBanners/HomeBanner3Rectangle/HomeBanner3Rectangle";
import HomeBanner4 from "./HomeBanners/HomeBanner4/HomeBanner4";
import HomeBanner5 from "./HomeBanners/HomeBanner5/HomeBanner5";
import HomeBanner7 from "./HomeBanners/HomeBanner7/HomeBanner7";
import { useEffect, useState } from "react";
import Spinner from 'react-bootstrap/Spinner';
import { Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { leadsAdd } from '../../../utils/apiCall'; // Import leadsAdd function


function Home() {
    const [allBannerList, setAllBannerList] = useState([]);
    const [allCategoryList, setAllCategoryList] = useState([]);
    const [heroBannerList, setHeroBannerList] = useState([]);
    const [saveStores, setSaveStores] = useState([]);
    const [loadingBanners, setLoadingBanners] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [searchCategory, setSearchCategory] = useState("");
    const [searchParams] = useSearchParams();
    const userType = searchParams.get('s');

    const user_id = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).uid : '';

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.has("s")) {
            params.delete("s");
            // Update the URL without the query string
            navigate({
                pathname: location.pathname,
                search: params.toString(), // Will be empty if "s" was the only query
            }, { replace: true });
        }
    }, [location, navigate]);

    const fetchBanners = async () => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/banner?status=1`, {
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
                let banners = result.data;
                banners = banners.filter(item => item.page === 'home');

                setAllBannerList(banners);
                setHeroBannerList(banners.find(item => item.type === 'main banner')?.banners || []);
            }
        } catch (error) {
            console.error('Fetching banners failed', error);
        } finally {
            setLoadingBanners(false);
        }
    };

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
            setFilteredCategories(result.data);
        } catch (error) {
            console.error('Fetching categories failed', error);
        } finally {
            setLoadingCategories(false);
        }
    };

    // saved stores
    const fetchSaveStores = async () => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/stores/list/${user_id}`, {
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
                setSaveStores(result.data);
            }
        } catch (error) {
            console.error('Fetching stores failed', error);
        }
    };
    useEffect(() => {
        fetchBanners();
        fetchCategories();
        fetchSaveStores();
    }, []);


    // filter search category name from category list
    useEffect(() => {
        const filterCat = allCategoryList.filter(cat => cat.name.toLowerCase().includes(searchCategory.toLowerCase()));
        setFilteredCategories(filterCat);
    }, [searchCategory, allCategoryList]);

    useEffect(() => {

        if (userType == 'o') {
            toast.success("Sign In Successfull Welcome Back", {
                position: 'top-center',
            });
        } else if (userType == 'n') {
            toast.success("Sign In Successfull", {
                position: 'top-center',
            });
        }
    }, [])

    const handleSearchClick = async () => {
        try {
            const result = await leadsAdd(user_id, '', 'search'); // Assuming item.id is the item_id
            console.log('Lead added:', result);
        } catch (error) {
            console.error('Error adding lead:', error);
        }
    };


    return (
        <>
            <ToastContainer />
            <div className='homeCon'>
                <Navbar />
                <HomeMobHeader />
                {heroBannerList.length ? <HomeBannerHero bannerData={heroBannerList} /> : ''}
                <Link to={`/store/search`} onClick={() => handleSearchClick()}>
                    <SearchBar searchItem={searchCategory} setSearchItem={setSearchCategory} />
                </Link>
                {/* <Link to={'/search'}>
                    <SearchBar searchItem={searchCategory} setSearchItem={setSearchCategory} />
                </Link> */}

                {
                    filteredCategories.length > 0 ? (
                        <HomeSomeCategory category={filteredCategories} />
                    ) : (
                        <p></p>
                    )
                }

                {
                    saveStores && (
                        <SaveCard storeData={saveStores} setStoreData={setSaveStores} />
                    )
                }


                {loadingBanners ? (
                    <div className="spinnerCon">
                        <Spinner animation="border" />
                    </div>
                ) : (
                    allBannerList.length > 0 ? allBannerList.map((banner, index) => {
                        switch (banner.type) {
                            case 'slider':
                                return <HomeBanner1 banner={banner} key={index} />;
                            case 'card':
                                return <HomeBanner2 banner={banner} key={index} />;
                            case 'cover':
                                return <HomeBanner3Rectangle banner={banner} key={index} />;
                            case 'card (small)':
                                return banner.text_position === 'bottom' ?
                                    <HomeBanner4 banner={banner} key={index} /> :
                                    <HomeBanner5 banner={banner} key={index} />;
                            case 'carousel':
                                return <HomeBanner7 banner={banner} key={index} />;
                            default:
                                return null;
                        }
                    }) : (
                        <p className="display-msg">No banners found!</p>
                    )
                )}
            </div>
        </>
    );
}

export default Home;
