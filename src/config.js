const isProd = process.env.NODE_ENV === 'production';

export const config = {
   frontEndBaseUrl: process.env.REACT_APP_FRONTEND_URL || (isProd ? 'https://www.adilabadapp.com/' : 'http://localhost:3000/'),
   backEndBaseUrl: process.env.REACT_APP_API_URL || (isProd ? 'https://adilabad-backend.onrender.com/' : 'http://localhost:5000/'),
   placeHolderImage: 'uploads/placeholder/placeholder.jpg'
};