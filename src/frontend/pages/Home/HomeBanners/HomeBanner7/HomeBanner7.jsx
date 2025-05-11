import React from 'react';
import "./HomeBanner7.css";
import "./mediaQuery.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { config } from '../../../../../config';
import Spinner from 'react-bootstrap/Spinner';
import { leadsAdd } from '../../../../../utils/apiCall'; // Import leadsAdd function

const HomeBanner7 = ({ banner }) => {
    const user_id = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).uid : '';

    const handleBannerClick = async (image) => {
        try {
            const result = await leadsAdd(user_id, image.uid, 'banner'); // Assuming image.id is the item_id
            console.log('Lead added:', result);
        } catch (error) {
            console.error('Error adding lead:', error);
        }
        if (image.link) {
            window.open(image.link, '_blank');
        }
    };

    return (
        <div className="home-banner7-container">
            <div className='title'>
                <p>{banner.title}</p>
            </div>
            <div className="home-banner7-inner">
                <Carousel infiniteLoop showThumbs={false} showArrows={false} showStatus={false} autoPlay={true}>
                    {
                        banner && banner.banners.length > 0 ? banner.banners.filter((image) => {return image.status !== 0}).map((image, index) => (
                            <div className='Home-banner7' key={index} onClick={() => handleBannerClick(image)}>
                                <img src={`${config.backEndBaseUrl}${image.path}`} alt={image.alt || "Banner Image"} />
                            </div>
                        )) : (
                            <div className='Home-banner spinner' key={1}>
                                <Spinner animation="border" />
                            </div>
                        )
                    }
                </Carousel>
            </div>
        </div>
    );
}

export default HomeBanner7;