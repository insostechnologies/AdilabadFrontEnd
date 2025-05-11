import React, { useRef } from 'react';
import './SaveCard.css';
import './mediaQuery.css';
import { HiArrowNarrowLeft, HiArrowNarrowRight } from 'react-icons/hi';
import { config } from '../../../config';
import { FaHeart } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

function SaveCard({ storeData, setStoreData, follow }) {
    const listRefSaved = useRef(null);

    const handleScrollSaved = (direction) => {
        if (direction === 'left') {
            listRefSaved.current.scrollBy({ left: -300, behavior: 'smooth' });
        } else {
            listRefSaved.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    const user_id = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).uid : '';

    const handleSave = async (store_id) => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/store/save/${store_id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'PUT',
                body: JSON.stringify({ userId: user_id })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.status) {
                // Remove the store from the storeData array
                setStoreData(prevStores => prevStores.filter(store => store.uid !== store_id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Filter out stores with status === 0 and then sort by created_at in descending order
    const sortedStoreData = [...storeData]
        .filter(store => store.status !== 0) // Exclude stores with status === 0
        .sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return dateB - dateA; // Descending order
        });

    return (
        <>
            {sortedStoreData.length > 0 ? (
                <div className='saved save-history'>
                    <div className='title'>
                        <p className='save-til'>
                            {follow ? 'Followed Stores' : 'Saved Stores'} {`(${sortedStoreData.length})`}
                            {follow ? null : <span className='heart-icon'> <FaHeart /></span>}
                        </p>
                    </div>

                    <div className='save-list' ref={listRefSaved}>
                        {sortedStoreData.map((store) => (
                            <Link className='saved-box' to={`/store/${store.uid}`} key={store.uid}>
                                <div>
                                    <img
                                        src={store.img != null ? config.backEndBaseUrl + store.img : config.backEndBaseUrl + config.placeHolderImage}
                                    />
                                </div>
                                <div className='details pf-dts'>
                                    <h5 className='name'>{store.name}</h5>
                                </div>
                                {follow ? null : <FaHeart className='heart' onClick={() => handleSave(store.uid)} style={{ color: 'red' }} />}
                            </Link>
                        ))}
                    </div>
                    <div className='navigation-buttons'>
                        <button className='button' onClick={() => handleScrollSaved('left')}>
                            <HiArrowNarrowLeft />
                        </button>
                        <button className='button' onClick={() => handleScrollSaved('right')}>
                            <HiArrowNarrowRight />
                        </button>
                    </div>
                </div>
            ) : ''}
        </>
    );
}

export default SaveCard;
