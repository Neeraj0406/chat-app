"use client"
import axios, { AxiosInstance } from "axios";

export const baseUrl: string = "http://localhost:8000/api/v1/";
export const serverUrl: string = "http://localhost:8000/"

const axiosInstance: AxiosInstance = axios.create({
    baseURL: baseUrl,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("chat-token");
        if (token) {
            config.headers['token'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
