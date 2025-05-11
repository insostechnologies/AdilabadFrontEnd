import React from 'react'
import './NotiCard.css'
import { Link } from 'react-router-dom'

const NotiCard = ({ image, title, time, details, url }) => {

	function timeSince(dateString) {
		const date = new Date(dateString); // Parse the input date string
		const now = new Date(); // Get the current date and time
		const seconds = Math.floor((now - date) / 1000); // Difference in seconds

		const intervals = [
			{ label: 'year', seconds: 31536000 },
			{ label: 'month', seconds: 2592000 },
			{ label: 'day', seconds: 86400 },
			{ label: 'hour', seconds: 3600 },
			{ label: 'minute', seconds: 60 },
			{ label: 'second', seconds: 1 },
		];

		for (const interval of intervals) {
			const count = Math.floor(seconds / interval.seconds);
			if (count > 0) {
				return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
			}
		}
		return 'just now';
	}

	return (
		<Link to={url} className='noti-card'>
			<div className="rows">
				<img src={image} alt="" />
			</div>
			<div className="text rows">
				<h4>{title}</h4>
				{/* <p>Subtitle {title }</p> */}
				<p>{details}</p>
			</div>
			<div className="rows"><p className='time'>{timeSince(time)}</p></div>
		</Link>
	)
}

export default NotiCard