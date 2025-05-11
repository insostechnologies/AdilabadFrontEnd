import React, { useRef } from 'react';
import './HomeBanner2.css';
import './mediaQuery.css';
import { config } from '../../../../../config';
import { HiArrowNarrowLeft, HiArrowNarrowRight } from 'react-icons/hi';
import { FaAngleRight } from "react-icons/fa6";
import Spinner from 'react-bootstrap/Spinner';
import { leadsAdd } from '../../../../../utils/apiCall'; // Import leadsAdd function


const HomeBanner2 = ({ banner }) => {

    const listRef = useRef(null);
    const user_id = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).uid : '';
    const handleScroll = (direction) => {
        if (direction === 'left') {
            listRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        } else {
            listRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    const handleBannerClick = async (item) => {
        try {
            const result = await leadsAdd(user_id, item.uid, 'banner'); // Assuming item.id is the item_id
            console.log('Lead added:', result);
        } catch (error) {
            console.error('Error adding lead:', error);
        }

        if (item.link) {
            window.open(item.link, '_blank');
        }
    };

    return (
        <div className="home-banner2-container">
            <div className='title'>
                <p>{banner.title || ''}</p>
                {/* <p className='see-more'>See more <FaAngleRight/></p> */}
            </div>
            <div className="home-banner2-inner" ref={listRef}>
                <div className="home-banner2">
                    {
                        banner.banners && banner.banners.length > 0 ? (
                            banner.banners.filter((image) => {return image.status !== 0}).map((image, index) => (
                                <div key={image.id} className="banner2-item" onClick={() => handleBannerClick(image)}>
                                    <img src={config.backEndBaseUrl + image.path} alt={image.title || "Banner Image"} />
                                    <div className='banner-title'>{image.title}</div>
                                </div>
                            ))
                        ) : (
                            <div className='Home-banner spinner' key={1}>
                                <Spinner animation="border" />
                            </div>
                        )
                    }
                </div>
            </div>
            <div className='navigation-buttons'>
                <button className='button' onClick={() => handleScroll('left')}>
                    <HiArrowNarrowLeft />
                </button>
                <button className='button' onClick={() => handleScroll('right')}>
                    <HiArrowNarrowRight />
                </button>
            </div>
        </div>
    );
}

export default HomeBanner2;
