import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
    headers: {
        "Content-Type": "application/json",
    },
});

// Add auth token from Clerk
api.interceptors.request.use(async (config) => {
    // Token will be added by Clerk middleware
    return config;
});
