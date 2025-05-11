import React, { useEffect, useRef } from 'react';
import search_icon from '../Assets/Images/red_search.png';
import './SearchBar.css';
import './mediaQuery.css';

const SearchBar = ({ searchItem, setSearchItem }) => {
	const inputRef = useRef(null); // Reference to the input element

	useEffect(() => {
		const header = document.getElementById("myHeader");
		const sticky = header.offsetTop;

		const handleScroll = () => {
			if (window.scrollY > sticky) {
				header.classList.add("sticky");
			} else {
				header.classList.remove("sticky");
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleClear = () => {
		setSearchItem(""); // Clear the search input
		inputRef.current.focus(); // Focus back on the input element
	};

	return (
		<div id="myHeader" className='search-bar'>
			<img src={search_icon} alt="search_icon" />
			<input
				type="text"
				ref={inputRef} // Attach the ref to the input
				placeholder='Search here..'
				value={searchItem}
				onChange={(e) => setSearchItem(e.target.value)}
			/>
			{/* Clear button */}
			{searchItem && (
				<button className="clear-btn" onClick={handleClear}>
					Clear
				</button>
			)}
		</div>
	);
};

export default SearchBar;
