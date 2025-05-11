import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { AiOutlineClose } from "react-icons/ai";
import './Comments.css';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { config } from '../../../config';

const Comments = ({ rating = '5', comments = [], isShown = false, onClose, averageRating = 0 }) => {
    const [selectedRating, setSelectedRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();
    const [commentList, setCommentList] = useState(comments); // Initialize with existing comments

    const handleRatingClick = (ratingValue) => {
        setSelectedRating(ratingValue);
    };

    const handleSubmit = async () => {
        if (selectedRating === 0) {
            toast.error('Rate Our Store', {
                position: 'top-center',
            });
            return;
        } else if (comment === '') {
            toast.error('Please add a comment', {
                position: 'top-center',
            });
            return;
        }

        let user = JSON.parse(localStorage.getItem('user'));
        let commentData = {
            userId: user.uid,
            comment: comment,
            rating: selectedRating,
        };

        try {
            setIsLoading(true); // Start loading
            const response = await fetch(`${config.backEndBaseUrl}api/store/comment/add/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commentData),
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

                // Create new comment object
                const newComment = {
                    user_name: JSON.parse(localStorage.getItem('user')).user_name || "Anonymous", // Assuming user name is available
                    created_at: new Date().toISOString(), // Current date and time
                    rating: selectedRating,
                    comment: comment,
                    gender: user.gender,
                    profile_image: user.profile_image
                };

                // Update the comments list with the new comment
                setCommentList(prevComments => {
                    // Ensure prevComments is an array
                    const currentComments = Array.isArray(prevComments) ? prevComments : [];
                    return [newComment, ...currentComments];
                });

                // Reset form fields
                setSelectedRating(0);
                setComment('');
            }
        } catch (error) {
            console.error('Error adding data:', error);
        } finally {
            setIsLoading(false); // End loading
        }
    };

    // Prevent back navigation and close modal when back button is pressed
    useEffect(() => {
        const handlePopState = (event) => {
            if (isShown) {
                // Prevent the default action (going back)
                event.preventDefault();
                // Close the modal
                onClose();
            }
        };

        window.addEventListener('popstate', handlePopState);

        // Return a cleanup function to remove the event listener
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [isShown, onClose]);

    const isSubmitDisabled = selectedRating === 0 || comment.trim() === '';

    return (
        <div className={`comment-section ${isShown ? 'show' : ''}`}>
            <div className="feedback-header">
                <div className='cross_con' onClick={onClose}>
                    <AiOutlineClose />
                </div>
                <div className="title-text">Select Rating.</div>
                <div className="c_stars">
                    {[...Array(5)].map((star, index) => {
                        const ratingValue = index + 1;
                        return (
                            <FaStar
                                key={index}
                                className={`star-icon-comment ${ratingValue <= selectedRating ? 'selected' : ''}`}
                                onClick={() => handleRatingClick(ratingValue)}
                            />
                        );
                    })}
                </div>
                <div style={{textAlign: 'left'}}>Type Your Comment</div>
                <textarea
                    className="comment-box"
                    placeholder="Comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                ></textarea>
                <button 
                    className={`submit-button ${isSubmitDisabled ? 'disabled' : ''}`} 
                    onClick={handleSubmit} 
                    disabled={isSubmitDisabled}
                >
                    {isLoading ? 'Submitting...' : 'Submit'}
                </button>
            </div>

            <div className="rating-display">
                <span className="rating-score">{averageRating} <FaStar /></span>
                <span className="rating-comments">{commentList ? commentList.length : 0} Reviews ▼</span>
            </div>

            <div className="comments-list">
                {commentList && commentList.length > 0 ? commentList.map((cmt, index) => (
                    <div key={index} className="comment-item">
                        <div className="comment-header">
                            <div>
                                <img
                                    src={
                                        cmt.profile_image != '' ? config.backEndBaseUrl + cmt.profile_image : (
                                            cmt.gender == 'male'
                                                ? 'https://e7.pngegg.com/pngimages/163/442/png-clipart-computer-icons-user-profile-icon-design-avatar-face-heroes.png'
                                                : 'https://e7.pngegg.com/pngimages/1017/542/png-clipart-computer-icons-female-user-icon-design-female-hat-people.png'
                                        )
                                    }
                                    className="user-image"
                                />
                                <span className="commenter-name">{cmt.user_name}</span>
                            </div>
                            <span className="comment-date">{new Date(cmt.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="comment-rating">
                            {[...Array(cmt.rating)].map((_, idx) => (
                                <FaStar key={idx} className="star-icon-comment selected user" />
                            ))}
                        </div>
                        <div className="comment-text">{cmt.comment}</div>
                        {cmt.reply && cmt.reply !== '' && (
                            <div className="comment-reply">
                                <span className="reply-label">Store: </span>
                                <span className="reply-text">{cmt.reply}</span>
                            </div>
                        )}
                    </div>
                )) : ''}
            </div>
        </div>
    );
};

export default Comments;
