import React, { useState } from 'react';
import '../InputArea/InputArea.css';
import Select from 'react-select';
import { config } from '../../../../config';
import ImageUploading from "react-images-uploading";
import { readFileAsBase64 } from '../../../../utils/fileHandle'

const InputArea = ({ tab }) => {
	const [images, setImages] = useState([]);
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [url, setUrl] = useState("");
	const [notificationType, setNotificationType] = useState("");
	const maxNumber = 1;

	const resetForm = () => {
        console.log('Resetting form...');
        setImages([]);
        setTitle("");
        setMessage("");
        setUrl("");
        setNotificationType("");
        console.log('Form reset complete.');
    };

	const onChange = (imageList, addUpdateIndex) => {
		setImages(imageList);
	};

	const addNotification = async (event) => {
		event.preventDefault();

		const imgArr = await Promise.all(images.map(async (img) => {
			const base64String = await readFileAsBase64(img.file);
			return base64String;
		}));

		const notificationData = {
			title: title,
			message: message,
			url: url,
			type: notificationType,
			images: imgArr[0]
		};

		console.log(notificationData);

		try {
			const response = await fetch(`${config.backEndBaseUrl}api/promotions/notification/add`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(notificationData),
			});

			if (response.ok) {
				const data = await response.json();
				if (data.status) {
					console.log('Notification added successfully. Resetting form...');
					resetForm();
				}
			} else {
				alert('Failed to upload file.');
			}
		} catch (error) {
			console.error('Error uploading file:', error);
			alert('Error uploading file.');
		}
	};

	const handleNotificationTypeChange = (selectedOption) => {
		setNotificationType(selectedOption ? selectedOption.value : "");
	};

	const notificationTypes = [
		{ value: 'all_user', label: 'All Users' },
		{ value: 'customers', label: 'Customers' },
		{ value: 'vendors', label: 'Vendors'},
	];

	const handleTitleChange = (event) => {
		setTitle(event.target.value);
	};

	const handleMessageChange = (event) => {
		setMessage(event.target.value);
	};

	const handleUrlChange = (event) => {
		setUrl(event.target.value);
	};

	return (
		<div className='input-area'>
			<form onSubmit={addNotification}>
				<div className='single-input'>
					<label>Image<span className="tf-color-1">*</span></label>
					<div className="upload-image flex-grow">
						<div className="App">
							<ImageUploading
								value={images}
								onChange={onChange}
								maxNumber={maxNumber}
								dataURLKey="data_url"
								acceptType={["jpg","png","jpeg"]}
							>
								{({
									imageList,
									onImageUpload,
									onImageRemove,
									isDragging,
									dragProps
								}) => (
									<div className="upload__image-wrapper">
										<button
											type='button'
											style={isDragging ? { color: "red" } : null}
											onClick={onImageUpload}
											{...dragProps}
											className='btn btn-lg btn-success p-4 mb-2'
										>
											Select Image
										</button>
										<div className='prv_img '>
											{imageList.map((image, index) => (
												<div key={index} className="image-item">
													<img src={image.data_url} alt="" width="100" />
													<div className="image-item__btn-wrapper">
														<div className='btn_con'>
															<button
																type='button'
																className='btn btn-lg btn-danger p-2 m-1'
																onClick={() => onImageRemove(index)}
															>
																Remove
															</button>
														</div>
													</div>
												</div>
											))}
										</div>
									</div>
								)}
							</ImageUploading>
						</div>
					</div>
				</div>

				<div className='single-input'>
					<label htmlFor="notificationType">Notification Type:<span>*</span></label>
					<Select
						name="notificationType"
						options={notificationTypes}
						className="basic-single-select select-input"
						classNamePrefix="select"
						onChange={handleNotificationTypeChange}
						placeholder="Select Notification Type"
						isClearable
					/>
				</div>

				<div className='single-input'>
					<label htmlFor="title" className='tags'>Notification Title:<span>*</span></label>
					<input name="title" value={title} onChange={handleTitleChange} type="text" id="title" placeholder="Notification Title" />
				</div>
				<div className='single-input'>
					<label htmlFor="message" className='tags'>Message:<span>*</span></label>
					<input name="message" value={message} onChange={handleMessageChange} type="text" id="message" placeholder="Notification Message" required />
				</div>
				<div className='single-input'>
					<label htmlFor="url" className='tags'>URL:</label>
					<input name="url" value={url} onChange={handleUrlChange} type="text" id="url" placeholder="This Link will be Clicked when Clicked" />
				</div>
				<div className='noti_btn_wrapper'>
					<button type="submit">Submit</button>
				</div>
			</form>
		</div>
	);
};

export default InputArea;
