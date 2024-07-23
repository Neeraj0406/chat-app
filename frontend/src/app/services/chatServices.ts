import axiosInstance from "../axios/axiosInstance";
import { requestAcceptRejectPayloadType, searchUserPayloadType } from "../types/commonType";

const ChatServices = {
    serachNewUser: (values: searchUserPayloadType) => axiosInstance.post(`user/search`, values),
    sendRequest: (userId: string) => axiosInstance.post(`user/send-request`, { userId }),
    showFriendRequest: () => axiosInstance.get(`user/show-all-requests`),
    acceptRejectRequest: (payload: requestAcceptRejectPayloadType) => axiosInstance.post("user/accept-request", payload)

}

export default ChatServices