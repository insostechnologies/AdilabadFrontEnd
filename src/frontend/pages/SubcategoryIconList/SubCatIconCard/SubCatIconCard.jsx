import React from 'react';
import './SubCatIconCard.css';
import './mediaQuery.css';
import arrow from '../../../components/Assets/Images/arrow-forward.png';
import { Link } from 'react-router-dom';
import { config } from '../../../../config';
import { leadsAdd } from '../../../../utils/apiCall'; // Import leadsAdd function

const SubCatIconCard = ({ category }) => {
	const user_id = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).uid : '';

	const handleCardClick = async () => {
		try {
			const result = await leadsAdd(user_id, category.uid, 'sub-category'); // Assuming category.uid is the item_id
			console.log('Lead added:', result);
		} catch (error) {
			console.error('Error adding lead:', error);
		}
	};

	return (
		<Link to={`/stores/view/${category.uid}`} className='Sub-Cat-Icon-Card' onClick={handleCardClick}>
			<div className="box-left card-box">
				<img className='category_img' src={category.icon_img_path ? config.backEndBaseUrl + category.icon_img_path : config.backEndBaseUrl + config.placeHolderImage} alt="" />
				<p className='card-box-title'>{category.name}</p>
			</div>
			<div className="box-right card-box">
				{
					category.new_tag == 1 ? <p className='new-tag'>{category.new_tag_text}</p> : ''
				}
				
				<p className='card-box-num'>{category.store_count > 0 ? category.store_count : ""}</p>
				<img src={arrow} alt="" />
			</div>
		</Link>
	);
}

export default SubCatIconCard;