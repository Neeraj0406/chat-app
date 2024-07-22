"use client"
import axios, { AxiosInstance } from "axios";
export const baseUrl: string = "http://localhost:8000/api/v1/"
const token = typeof window !== 'undefined' ? localStorage.getItem("chat-token") : ''; // Check if window is defined

const axiosInstance: AxiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        token: token
    }
})

export default axiosInstance