import React, { useEffect, useRef } from 'react'
import './Feedback.css';
import './mediaQuery.css';
import { FaStar } from 'react-icons/fa6';
import { ImCross } from "react-icons/im";


const Feedback = ({ feedbackOn, setFeedbackOn }) => {

  const feedbackRef = useRef(null);

  // page close on outside click
  const handleClickOutside = (event) => {
    if (feedbackRef.current && !feedbackRef.current.contains(event.target)) {
      setFeedbackOn(true);
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  // ____.

  return (
    <div ref={feedbackRef} className={`feedback ${feedbackOn ? "" : "active"} `}>
      <button className="feedback-back-button" onClick={() => setFeedbackOn(true)}> <ImCross /></button>   {/* page close on button click */}

      <div className="feedback-text shadow">Your Feedback Matters</div>
      <div className="feedback-stars">
        <FaStar className='feedbackstar-icon shadow' />
        <FaStar className='feedbackstar-icon shadow' />
        <FaStar className='feedbackstar-icon shadow' />
        <FaStar className='feedbackstar-icon shadow' />
        <FaStar className='feedbackstar-icon shadow' />
      </div>
      <form >
        <input type="text" placeholder='Comment...' />
        <button>Submit</button>
      </form>
      <div className="feedback-store-rating">
        <span className="feedback-rating-score">4.9 <FaStar /> </span>
        <span className="feedback-rating-comments">6 Comments</span>
      </div>
    </div>
  )
}

export default Feedback