let env = 'prod'

export const config = {
   frontEndBaseUrl : env === 'prod' ? 'https://www.adilabadapp.com/' : 'http://localhost:3000/',
   backEndBaseUrl : env === 'prod' ? 'https://www.adilabadapp.com/backend/' : 'http://localhost:5000/',
   placeHolderImage : 'uploads/placeholder/placeholder.jpg'
}