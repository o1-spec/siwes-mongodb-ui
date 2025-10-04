// client/src/config.js
const API_BASE_URL =
  import.meta.env.MODE === 'production'
    ? 'https://siwes-mongodb.onrender.com'
    : 'http://localhost:5000';

export default API_BASE_URL;