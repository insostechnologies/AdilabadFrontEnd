import React, { useEffect, useRef, useState } from 'react';
import './UpdateStore.css';
import useArrowKeyDisable from '../../customhook/useArrowKeyDisable';
import { ToastContainer, toast } from 'react-toastify';
import { config } from '../../../config';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';





function StoreOffersAddForm() {
    const inputRef = useRef(null);
    const { uid } = useParams();
    const navigate = useNavigate();

    const [discountTitle, setDiscountTitle] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            // if (discountTitle == '') {
            //     toast.error('Please discount title', {
            //         position: 'top-center',
            //     });
            //     setIsLoading(false);
            //     return;
            // } else if (discountPercentage == '') {
            //     toast.error('Please discount percentage', {
            //         position: 'top-center',
            //     });
            //     setIsLoading(false);
            //     return;
            // } else {
                let jsonData = {
                    discountTitle: discountTitle,
                    discountPercentage: discountPercentage
                }

                // Send the request
                const response = await fetch(`${config.backEndBaseUrl}api/store/offer/update/${uid}`, {
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
            // }

        } catch (error) {
            console.error('Error adding data:', error);
        } finally {
            setIsLoading(false);
        }
    };
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
                if (store.offer) {
                    setDiscountTitle(store.offer.title)
                    setDiscountPercentage(store.offer.discount)
                }
            }

        } catch (error) {
            console.error('Error fetching categories:', error);
            // Handle error state or display error message
        } finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        fetchStore(uid)
    }, [])


    useArrowKeyDisable(inputRef);


    return (
        <>
            <div class="wg-box wg-box-container">
                <form class="form-new-product form-style-1" onSubmit={handleSubmit}>
                    <ToastContainer />


                    <fieldset class="name">
                        <div class="body-title">Discount Title:</div>
                        <input class="flex-grow" type="text" placeholder="Discount title" value={discountTitle} onChange={(e) => setDiscountTitle(e.target.value)} name="text" tabindex="0" aria-required="true" required="" />
                    </fieldset>

                    <fieldset>
                        <div class="body-title">Discount Percentage:</div>
                        <input ref={inputRef} class="flex-grow" type="Number" placeholder="Discount in %" value={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.value)} name="text" tabindex="0" aria-required="true" required="" />
                    </fieldset>

                    <div class="bot">
                        <button className="tf-button w208 mx-auto" type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default StoreOffersAddForm