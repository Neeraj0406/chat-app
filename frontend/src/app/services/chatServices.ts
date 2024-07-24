import axiosInstance from "../axios/axiosInstance";
import { requestAcceptRejectPayloadType, searchUserPayloadType } from "../types/commonType";

const ChatServices = {
    serachNewUser: (values: searchUserPayloadType) => axiosInstance.post(`user/search`, values),
    sendRequest: (userId: string) => axiosInstance.post(`user/send-request`, { userId }),
    showFriendRequest: (payload: searchUserPayloadType) => axiosInstance.post(`user/show-all-requests`, payload),
    acceptRejectRequest: (payload: requestAcceptRejectPayloadType) => axiosInstance.post("user/accept-request", payload),
    getMyFriends: () => axiosInstance.get("user/my-friends")

}

export default ChatServices