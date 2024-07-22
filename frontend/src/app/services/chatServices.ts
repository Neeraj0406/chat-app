import axiosInstance from "../axios/axiosInstance";

const ChatServices = {
    search: (name: string | number) => axiosInstance.get(`user/search?name=${name}`)
}

export default ChatServices