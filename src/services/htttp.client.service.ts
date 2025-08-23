import axios from "axios";

export const httpClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

// Add request interceptor to handle CSRF token if needed
httpClient.interceptors.request.use(
    (config) => {
        // Get CSRF token from cookie if it exists
        const csrfToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('XSRF-TOKEN='))
            ?.split('=')[1];
        
        if (csrfToken) {
            config.headers['X-XSRF-TOKEN'] = csrfToken;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for better error handling
httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized - redirect to login
            console.log('Unauthorized access, redirecting to login...');
            // You can add redirect logic here
        }
        return Promise.reject(error);
    }
);