  const API_HOST = process.env.REACT_APP_API_HOST || 'http://localhost:5000';
 // const API_HOST = process.env.REACT_APP_API_HOST || 'https://backend.hotspital.com';

const API_VERSION = '/api';
const API_URL = `${API_HOST}${API_VERSION}`;

export default API_URL;
