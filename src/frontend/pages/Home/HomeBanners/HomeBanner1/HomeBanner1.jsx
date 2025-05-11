import React, { useRef } from 'react';
import './HomeBanner1.css';
import './mediaQuery.css';
import { HiArrowNarrowLeft, HiArrowNarrowRight } from 'react-icons/hi';
import { config } from '../../../../../config';
import { FaAngleRight } from "react-icons/fa6";
import Spinner from 'react-bootstrap/Spinner';
import { leadsAdd } from '../../../../../utils/apiCall'; // Import leadsAdd function

const HomeBanner1 = ({ banner }) => {
    const listRef = useRef(null);
    const user_id = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).uid : '';

    const handleScroll = (direction) => {
        if (direction === 'left') {
            listRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        } else {
            listRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    const getYoutubeEmbedUrl = (youtubeLink) => {
        let videoId;

        // Check if the link is a standard YouTube link
        if (youtubeLink.includes("youtube.com/watch?v=")) {
            videoId = youtubeLink.split('v=')[1].split('&')[0]; // Get the video ID and remove any additional parameters
        }
        // Check if the link is a shortened YouTube link
        else if (youtubeLink.includes("youtu.be/")) {
            videoId = youtubeLink.split('youtu.be/')[1].split('?')[0]; // Get the video ID and remove any additional parameters
        } else {
            // throw new Error("Invalid YouTube link");
        }

        return `https://www.youtube.com/embed/${videoId}`;
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
        <div className="home-banner-container">
            <div className='title'>
                <p>{banner.title || 'Banner'}</p>
                {/* <p className='see-more'>See more <FaAngleRight/></p> */}
            </div>
            <div className="home-banner-inner" ref={listRef}>
                <div className="home-banner">
                    {
                        banner.banners && banner.banners.length > 0 ? (
                            banner.banners.filter((image) => {return image.status !== 0}).map((image) => (
                                <div key={image.id} className="banner-item" onClick={() => handleBannerClick(image)}>
                                    {image.youtube_link ? (
                                        <iframe
                                            width="100%"
                                            height="150"
                                            src={getYoutubeEmbedUrl(image.youtube_link)}
                                            title={image.title || "YouTube Video"}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    ) : (
                                        <img
                                            src={`${config.backEndBaseUrl}${image.path}`}
                                            alt={image.title || "Banner Image"}
                                            style={{ cursor: 'pointer' }} // Pointer cursor for images
                                        />
                                    )}
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
        </div >
    );
};

export default HomeBanner1;