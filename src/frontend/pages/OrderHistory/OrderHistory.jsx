import React, { useEffect, useState } from 'react';
import './OrderHistory.css';
import './mediaQuery.css';
import MobileHeader from '../../components/MobileHeader/MobileHeader';
import { ToastContainer } from 'react-toastify';
import uparrow from '../../components/Assets/Images/up-arrow.png';
import Banner1 from '../../components/Assets/Images/Banner5_1.jpeg';
import whatsapp_pnp from '../../components/Assets/Images/whatsapp_pnp.png';
import call from '../../components/Assets/Images/call.png';
import { LiaRupeeSignSolid } from "react-icons/lia";
import { config } from '../../../config.js';
import { Link } from 'react-router-dom';
import { FaAngleRight } from 'react-icons/fa6';

const OrderHistory = () => {
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const toggleCard = (orderId) => {
        setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
    };

    const user_id = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).uid : '';

    const fetchUserOrders = async (user_id) => {
        setLoading(true);
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/user/orders/${user_id}`, {
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
                setOrders(result.data);
                // Automatically expand the first order if available
                if (result.data.length > 0) {
                    setExpandedOrderId(result.data[0].uid); // Expand the first order
                }
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user_id) {
            fetchUserOrders(user_id);
        }
    }, [user_id]);

    // Status mapping
    const statusNames = {
        placed: 'Placed',
        accepted: 'Accepted',
        'on the way': 'On The Way',
        delivered: 'Delivered',
        rejected: 'Rejected',
        canceled: 'Canceled', // Fixed typo: 'canceled' instead of 'cancelled'
    };

    // Function to determine the progress percentage based on order status
    const getProgressPercentage = (status) => {
        switch (status) {
            case 'placed':
                return 20; // Set appropriate percentage for 'placed'
            case 'accepted':
                return 40; // Set appropriate percentage for 'accepted'
            case 'on the way':
                return 60; // Set appropriate percentage for 'on the way'
            case 'delivered':
                return 100; // Full progress for 'delivered'
            case 'rejected':
                return 0; // No progress for 'rejected'
            case 'canceled':
                return 0; // No progress for 'canceled'
            default:
                return 0; // Default to 0 if status is unknown
        }
    };

    // Handle phone and WhatsApp actions
    const handlePhone = (store) => {
        const phoneNumbers = store?.details?.filter(detail => detail.type === 'phone').map(detail => detail.value);
        window.open(`tel:${phoneNumbers[0] ? phoneNumbers[0] : ''}`);
    };

    const handleWhatsapp = (order) => {
        // Prepare the message for the store owner
        const message = `
            Order Details:
            Order ID: #${order.uid}
            Product: ${order.product?.name || "Unknown Product"}
            Quantity: ${order.qty}
            Price: ₹${order.product.price}
            Discount: ${order.product.discount}%
            Store: ${order.store?.name || "Unknown Store"}
            Customer: ${order.user?.user_name || "Unknown User"}
            Status: ${order.status.toUpperCase()}
            Delivery Charge: ₹${order.store.delivery_charge}
            Total Amount: ₹${calculateTotalAmount(order).toFixed(2)}
        `;

        // Encode the message to ensure it's URL safe
        const encodedMessage = encodeURIComponent(message);

        // Send the message via WhatsApp
        const whatsappNumbers = order?.store?.details?.filter(detail => detail.type === 'whatsapp').map(detail => detail.value);
        window.open(`https://wa.me/${whatsappNumbers[0]}?text=${encodedMessage}`, '_blank');
    };

    const calculateTotalAmount = (orderData) => {
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

    // Function to handle the share button
    const handleShare = (order) => {
        const shareData = {
            title: `Order Details for Order #${order.uid}`,
            text: `Check out this order from ${order.store?.name || "Unknown Store"}!`,
            url: `${config.frontEndBaseUrl}product/service/${order.store.uid}`, // Current URL to share
        };

        // Check if the Web Share API is available
        if (navigator.share) {
            navigator.share(shareData)
                .then(() => console.log('Order shared successfully!'))
                .catch((error) => console.error('Error sharing the order:', error));
        } else {
            // Fallback: Open the URL in a new tab (or provide a custom share link)
            const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
            window.open(shareUrl, '_blank');
        }
    };

    return (
        <>
            <MobileHeader title={"My Orders"} ordersCount={orders.length} />
            <ToastContainer />
            <div className='order-con'>
                <div className="order-cards-container">
                    {loading ? (
                        <div className="spinnerCon">
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        orders.map(order => (
                            <div key={order.uid} className={`order-card ${expandedOrderId === order.uid ? 'expanded' : 'collapsed'}`}>
                                <div className="order-header" onClick={() => toggleCard(order.uid)}>
                                    <div className="order-header-top-sec">
                                        <div className="arrow">
                                            <img src={uparrow} alt="arrow" style={{ transform: expandedOrderId === order.uid ? 'rotate(0deg)' : 'rotate(360deg)' }} />
                                        </div>
                                        <div className="order-id">
                                            <div className='orderDt'>
                                                <span>{order.product?.name || "Unknown Product"}</span>
                                                <span className='date'>{new Date(order.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <span className='view'> View</span>
                                        </div>
                                    </div>
                                    {expandedOrderId === order.uid && (
                                        <div className="order-summary-collapsed">
                                            <img src={order.product?.images?.[0]?.path ? config.backEndBaseUrl + order.product.images[0].path : config.backEndBaseUrl + config.placeHolderImage} alt="Product_Image" />
                                            <span className="product-name">{order.product?.name || "Product Name"}</span>
                                        </div>
                                    )}
                                </div>
                                {expandedOrderId === order.uid && (
                                    <div className="order-content">
                                        <div className="order-details">
                                            <img src={order.product?.images?.[0]?.path ? config.backEndBaseUrl + order.product.images[0].path : config.backEndBaseUrl + config.placeHolderImage} alt="Product_Image" />
                                            <div className="product-info">
                                                <p>Order Id : <b>#{order.uid}</b></p>
                                                <p>Product: <b>{order.product?.name || "Unknown Product"}</b></p>
                                                <p>Store: <b>{order.store?.name || "Unknown Store"}</b></p>
                                                <p>Shop: <b>{order.user?.user_name || "Unknown User"}</b></p>
                                                <p>Date: <b>{new Date(order.created_at).toLocaleDateString()}</b></p>
                                                <p className='oStatus'>Order Status :&nbsp;<b>{order.status.toUpperCase()}</b></p>
                                                <p className='store-details'>
                                                    <div>
                                                        Store Contact :
                                                    </div>
                                                    <div>
                                                        <img onClick={() => handleWhatsapp(order)} className='contact-options-icon' src={whatsapp_pnp} alt="whatsapp" />
                                                        <img onClick={() => handlePhone(order.store)} className='contact-options-icon' src={call} alt="call" />
                                                    </div>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="order-summary">
                                            {/* New list */}
                                            <p>{order.product.name}:
                                                <span><LiaRupeeSignSolid />{order.product.price}</span></p>
                                            <p> Qty:
                                                <span>{order.qty}</span></p>
                                            <p> Discount:
                                                <span>{order.product.discount}%</span></p> {/* Display percentage */}
                                            {/* Display other taxes */}
                                            <p> + Other Taxes:
                                                <span><LiaRupeeSignSolid />{order.product.gst}</span></p>
                                            <p> + {order.store.delivery_title}:
                                                <span><LiaRupeeSignSolid />{order.store.delivery_charge}</span></p>
                                            {
                                                order.store.gst_charge ?
                                                    (<p> + {order.store.gst_title}:
                                                        <span><LiaRupeeSignSolid />({order.store.gst_charge}%)</span></p>)
                                                    : ''
                                            }
                                            {/* Display Total Amount Payable */}
                                            <p className="total"> Total Amount :
                                                <span><LiaRupeeSignSolid />{calculateTotalAmount(order).toFixed(2)}</span></p>
                                        </div>
                                        <div className="progress-container">
                                            <div className="progress-bar" style={{ width: `${getProgressPercentage(order.status)}%` }} />
                                        </div>
                                        {/* Share Button */}
                                        <div className="view-products-link">
                                            <Link onClick={() => handleShare(order)} className="share-btn">
                                                Share this Product <FaAngleRight />
                                            </Link>
                                        </div>
                                        {/* Link to view more products */}
                                        <div className="view-products-link">
                                            <Link to={`/product/service/${order.product?.store_id}`} className='view-link'>View more products of this store
                                                <FaAngleRight /></Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default OrderHistory;
