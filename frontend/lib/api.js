import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

// Auth APIs
export const authApi = {
    register: (data) => api.post("/api/auth/register", data),
    verifyOtp: (data) => api.post("/api/auth/verify-otp", data),
    login: (data) => api.post("/api/auth/login", data),
    resendOtp: (data) => api.post("/api/auth/resend-otp", data),
    me: () => api.get("/api/auth/me"),
    logout: () => api.post("/api/auth/logout"),
};

// Posts APIs
export const postsApi = {
    getAll: (params) => api.get("/api/posts", { params }),
    getById: (id) => api.get(`/api/posts/${id}`),
    create: (data) => api.post("/api/posts", data),
    update: (id, data) => api.put(`/api/posts/${id}`, data),
    delete: (id) => api.delete(`/api/posts/${id}`),
};

// Comments APIs
export const commentsApi = {
    getByPost: (postId) => api.get(`/api/comments/${postId}`),
    create: (data) => api.post("/api/comments", data),
};

export default api;
