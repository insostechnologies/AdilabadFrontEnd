import React, { useEffect, useState } from 'react';
import "./OrderPlace.css";
import Banner1 from '../../components/Assets/Images/Banner5_1.jpeg';
import whatsapp_pnp from '../../components/Assets/Images/whatsapp_pnp.png';
import call from '../../components/Assets/Images/call.png';
import { Link, useParams } from 'react-router-dom';
import { config } from '../../../config.js';
import Spinner from 'react-bootstrap/Spinner';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { LiaRupeeSignSolid } from "react-icons/lia";
import { TiTickOutline } from "react-icons/ti";
import { IoArrowBack } from "react-icons/io5";
import { Modal } from 'react-bootstrap';
// import { config } from '../../../config.js';

function OrderPlace() {
    let { id } = useParams();
    const [isExpanded, setIsExpanded] = useState(true);
    const [orderData, setOrderData] = useState(null);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const fetchOrderData = async (orderId) => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/order/${orderId}`, {
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
                setOrderData(result.data);
            } else {
                throw new Error('Failed to fetch order data');
            }
        } catch (error) {
            console.error('Fetching order failed', error);
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchOrderData(id);
    }, [id]);

    if (!orderData) {
        return (
            <div className="spinnerCon">
                <Spinner animation="border" />
            </div>
        );
    }

    const calculateTotalAmount = () => {
        // Convert all values to integers or default to 0 if not provided
        const basePrice = (parseInt(orderData.product.price) || 0) * (parseInt(orderData.qty) || 1);
        const discountAmount = ((parseInt(orderData.product.discount) || 0) / 100) * basePrice;
        const gst = parseInt(orderData.product.gst) || 0;
        const deliveryCharge = parseInt(orderData.store.delivery_charge) || 0;
        const gstCharge = orderData.store.gst_charge
            ? basePrice * (parseInt(orderData.store.gst_charge) / 100)
            : 0;

        // Perform the total calculation
        const total = basePrice - discountAmount + gst + deliveryCharge + gstCharge;

        // Return the calculated total or 0 if it's invalid
        return isNaN(total) ? 0 : total;
    };


    const totalAmount = calculateTotalAmount();

    const placeOrder = async (orderId) => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/order/place/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            if (result.status) {
                toast.success('Order Placed', { position: 'top-center' });
                setShowModal(true);
                setTimeout(() => {
                    window.location.href = '/order/history';
                }, 1500);
            } else {
                throw new Error('Failed to place order');
            }
        } catch (error) {
            console.error('Placing order failed', error);
            setError(error.message);
        }
    };

    const handleBackClick = () => navigate(-1);
    const handleClose = () => setShowModal(false);





    return (
        <>
            <div className="order-cards-container">
                <ToastContainer />
                <div className={`order-card ${isExpanded ? 'expanded' : 'collapsed'}`}>
                    <div className="order-header">
                        <div className="order-id">
                            <span>ORDER ID &nbsp; #{id}</span>
                        </div>
                    </div>
                    <div className="order-content">
                        <div className="order-details">
                            <img src={orderData.product?.images?.[0]?.path ? config.backEndBaseUrl + orderData.product.images[0].path : config.backEndBaseUrl + config.placeHolderImage} alt="Product_Image" />
                            <div className="product-info">
                                <h3>Product: {orderData.product.name}</h3>
                                <p>Shop: {orderData.store.name}</p>
                                <p>Date: {new Date(orderData.created_at).toLocaleDateString()}</p>
                                <p>Order Status: {orderData.status}</p>
                            </div>
                        </div>
                        <div className="order-summary">
                            {/* New list */}
                            <p>
                                {orderData.product.name}: <span><LiaRupeeSignSolid />{orderData.product.price}</span>
                            </p>
                            <p>
                                Qty: <span>{orderData.qty}</span>
                            </p>
                            <p>
                                Discount: <span>{orderData.product.discount}%</span> {/* Display percentage */}
                            </p>
                            <p>
                                + Other Taxes: <span><LiaRupeeSignSolid />{orderData.product.gst}</span>
                            </p>
                            <p>
                                + {orderData.store.delivery_title}: <span><LiaRupeeSignSolid />{orderData.store.delivery_charge}</span>
                            </p>
                            {
                                orderData.store.gst_charge ?
                                    <p>
                                        + {orderData.store.gst_title}: <span><LiaRupeeSignSolid />({orderData.store.gst_charge}%)</span>
                                    </p>
                                    : ''
                            }
                            {/* Display Total Amount Payable */}
                            <p className="total">
                                Total Amount Payable: <span><LiaRupeeSignSolid />{totalAmount.toFixed(2)}</span> {/* Display total amount */}
                            </p>
                            <p className='cod'>
                                <TiTickOutline className='cod-tick' /> Cash On Delivery
                            </p>
                        </div>

                        <button onClick={() => { placeOrder(orderData.uid) }} className="track-order-btn mx-auto">Place Order</button>

                        {/* Modal start */}
                        <Modal show={showModal} onHide={handleClose} centered>
                            <Modal.Header closeButton>
                                <button onClick={handleBackClick}> <IoArrowBack size={25} /></button>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="modal-step">
                                    <p>Your Booking/Order Enquiry has been successfully sent to the business/store owners.</p>
                                    <p><TiTickOutline size={40} color='green' /></p>
                                    <p>Contact store for confirmation.</p>
                                    <div className="contact-options">
                                        <span className='contact-options-icon'><img src={whatsapp_pnp} alt="what-app" /></span>
                                        <span className='contact-options-icon'><img src={call} alt="call" /></span>
                                    </div>
                                </div>
                                <div className="view-products-link">
                                    <IoArrowBack />
                                    <Link to={`/product/service/${id}`} onClick={handleClose} className='view-link'>View more Products/Services</Link>
                                </div>
                            </Modal.Body>
                            <Modal.Footer style={{ fontStyle: 'italic' }}>
                                Thank you!
                            </Modal.Footer>
                        </Modal>
                        {/* modal end */}
                        <div className='btn-wrapper'>
                            <button onClick={handleBackClick}> <IoArrowBack /> Back</button>
                            <button onClick={handleBackClick}> Cancel </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrderPlace;