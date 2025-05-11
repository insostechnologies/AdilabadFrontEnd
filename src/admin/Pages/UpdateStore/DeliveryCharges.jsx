import React, { useEffect, useRef, useState } from 'react';
import './UpdateStore.css';
import { config } from '../../../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate, useParams } from 'react-router-dom';


function DeliveryCharges() {

    const [deliveryTitle, setDeliveryTitle] = useState('');
    const [deliveryCharge, setDeliveryCharge] = useState(0);
    const { uid } = useParams();
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();

    const fetchStore = async (uid) => {
        setIsLoading(true)
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/store/${uid}`, {
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
                let store = result.data
                setDeliveryTitle(store.delivery_title)
                setDeliveryCharge(store.delivery_charge)
            }

        } catch (error) {
            console.error('Error fetching categories:', error);
            // Handle error state or display error message
        } finally {
            setIsLoading(false)
        }
    };

    // Form Submit sec.
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true)

        try {

            let jsonData = {
                deliveryTitle: deliveryTitle,
                deliveryCharge: deliveryCharge
            }
            // Send the request
            const response = await fetch(`${config.backEndBaseUrl}api/store/delivery/update/${uid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (!result.status) {
                toast.error(result.errors[0].msg, {
                    position: 'top-center',
                });
            } else {
                toast.success(result.message, {
                    position: 'top-center',
                });
                navigate('/admin/store/list');
            }


        } catch (error) {
            console.error('Error adding data:', error);
        } finally {
            setIsLoading(false);
        }
    };
    // ____

    useEffect(() => {
        fetchStore(uid)
    }, [])




    return (
        <>
            <div class="wg-box wg-box-container">
                <form class="form-new-product form-style-1" onSubmit={handleSubmit}>
                    <ToastContainer />

                    <fieldset className="name">
                        <div className="body-title">Delivery Title:</div>
                        <input className="flex-grow" type="text" placeholder="Delivery Title" value={deliveryTitle} onChange={(e) => setDeliveryTitle(e.target.value)} />
                    </fieldset>

                    <fieldset className="name">
                        <div className="body-title">Delivery Charge:</div>
                        <input className="flex-grow" type="text" placeholder="Delivery Charge" value={deliveryCharge} onChange={(e) => setDeliveryCharge(e.target.value)} />
                        {/* <span style={{ fontSize: '40px' }}>%</span> */}
                    </fieldset>

                    <div className="bot">
                        <button className="tf-button w208 mx-auto" type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default DeliveryCharges