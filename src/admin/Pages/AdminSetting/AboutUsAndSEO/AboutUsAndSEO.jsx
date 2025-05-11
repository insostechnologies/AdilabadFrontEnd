import React, { useState, useRef, useEffect } from 'react';
import '../AdminAccount/accountForm.css';
import { config } from '../../../../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { readFileAsBase64 } from '../../../../utils/fileHandle'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AiOutlineClose } from "react-icons/ai";
import './AboutUsAndSEO.css'

function AboutUsAndSEO({ user }) {
	const [file, setFile] = useState(null);
	const [preview, setPreview] = useState(null);
	const [userId, setUserId] = useState(null);
	const [seoId, setSeoId] = useState(null);
	const [name, setName] = useState('');
	const [storeState, setStoreState] = useState('');
	const [storeCity, setStoreCity] = useState('');
	const [storeCountry, setStoreCountry] = useState('');
	const [storeContinent, setStoreContinent] = useState('');
	const [copyWrite, setCopyWrite] = useState('');
	const [metaTitle, setMetaTitle] = useState('');
	const [metaDesc, setMetaDesc] = useState('');
	const [isLoading, setIsLoading] = useState(false)
	const fileInputRef = useRef(null);
	const [keywordInput, setKeywordInput] = useState('');
	const [keywords, setKeywords] = useState([]);
	const [filePath, setFilePath] = useState(null)

	const addKeyword = () => {
		const trimmedKeyword = keywordInput.trim();

		// Check if the keyword is not empty and does not already exist
		if (trimmedKeyword && !keywords.some(keyword => keyword.keyword === trimmedKeyword)) {
			setKeywords(prevKeywords => [...prevKeywords, { keyword: trimmedKeyword }]);
			setKeywordInput(''); // Clear the input field
		} else if (trimmedKeyword && keywords.some(keyword => keyword.keyword === trimmedKeyword)) {
			toast.warning('Keyword already exists', {
				position: 'top-center',
			});
		} else if (!trimmedKeyword) {
			toast.warning('Keyword cannot be empty', {
				position: 'top-center',
			});
		}
	};

	useEffect(() => {
		if (user && user.seoDetails) {
			setUserId(user.uid || '');
			setSeoId(user.seoDetails.uid || '')
			setPreview(user.seoDetails.logo == '' ? config.backEndBaseUrl + config.placeHolderImage : config.backEndBaseUrl + user.seoDetails.logo || '');
			setFilePath(user.seoDetails.logo || '')
			setName(user.seoDetails.name || '')
			setStoreState(user.seoDetails.state || '')
			setStoreCity(user.seoDetails.city || '')
			setStoreCountry(user.seoDetails.country || '')
			setStoreContinent(user.seoDetails.continent || '')
			setCopyWrite(user.seoDetails.copywrite || '')
			setMetaTitle(user.seoDetails.meta_title || '')
			setMetaDesc(user.seoDetails.meta_desc || '')
			// Set keywords
			const keywords = user.seoDetails.key_words
				? user.seoDetails.key_words.split(',')
					.map(keyword => keyword.trim()) // Trim whitespace
					.filter(keyword => keyword) // Remove empty keywords
					.map(keyword => ({ keyword })) // Convert to objects
				: [];
			setKeywords(keywords);
		}
	}, [user]);



	const removeKeyword = (index) => {
		setKeywords(keywords.filter((_, i) => i !== index));
	};


	const handleForm = async (event) => {
		event.preventDefault();

		let jsonData;

		try {
			const keywordsString = keywords.map(keywordObj => keywordObj.keyword).join(',');
			if (file) {
				const fileData = await readFileAsBase64(file);

				jsonData = {
					file: fileData,
					name: name,
					storeState: storeState,
					storeCity: storeCity,
					storeCountry: storeCountry,
					storeContinent: storeContinent,
					copyWrite: copyWrite,
					metaTitle: metaTitle,
					metaDesc: metaDesc,
					keywords: keywordsString,
					seoId: seoId
				};
			} else {
				jsonData = {
					path: filePath,	
					name: name,
					storeState: storeState,
					storeCity: storeCity,
					storeCountry: storeCountry,
					storeContinent: storeContinent,
					copyWrite: copyWrite,
					metaTitle: metaTitle,
					metaDesc: metaDesc,
					keywords: keywordsString,
					seoId: seoId
				};
			}

			// console.log(jsonData)
			// return

			const response = await fetch(`${config.backEndBaseUrl}api/user/seo/update/${userId}`, {
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
				// resetForm();
			}

		} catch (error) {
			console.error('Error update data:', error);
		}
	};

	// const resetForm = () => {
	// 	setFile(null);
	// 	setPreview(null);
	// 	setName('');
	// 	setStoreState('');
	// 	setStoreCity('');
	// 	setStoreCountry('');
	// 	setStoreContinent('');
	// 	setCopyWrite('');
	// 	setMetaTitle('');
	// 	setMetaDesc('');
	// 	setKeywords([]);
	// 	setKeywordInput('');
	// 	if (fileInputRef.current) {
	// 		fileInputRef.current.value = '';
	// 	}
	// };

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		setFile(selectedFile);

		if (selectedFile) {
			const fileReader = new FileReader();
			fileReader.onloadend = () => {
				setPreview(fileReader.result);
			};
			fileReader.readAsDataURL(selectedFile);
		} else {
			setPreview(null);
		}
	};

	return (
		<>
			<ToastContainer />
			<div className="wg-box wg-box-container">
				<form className="form-new-product form-style-1" onSubmit={handleForm}>
					<fieldset className="name">
						<div className="body-title input_label">Name :</div>
						<input className="flex-grow input_field" type="text" placeholder="Enter company name" value={name} onChange={(e) => setName(e.target.value)} />
					</fieldset>
					<fieldset className="name">
						<div className="body-title address-title">Address:</div>
						<div>
							<input className="flex-grow mb-4 addr_inp address-input" type="text" placeholder="City" name="text" tabIndex="0" value={storeCity} onChange={(e) => setStoreCity(e.target.value)} />
							<input className="flex-grow mb-4 addr_inp address-input" type="text" placeholder="State" name="text" tabIndex="0" value={storeState} onChange={(e) => setStoreState(e.target.value)} />
							<input className="flex-grow mb-4 addr_inp address-input" type="text" placeholder="Country" name="text" tabIndex="0" value={storeCountry} onChange={(e) => setStoreCountry(e.target.value)} />
							<input className="flex-grow addr_inp address-input" type="text" placeholder="Continent" name="text" tabIndex="0" value={storeContinent} onChange={(e) => setStoreContinent(e.target.value)} />
						</div>

					</fieldset>
					<fieldset>
						<div className="body-title input_label">Logo :</div>
						<div className="upload-image flex-grow input_field">
							<div className="item up-load">
								<label className="uploadfile" htmlFor="myFile">
									<span className="icon">
										<i className="icon-upload-cloud"></i>
									</span>
									<span className="body-text">Drop your images here or select <span className="tf-color">click to browse</span></span>
									<input type="file" id="myFile" onChange={handleFileChange} ref={fileInputRef} />
									{preview && (
										<div className="image-preview">
											<img src={preview} alt="Image_Preview" className='prvImg' />
										</div>
									)}
								</label>
							</div>
						</div>
					</fieldset>
					<fieldset className="name pass_input_div">
						<div className="body-title input_label">Copy write :</div>
						<input className="flex-grow input_field pasInput" type="text" placeholder="Enter Company name" value={copyWrite} onChange={(e) => setCopyWrite(e.target.value)} />
					</fieldset>
					<fieldset className="name pass_input_div">
						<div className="body-title input_label">Meta Title:</div>
						<input className="flex-grow input_field pasInput" type="text" placeholder="Enter Meta title" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
					</fieldset>
					<fieldset className="name pass_input_div">
						<div className="body-title input_label">Meta Description:</div>
						<CKEditor
							editor={ClassicEditor}
							data={metaDesc}
							onChange={(event, editor) => {
								const data = editor.getData();
								setMetaDesc(data);
							}}
							config={{
								placeholder: 'Meta Description..',
								removePlugins: ['MediaEmbed']
							}}
						/>
					</fieldset>

					<fieldset className="name">
						<div className="body-title keywords-title">Set Keywords:</div>
						<div className="custom-select-container">
							<div className="keyword-input-container keyword-wrapper">
								<input
									type="text"
									placeholder="Enter keywords"
									value={keywordInput}
									onChange={(e) => setKeywordInput(e.target.value)}
								/>
								<button
									type="button"
									className="btn-success"
									onClick={addKeyword}
								>
									Add
								</button>
							</div>
							<div className="selected_categories">
								{keywords.map((keyword, index) => (
									<div key={index} className='selectedCats'>
										<span>{keyword.keyword}</span>
										<AiOutlineClose
											className='icon'
											onClick={() => removeKeyword(index)}
										/>
									</div>
								))}
							</div>
						</div>
					</fieldset>

					<div className="bot from_btn_wrap">
						<button type="submit" className="tf-button w208 h10 from_btn">Submit</button>
					</div>
				</form>
			</div>
		</>
	);
}

export default AboutUsAndSEO;
