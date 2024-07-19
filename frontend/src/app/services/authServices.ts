import axiosInstance from "../axios/axiosInstance";
import { LoginType, RegisterType } from "../types/commonType";

const authServices = {
    login: (values: LoginType) => axiosInstance.post("user/login", values),
    register: (values: FormData) => axiosInstance.post("user/register", values),
    getProfile: () => axiosInstance.get("user/profile")
}

export default authServices