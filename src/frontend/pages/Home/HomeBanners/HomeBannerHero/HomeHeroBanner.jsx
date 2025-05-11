import React from 'react';
import "./HomeHeroBanner.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { config } from '../../../../../config';
import { leadsAdd } from '../../../../../utils/apiCall';

const HomeHeroBanner = ({ bannerData }) => {
    let user_id = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).uid : '';
    const handleBannerClick = async (userId, itemId, type, link) => {
        try {
            const result = await leadsAdd(userId, itemId, type);
        } catch (error) {
            console.error('Error adding lead:', error);
        }
        if (link) {
            window.open(link, '_blank');
        }
    };

    return (
        <>
            <Carousel infiniteLoop showThumbs={false} showArrows={false} showStatus={false} autoPlay={true}>
                {
                    bannerData && bannerData.length > 0 ? bannerData.filter((image) => {return image.status !== 0}).map((image, index) => (
                        <div className='Home-banner' key={index} onClick={() => handleBannerClick(user_id, image.uid, 'banner', image.link)}>
                            <img src={`${config.backEndBaseUrl}${image.path}`} alt={image.alt || "Banner Image"} />
                        </div>
                    )) : (
                        <div className='Home-banner'>
                            <img src={`${config.backEndBaseUrl}${config.placeHolderImage}`} alt="Placeholder" className='img' />
                        </div>
                    )
                }
            </Carousel>
        </>
    );
}

export default HomeHeroBanner;