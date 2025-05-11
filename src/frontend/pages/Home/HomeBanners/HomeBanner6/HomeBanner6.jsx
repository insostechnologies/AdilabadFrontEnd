import React, { useRef } from 'react';
import './HomeBanner6.css';
import './mediaQuery.css';

import banner6 from "../../../../components/Assets/Images/banner6.jpeg";
import playBtn from "../../../../components/Assets/Images/banner6PlayBtn.png";

import { HiArrowNarrowLeft, HiArrowNarrowRight } from 'react-icons/hi';
import { FaAngleRight } from "react-icons/fa6";


const banners = [
    {
        src: banner6,
        alt: "Banner 1"
    },
    {
        src: banner6,
        alt: "Banner 2"
    },
    {
        src: banner6,
        alt: "Banner 3"
    },
    {
        src: banner6,
        alt: "Banner 3"
    },
    {
        src: banner6,
        alt: "Banner 3"
    },
    {
        src: banner6,
        alt: "Banner 3"
    },
];

const HomeBanner6 = () => {

    const listRef = useRef(null);

    const handleScroll = (direction) => {
        if (direction === 'left') {
            listRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        } else {
            listRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    return (
        <div className="home-banner6-container">
            <div className='title'>
                <p>Title</p>
                <p className='see-more'>See more <FaAngleRight/></p>
            </div>
            <div className="home-banner6-inner" ref={listRef}>
                <div className="home-banner6">
                    {banners.map(banner => (
                        <>
                            <div key={banner.id} className="banner6-item">
                                <img className='banners' src={banner.src} alt={banner.alt} />
                                <img className='banner-play-btn' src={playBtn} alt='play Btn' />
                            </div>
                        </>
                    ))}
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

export default HomeBanner6;
