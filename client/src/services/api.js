import axios from 'axios';

const API_BASE_URL = 'https://flipearn-marketplace.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;