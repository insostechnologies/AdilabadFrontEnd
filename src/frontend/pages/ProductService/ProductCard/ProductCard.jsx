import React, { useState, useEffect } from 'react'
import './ProductCard.css'
import './MediaQuery.css';
import { MdOutlinePeopleOutline } from 'react-icons/md'
import { IoIosCall } from 'react-icons/io'
import { FaWhatsapp } from 'react-icons/fa6'
import { FaHeart } from "react-icons/fa";
import { IoMdShare } from "react-icons/io";
import { config } from '../../../../config';
import { Modal, Button } from 'react-bootstrap';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { leadsAdd } from '../../../../utils/apiCall';
import { LiaRupeeSignSolid } from "react-icons/lia";
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { AiOutlineClose } from "react-icons/ai";

const ProductCard = ({ product, store, permissions }) => {
	const [show, setShow] = useState(false);
	const [showAddress, setShowAddress] = useState(false);
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [message, setMessage] = useState('');
	const [quantity, setQuantity] = useState(1);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [contactType, setContactType] = useState('');
	const [contacts, setContacts] = useState([]);
	const [localArea, setLocalArea] = useState('');
	const [city, setCity] = useState('');
	const [state, setState] = useState('');
	const [pincode, setPincode] = useState('');
	const [orderId, setOrderId] = useState('')
	const [landMark, setLandMark] = useState('')
	const user_id = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).uid : '';
	const [isAnimating, setIsAnimating] = useState(false);
	const [isImageModalOpen, setIsImageModalOpen] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);


	const navigate = useNavigate();

	const incrementQuantity = () => {
		setQuantity(quantity + 1);
	};
	const decrementQuantity = () => {
		if (quantity > 1) {
			setQuantity(quantity - 1);
		}
	};

	const formatPhoneNumber = (phoneNumber) => {
		// Trim whitespace
		phoneNumber = phoneNumber.trim();

		// Check if it starts with "+91" or "91"
		if (!phoneNumber.startsWith('+91')) {
			if (phoneNumber.startsWith('91')) {
				// Add "+" if it starts with "91"
				phoneNumber = '+' + phoneNumber;
			} else {
				// Add "+91" if it doesn't start with either
				phoneNumber = '+91' + phoneNumber;
			}
		}
		return phoneNumber;
	}

	let images = product.images
	let imageQuantities = product.images.length
	// console.log(store);
	useEffect(() => {
		// Trigger animation on quantity change
		setIsAnimating(true);

		// Remove animation class after it completes
		const timeout = setTimeout(() => {
			setIsAnimating(false);
		}, 500); // Match the CSS animation duration

		return () => clearTimeout(timeout); // Cleanup timeout
	}, [quantity]);

	// query form modal
	const handleShow = async () => {
		setShow(true)
		try {
			const response = await fetch(`${config.backEndBaseUrl}api/user/${user_id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const result = await response.json();
			if (result.status) {
				let user = result.data
				setName(user.user_name)
				setPhone(user.phone)
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};
	const handleClose = () => setShow(false);
	const handleCloseAddress = () => setShowAddress(false);
	const [siteDetails, setSiteDetails] = useState(null);

	const settings = {
		// dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		autoplay: true,
		arrows: false,

	};
	const settings2 = {
		// dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		autoplay: true
	};

	const handleAddressSubmit = async (event) => {
		event.preventDefault();

		// Validate input fields
		if (!localArea || !city || !landMark) {
			toast.error('Please fill in all fields.', {
				position: 'top-center',
			});
			return; // Exit the function if validation fails
		}



		const profileData = {
			localArea,
			city,
			pincode,
			landMark,
			userId: user_id,
			state: ''
		};

		try {
			const response = await fetch(`${config.backEndBaseUrl}api/user/address/add`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(profileData),
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const result = await response.json();
			console.log('Success:', result);

			if (result.status) {
				toast.success('Address Added', {
					position: 'top-center',
				});
				window.location.href = `/order/place/${orderId}`;
			}
		} catch (error) {
			console.error('Error:', error);
			// toast.error('Failed to add address. Please try again.', {
			// 	position: 'top-center',
			// });
		}
	};

	const handleCardClick = async () => {
		try {
			let orderData = {
				userId: user_id,
				productId: product.uid,
				qty: quantity
			}

			const response = await fetch(`${config.backEndBaseUrl}api/user/order/add`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(orderData),
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const result = await response.json();

			if (result.status) {
				let id = result.data.orderId;
				setOrderId(id)
				if (result.data.isAddress) {
					navigate(`/order/place/${id}`);
					// toast.success('Enquiry Submitted', {
					// 	position: 'top-center',
					// });
				} else {
					setShowAddress(true)
				}

			}
		} catch (error) {
			console.error('Error:', error);
		}
	};


	const handleQuerySubmit = async (event) => {
		event.preventDefault();


		const enquiryData = {
			userId: user_id,
			name,
			phone,
			message,
			storeId: product.store_id
		};

		try {
			const response = await fetch(`${config.backEndBaseUrl}api/user/enquiry/add`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(enquiryData),
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const result = await response.json();
			// console.log('Success:', result);
			if (result.status) {
				toast.success('Enquiry Submitted', {
					position: 'top-center',
				});
			}
			handleClose()
			setName('');
			setPhone('');
			setMessage('');
			//alert('Your enquiry has been sent successfully!');
		} catch (error) {
			console.error('Error:', error);
			//alert('There was an error sending your enquiry. Please try again later.');
		}
	};

	const getButtonText = (cartAction) => {
		if (cartAction === 'orderNow') {
			return 'Order Now';
		} else if (cartAction === 'bookNow') {
			return 'Book Now';
		} else if (cartAction === 'addToCart') {
			return 'Add to Cart';
		}
		return 'Add to Cart'; // Default case if none match
	};


	const fetchSiteDetails = async () => {
		try {
			const response = await fetch(`${config.backEndBaseUrl}api/user/site/details`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			if (result.status) {
				setSiteDetails(result.data);
				console.log(result.data)
			} else {
				console.log('Internal server error');
			}

		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	useEffect(() => {
		fetchSiteDetails();
	}, []);



	// Extract phone numbers and WhatsApp numbers
	const phoneNumbers = store.details.filter(item => item.type === 'phone').map(item => item.value);
	const whatsappNumbers = store.details.filter(item => item.type === 'whatsapp').map(item => item.value);

	const handleContactAction = (type) => {
		const contactsList = type === 'phone' ? phoneNumbers : whatsappNumbers;

		if (contactsList.length > 0) {
			setContactType(type);
			setContacts(contactsList);
			setIsModalOpen(true);
		} else {
			alert(`No ${type === 'phone' ? 'phone' : 'WhatsApp'} number available`);
		}
	};

	function getFormattedDateTime() {
		const date = new Date();
		
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
		const day = String(date.getDate()).padStart(2, '0');
		
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const seconds = String(date.getSeconds()).padStart(2, '0');
	
		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	}

	const handleContactSelect = async (contact, contactType) => {
		// Record the lead in the backend
		const leadsData = {
			userId: user_id,
			storeId: store.uid,
			type: contactType,
			date: getFormattedDateTime(),
		};

		try {
			const response = await fetch(`${config.backEndBaseUrl}api/store/leads/add`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(leadsData),
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			console.log(`Lead recorded for ${contactType} contact: ${contact}`);
		} catch (error) {
			console.error('Error:', error);
			console.error('There was an error recording the lead. Please try again later.');
		}

		// Open the appropriate contact method
		if (contactType === 'phone') {
			window.open(`tel:${contact}`);
		} else if (contactType === 'whatsapp') {
			const message = `Hi,${store.owner_name}

${store.name}
Link- ${config.frontEndBaseUrl}store/${store.uid}
Please reply ...

*Message from ${siteDetails?.seoDetails?.name}*`;
			window.open(`https://wa.me/${contact}?text=${encodeURIComponent(message)}`);
		}

		setIsModalOpen(false); // Close the modal after selection
	};



	const handleImageClick = (image) => {
		setSelectedImage(image);
		setIsImageModalOpen(true);
	};

	const handleImageModalClose = () => {
		setIsImageModalOpen(false);
		setSelectedImage(null);
	};

	return (
		<>
			{/* <ToastContainer /> */}
			<div className='product-card'>
				<div className="upper-box">
					<div className="image-box">
						<Slider {...settings}>
							{images.map((img, index) => (
								<div
									key={index}
									className="image-container"
									onClick={() =>
										handleImageClick(
											img && img.path
												? config.backEndBaseUrl + img.path
												: config.backEndBaseUrl + config.placeHolderImage
										)
									}
								>
									<img
										src={
											img && img.path
												? config.backEndBaseUrl + img.path
												: config.backEndBaseUrl + config.placeHolderImage
										}
										alt="img"
										className="slider-image"
									/>
									{img.title && <span className="image-title">{img.title}</span>}
								</div>
							))}
						</Slider>

						<span className='images-count'>{imageQuantities} images</span>
						{/* <span className='pt-icon'><IoMdShare /></span>
					<span className='pt-icon2'><FaHeart /></span> */}
					</div>
					<div className="product-details">
						<h5>{product.name}</h5>
						{product.short_desc == '' ? null : <p className="product-des" dangerouslySetInnerHTML={{ __html: product.short_desc }}></p>}
						<p className='offer-price'> <LiaRupeeSignSolid />{parseInt(product.selling_price).toFixed(2)} {product.discount > 0 ? <span>(- {product.discount}% oFF)</span> : ''} </p>
						{product.discount > 0 ? <p className='original-price'>MRP <span ><LiaRupeeSignSolid /> {parseInt(product.price).toFixed(2)} </span> </p> : ''}
						{/* <p className='tax-charger'>Tax Charges: <span > 00 </span> </p> */}

						<div className="cart-options">
							{
								product.cart_action == '' || product.stock_status == '' ? null :
									product.stock_status == 'outOfStock' ?
										<button class="out-of-stock" disabled>Out Of Stock</button>
										:
										<button class="in-stock" onClick={handleCardClick}>
											{getButtonText(product.cart_action)}
										</button>
							}

							{
								product.cart_action == '' || product.stock_status == '' ? null :
									product.type == 'product' && product.stock_status != 'outOfStock' ? (
										<div className="cart-change">
											<button className='cart-quantity sub' onClick={decrementQuantity}>-</button>
											<div className='qBx'>
												<span className={`quantity ${isAnimating ? "scroll-animate" : ""}`} >{quantity}</span>
											</div>
											<button className='cart-quantity add' onClick={incrementQuantity}>+</button>
										</div>
									) : ''
							}
							<span className='out-of'>{/* Out of stock */}</span>
						</div>
						{
							product.ordered > 0 &&
							<h6 className='enquired-text'> <MdOutlinePeopleOutline className='enquired-icon' /> {product.ordered} people ordered </h6>
						}

					</div>
				</div>
				<div className="lower-box">
					{
						permissions?.contact_social_details == '1' ?
							<div className="lower-box-inner">
								<div className="rows-action">
									<button onClick={() => handleContactAction('phone')}> <IoIosCall className='call-svg' /> Call Now</button>
									<p> <MdOutlinePeopleOutline /> {store.total_calls}</p>
								</div>
								<div className="rows-action">
									<button onClick={() => handleContactAction('whatsapp')}> <FaWhatsapp className='chat-svg' /> Chat Now</button>
									<p> <MdOutlinePeopleOutline /> {store.total_chats}</p>
								</div>
								<div className="rows-action">
									<button onClick={handleShow}>Send Enquiry</button>
									<p> <MdOutlinePeopleOutline /> {store.total_enquiries}</p>
								</div>
							</div>
							: null
					}

					{/* Inline Modal for selecting contact */}
					{isModalOpen && (
						<div className="modal-overlay">
							<div className="modal-content">
								<h3>Select a Contact</h3>
								<ul>
									{contacts.map((contact, index) => (
										<li key={index} onClick={() => handleContactSelect(formatPhoneNumber(contact), contactType)}>
											{formatPhoneNumber(contact)}
										</li>
									))}
								</ul>
								<button className='btn btn-sm btn-danger' onClick={() => setIsModalOpen(false)}>Close</button>
							</div>
						</div>
					)}
				</div>
				{/* Modal */}
				<Modal show={showAddress} onHide={handleCloseAddress} centered>
					<Modal.Header closeButton>
						<Modal.Title className="modal-title-custom">
							Add a Biling Address
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<form >
							<input className='input-area-custom' name="" id="area" placeholder='Enter area/Colony Name' onChange={(e) => setLocalArea(e.target.value)} />
							<input className='input-area-custom' name="" id="city" placeholder='Enter your city' onChange={(e) => setCity(e.target.value)} />
							{/* <input className='input-area-custom' name="" id="state" placeholder='Enter your state' onChange={(e) => setState(e.target.value)} /> */}
							{/* <input className='input-area-custom' name="" id="pincode" type="number" placeholder='Enter area pin code' onChange={(e) => setPincode(e.target.value)} /> */}
							<input className='input-area-custom' name="" id="area" placeholder='Enter Near by landmark' onChange={(e) => setLandMark(e.target.value)} />
							<Button variant="danger" onClick={handleAddressSubmit} className='submit-button-custom'> Submit </Button>
						</form>
					</Modal.Body>
				</Modal>
				<Modal show={show} onHide={handleClose} centered>
					<Modal.Header closeButton>
						<Modal.Title className="modal-title-custom">
							Send your queries
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<form >
							<input
								className='input-area-custom'
								type="text"
								placeholder='Enter your Name'
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
							<input
								className='input-area-custom'
								type="number"
								placeholder='Enter your Phone'
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
							/>
							<textarea
								className='input-area-custom'
								name=""
								id="message"
								placeholder='Enter your Message'
								onChange={(e) => setMessage(e.target.value)}
							></textarea>
							<Button variant="danger" onClick={handleQuerySubmit} className='submit-button-custom'>
								Send Enquiry
							</Button>
						</form>
					</Modal.Body>
				</Modal>
				{/* Image Modal */}
				<Modal show={isImageModalOpen} onHide={handleImageModalClose} centered>
					<Modal.Header closeButton>
						{/* <Modal.Title>Image Preview</Modal.Title> */}
					</Modal.Header>
					<Modal.Body>
						<Slider {...settings2}>
							{images.map((img, index) => (
								<div
									key={index}
									className="image-container"
									onClick={() =>
										handleImageClick(
											img && img.path
												? config.backEndBaseUrl + img.path
												: config.backEndBaseUrl + config.placeHolderImage
										)
									}
								>
									<img
										src={
											img && img.path
												? config.backEndBaseUrl + img.path
												: config.backEndBaseUrl + config.placeHolderImage
										}
										alt="img"
										className="slider-image"
									/>
									{img.title && <span className="image-title">{img.title}</span>}
								</div>
							))}
						</Slider>
					</Modal.Body>
				</Modal>
			</div>
		</>
	)
}

export default ProductCard