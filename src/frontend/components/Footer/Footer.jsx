import React, { useEffect, useState } from 'react';
import "./footer.css";
import { Link } from 'react-router-dom';
import brand_logo from '../Assets/Images/brand_logo.png';
import contact_call_png from '../Assets/Images/contact_call_png.png';
import whatsapp_pnp from '../Assets/Images/whatsapp_pnp.png';
import facebook_png from '../Assets/Images/facebook_png.png';
import insta_png from '../Assets/Images/insta_png.png';
import twitter_png from '../Assets/Images/twitter_png.png';
import { config } from '../../../config';
import { formatPhoneNumber } from '../../../utils/helper'
function Footer({ site }) {
	const [siteDetails, setSiteDetails] = useState(null);
	const [userSeoDetails, setUserSeoDetails] = useState(null)

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
	const fetchAdmin = async () => {
		try {

			// Send the request
			const response = await fetch(`${config.backEndBaseUrl}api/user/${'8bf0589fef541a20'}?q=v`, {
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
				setUserSeoDetails(result.data.seoDetails)
			} else {
				console.log('internal server error')
			}

		} catch (error) {
			console.error('Error update data:', error);
		}
	}

	useEffect(() => {
		fetchAdmin()
	}, [])
	if (!siteDetails) {
		return <p>Loading...</p>;
	}
	const getPhoneNumberWithCountryCode = (phoneNumber) => {
		if (phoneNumber) {
			// Check if the phone number starts with '91' but not '+91'
			if (phoneNumber.startsWith('91') && !phoneNumber.startsWith('+91')) {
				return `+${phoneNumber}`;
			}
			// Check if the phone number doesn't start with '+91' at all
			if (!phoneNumber.startsWith('+91')) {
				return `+91${phoneNumber}`;
			}
		}
		return phoneNumber;
	};

	const { socialDetails, seoDetails } = siteDetails;

	// Helper to get the social link value
	const getSocialLink = (type) => socialDetails.find(detail => detail.type === type)?.value;

	return (
		<>
			<div className={`footer_container ${site == 'vendor' ? 'vendor' : ''}`}>
				<div className="footer_wrapper">
					<div className="content_area">
						<div className="brand_info">
							<div className="brand_img">
								<img src={`${config.backEndBaseUrl}${userSeoDetails?.logo}`} alt="logo" />
							</div>
							<div className="brand_details">
								<p className='brand_name'>{seoDetails?.name}</p>
								<span className='brand_Location'>
									{seoDetails?.city}, {seoDetails?.state}, {seoDetails?.country}, {seoDetails?.continent}
								</span>
								<br />
								<span>
									<Link to='/terms' style={{color: '#fff'}}> Terms and Conditions</Link>
								</span>
							</div>
							{/* <div className="social mobile_only_pos">

							</div> */}
						</div>

						<div className="footer_links">
							<ul>
								<li><Link to='/'> &gt; About Us</Link></li>
								<li><Link to='/'> &gt; Contact Us</Link></li>
								<li><Link to='/'> &gt; Blogs</Link></li>
								<li><Link to='/'> &gt; FAQs</Link></li>
								<li><Link to='/'> &gt; Chat Us</Link></li>
							</ul>
						</div>
						<div className="footer_links">
							<ul>
								<li><Link to='/'> &gt; Terms and Conditions</Link></li>
								<li><Link to='/'> &gt; Privacy Policy</Link></li>
								<li><Link to='/'> &gt; Return and Refunds</Link></li>
								<li><Link to='/'> &gt; Purchase Guide</Link></li>
							</ul>
						</div>
						<div className="footer_social_links">
							<div className="social">
								{getSocialLink('playstore') && (
									<a href={getSocialLink('playstore')} target="_blank" rel="noopener noreferrer">
										<img
											src="https://cdn.iconscout.com/icon/free/png-256/free-googleplay-logo-icon-download-in-svg-png-gif-file-formats--technology-brand-social-media-company-logos-pack-icons-6297224.png?f=webp&w=256"
											alt="Play Store"
										/>
									</a>
								)}
								{getSocialLink('appstore') && (
									<a href={getSocialLink('appstore')} target="_blank" rel="noopener noreferrer">
										<img
											src="https://files.softicons.com/download/application-icons/round-app-icons-by-ampeross/png/512x512/App%20store.png"
											alt="App Store"
										/>
									</a>
								)}
								{getSocialLink('call') && (
									<a href={`tel:${formatPhoneNumber(getSocialLink('call'))}`}>
										<img src={contact_call_png} className="call_icon" alt="Call" />
									</a>
								)}
								{getSocialLink('whatsapp') && (
									<a href={`https://wa.me/${formatPhoneNumber(getSocialLink('whatsapp'))}`}>
										<img src={whatsapp_pnp} alt="WhatsApp" />
									</a>
								)}
								{getSocialLink('facebook') && (
									<a href={getSocialLink('facebook')} target="_blank" rel="noopener noreferrer">
										<img src={facebook_png} alt="Facebook" />
									</a>
								)}
								{getSocialLink('instagram') && (
									<a href={getSocialLink('instagram')} target="_blank" rel="noopener noreferrer">
										<img src={insta_png} alt="Instagram" />
									</a>
								)}
								{getSocialLink('twitter') && (
									<a href={getSocialLink('twitter')} target="_blank" rel="noopener noreferrer">
										<img src={twitter_png} alt="Twitter" />
									</a>
								)}
								{getSocialLink('youtube') && (
									<a href={getSocialLink('youtube')} target="_blank" rel="noopener noreferrer">
										<img
											src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/YouTube_social_red_circle_%282024%29.svg/120px-YouTube_social_red_circle_%282024%29.svg.png"
											alt="YouTube"
										/>
									</a>
								)}
								{getSocialLink('mapLink') && (
									<a href={getSocialLink('mapLink')} target="_blank" rel="noopener noreferrer">
										<img
											src="https://cdn-icons-png.freepik.com/512/235/235861.png"
											alt="Map"
										/>
									</a>
								)}
								{getSocialLink('email') && (
									<a
										href={`mailto:${getSocialLink('email')}?subject=Inquiry&body=Hi, I would like to get in touch...`}
										title="Send an Email"
									>
										<img
											src="https://upload.wikimedia.org/wikipedia/commons/5/5d/Email_icon.png"
											alt="Email"
											loading="lazy"
										/>
									</a>
								)}
								{getSocialLink('website') && (
									<a href={getSocialLink('website')} target="_blank" rel="noopener noreferrer">
										<img
											src="https://cdn-icons-png.flaticon.com/512/5339/5339184.png"
											alt="Website"
										/>
									</a>
								)}


							</div>
							<div>
								<p>Copyright &copy; {new Date().getFullYear()} {seoDetails?.copywrite} </p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Footer;
