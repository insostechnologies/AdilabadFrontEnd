import React, { useState, useRef } from 'react';
import './NotiCard.css';
import { config } from '../../../../config';

const NotiCard = ({ image, title, time, url, message, uid, onRemove }) => {
	const [isModalOpen, setIsModalOpen] = useState(false); // State to track modal visibility
	const [modalImage, setModalImage] = useState(''); // State to store image URL for modal
	const imageRef = useRef(null); // Reference to the image element



	// Open modal when image is clicked
	const openModal = (e) => {
		e.stopPropagation(); // Prevent any other event handler from triggering
		setModalImage(config.backEndBaseUrl + image); // Set the image URL for the modal
		setIsModalOpen(true); // Open the modal
	};

	// Close modal
	const closeModal = () => {
		setIsModalOpen(false); // Close the modal
		setModalImage(''); // Clear the image URL
	};

	// Custom click handler for the card
	const handleCardClick = () => {
		window.location.href = url; // Redirect to the specified URL
	};

	return (
		<>
			<div className="noti-card" onClick={handleCardClick}> {/* Handle the click manually */}
				<div className="rows">
					<img
						ref={imageRef} // Attach ref to the image
						src={config.backEndBaseUrl + image}
						alt=""
						onClick={(e) => {
							e.stopPropagation(); // Stop the event from propagating to the card's onClick
							openModal(e); // Open modal on image click
						}}
					/>
				</div>
				<div className="text rows">
					<h4>{title}</h4>
					<p>{message}</p>
				</div>
				<div className="rows">
					<p className="time">{time}</p> {/* Display time ago */}
					{/* Add remove button */}
					<button
						onClick={(e) => {
							e.preventDefault(); // Prevent default behavior of Link
							e.stopPropagation(); // Stop event from bubbling up
							onRemove();
						}}
						className="remove-button"
					>
						Remove
					</button>
				</div>
			</div>

			{/* Modal for displaying image */}
			{isModalOpen && (
				<div className="modal" onClick={closeModal}>
					<div className="modal-content" onClick={(e) => e.stopPropagation()}>
						<img src={modalImage} alt="Notification" className="modal-image" />
						<button className='btn btn-sm btn-danger mt-2' onClick={closeModal}>close</button>
					</div>
				</div>
			)}
		</>
	);
};

export default NotiCard;
