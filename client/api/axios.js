import axios from "axios";

// export default axios.create({
//     baseURL: `${process.env.NEXT_PUBLIC_STRAPI_APIURL}`
// });

// Create an Axios instance
const strapiAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_STRAPI_APIURL, // Base URL for Strapi API
    headers: {
        "Content-Type": "application/json", // Default content type
    },
});

// Optionally, add an interceptor to include authentication tokens
strapiAxios.interceptors.request.use(
    (config) => {
        // Get the token from localStorage or cookies
        const token = localStorage.getItem("jwt");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default strapiAxios;