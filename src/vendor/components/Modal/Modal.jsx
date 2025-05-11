import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, setIsOpen, onClose, children }) => {


	if (!isOpen) return null;

	return (
		<div className="my-modal-overlay" onClick={() => setIsOpen(false)}>
			<div className="my-modal-content" onClick={(e) => e.stopPropagation()}>
				{children}
				<button className="my-modal-close-button"  >
					<span onClick={() => setIsOpen(false)}>Save/Close</span>
				</button>
			</div>
		</div>
	);
};

export default Modal;