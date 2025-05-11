import React from 'react';
import "./HomeBanner3Rectangle.css";
import "./mediaQuery.css";
import { config } from '../../../../../config';
import { leadsAdd } from '../../../../../utils/apiCall'; // Import leadsAdd function

function HomeBanner3Rectangle({ banner }) {
	const user_id = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).uid : '';

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

	const handleBannerClick = async () => {
		try {
			const result = await leadsAdd(user_id, banner.banners[0].uid, 'banner'); // Assuming banner.banners[0].id is the item_id
			console.log('Lead added:', result);
		} catch (error) {
			console.error('Error adding lead:', error);
		}

		if (banner.banners[0].link) {
			window.open(banner.banners[0].link, '_blank');
		}
	};

	return (
		<div className="home-rect-banner3-container" onClick={handleBannerClick}>
			{
				banner.banners[0].youtube_link ? (
					<iframe
						width="100%"
						height="200"
						src={getYoutubeEmbedUrl(banner.banners[0].youtube_link)}
						title={banner.banners[0].title || "YouTube Video"}
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
					></iframe>
				) : (
					<img
						src={`${config.backEndBaseUrl}${banner.banners[0].path}`}
						alt={banner.banners[0].title || "Banner"}
						style={{ cursor: 'pointer' }} // Pointer cursor for images
					/>
				)
			}
		</div>
	);
}

export default HomeBanner3Rectangle;