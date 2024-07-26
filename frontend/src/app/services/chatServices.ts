import axiosInstance from "../axios/axiosInstance";
import { requestAcceptRejectPayloadType, searchUserPayloadType, updateGroupType } from "../types/commonType";

const ChatServices = {
    serachNewUser: (values: searchUserPayloadType) => axiosInstance.post(`user/search`, values),
    sendRequest: (userId: string) => axiosInstance.post(`user/send-request`, { userId }),
    showFriendRequest: (payload: searchUserPayloadType) => axiosInstance.post(`user/show-all-requests`, payload),
    acceptRejectRequest: (payload: requestAcceptRejectPayloadType) => axiosInstance.post("user/accept-request", payload),
    getMyFriends: () => axiosInstance.get("user/my-friends"),

    createGroup: (values: FormData) => axiosInstance.post("chat/new-group", values),
    getAllChats: () => axiosInstance.get("chat/my-chats"),
    getChatDetails: (chatId: string) => axiosInstance.get(`chat/${chatId}`),
    updateGroup: (values: FormData) => axiosInstance.post("edit-group", values)


}

export default ChatServices