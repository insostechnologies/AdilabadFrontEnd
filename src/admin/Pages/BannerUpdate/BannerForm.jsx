import React, { useState, useEffect, useRef } from 'react';
import './bannerForm.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useOutsideClickListener from '../../customhook/useOutsideClickListener';
import { config } from '../../../config';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function BannerForm() {
    const [selectedType, setSelectedType] = useState('Select Banner Types');
    const [selectedBannerPos, setSelectedBannerPos] = useState('Select Banner Position');
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenForBannerPos, setIsOpenForBannerPos] = useState(false);
    const [typeList, setTypesList] = useState([]);
    const [bannerPosList, setBannerPosList] = useState([]);
    const [isActive, setIsActive] = useState(0);
    const [bannerName, setBannerTitle] = useState('');
    const TypeMenuRef = useRef(null);
    const positionMenuRef = useRef(null);
    const navigate = useNavigate();
    const { uid } = useParams();
    const [isLoading, setIsLoading] = useState(false)

    const getBanner = async () => {
        try {
            const response = await fetch(`${config.backEndBaseUrl}api/banner/${uid}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (!result.status) {
                throw new Error(`Error: ${result.message}`);
            } else {
                setSelectedType(result.data.type)
                setSelectedBannerPos(result.data.page)
                setIsActive(result.data.status)
                setBannerTitle(result.data.title)
            }
        } catch (error) {
            console.error('Fetching categories failed', error);
        }

    }


    const updateBanner = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        if (bannerName === '') {
            toast.error('Please add a banner title', { position: 'top-center' });
            setIsLoading(false);
            return;
        } else if (selectedType === 'Select Banner Types') {
            toast.error('Please select a banner type', { position: 'top-center' });
            setIsLoading(false);
            return;
        } else if (selectedBannerPos === 'Select Banner Position') {
            toast.error('Please select a banner position', { position: 'top-center' });
            setIsLoading(false);
            return;
        } else {

            const bannerData = {
                title: bannerName,
                type: selectedType,
                position: selectedBannerPos,
                isActive: isActive ? 1 : 0,
            };

            try {
                const response = await fetch(`${config.backEndBaseUrl}api/banner/update/${uid}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bannerData)
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                if (result.status) {
                    toast.success(result.message, { position: 'top-center' });
                    navigate('/admin/banner/list');
                } else {
                    toast.error('Error uploading banner', { position: 'top-center' });
                }
            } catch (error) {
                console.error('Error uploading banner:', error);
                toast.error('Internal server error', { position: 'top-center' });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const onBannerNameChange = (event) => {
        setBannerTitle(event.target.value);
    };

    const handleIsActiveCheckboxChange = () => {
        setIsActive(!isActive);
    };

    useEffect(() => {
        setTypesList(["main banner","cover", "card","card (small)", "carousel", "slider"]);
        setBannerPosList(["home"]);
        getBanner()
    }, []);

    const handleSelectChange = (typeName) => {
        setSelectedType(typeName);
        setIsOpen(false);
    };
    const handleSelectBannerPosChange = (bannerTypes) => {
        setSelectedBannerPos(bannerTypes);
        setIsOpenForBannerPos(false);
    };

    useOutsideClickListener(TypeMenuRef, () => {
        setIsOpen(false);
    });

    useOutsideClickListener(positionMenuRef, () => {
        setIsOpenForBannerPos(false);
    });

    return (
        <>
            <ToastContainer />
            <div className="wg-box">
                <form className="form-new-product form-style-1" onSubmit={updateBanner}>
                    <fieldset className="name">
                        <div className="body-title">Banner Title<span className="tf-color-1">*</span></div>
                        <input className="flex-grow" type="text" placeholder="Banner Title" value={bannerName} onChange={onBannerNameChange} />
                    </fieldset>
                    <fieldset className="custom-category">
                        <div className="body-title">Banner Type</div>
                        <div className="custom-select-container" ref={TypeMenuRef}>
                            <div className="custom-selected-item" onClick={() => setIsOpen(!isOpen)}>
                                <span>{selectedType}</span>
                            </div>
                            {isOpen && (
                                <div className="custom-dropdown-menu">
                                    <ul className="custom-dropdown-list">
                                        {typeList.map((typeName) => (
                                            <li key={typeName} onClick={() => handleSelectChange(typeName)} className="custom-dropdown-item">
                                                <span>{typeName}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </fieldset>
                    <fieldset className="custom-category">
                        <div className="body-title">Banner Position</div>
                        <div className="custom-select-container" ref={positionMenuRef}>
                            <div className="custom-selected-item" onClick={() => setIsOpenForBannerPos(!isOpenForBannerPos)}>
                                <span>{selectedBannerPos}</span>
                            </div>
                            {isOpenForBannerPos && (
                                <div className="custom-dropdown-menu">
                                    <ul className="custom-dropdown-list">
                                        {bannerPosList.map((posType) => (
                                            <li key={posType} onClick={() => handleSelectBannerPosChange(posType)} className="custom-dropdown-item">
                                                <span>{posType}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </fieldset>
                    <fieldset>
                        <div className="body-title">Banner Disable/Enable<span className="tf-color-1">*</span></div>
                        <label className="switch">
                            <input type="checkbox" checked={isActive} onChange={handleIsActiveCheckboxChange} />
                            <span className="slider round"></span>
                        </label>
                    </fieldset>
                    <div className="bot">
                        <div></div>
                        <button type="submit" className="tf-button w208 h10" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default BannerForm;
