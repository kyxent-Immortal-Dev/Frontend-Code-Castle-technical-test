import axios from "axios";




export const httpClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-XSRF-TOKEN': document.cookie.split('XSRF-TOKEN=')[1] || '',
        'auth_token': document.cookie.split('auth_token=')[1] || '',
    },
});