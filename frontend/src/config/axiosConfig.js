import axios from "axios";

export const projectBackendInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
});

export const userBackendInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_URL
});
