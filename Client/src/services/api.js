import axios from 'axios';

const API = axios.create({
    baseURL: 'https://portfolio-full-stack-2026-zffl.onrender.com/api'
});

export default API;