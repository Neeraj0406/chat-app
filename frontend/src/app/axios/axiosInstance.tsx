import axios, { AxiosInstance } from "axios";
export const baseUrl: string = "http://localhost:8000/api/v1/"

const axiosInstance: AxiosInstance = axios.create({
    baseURL: baseUrl
})

export default axiosInstance