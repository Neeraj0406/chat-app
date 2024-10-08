import axiosInstance from "../axios/axiosInstance";
import {
  requestAcceptRejectPayloadType,
  searchUserPayloadType,
  updateGroupType,
} from "../types/commonType";

const ChatServices = {
  serachNewUser: (values: searchUserPayloadType) =>
    axiosInstance.post(`user/search`, values),
  sendRequest: (userId: string) =>
    axiosInstance.post(`user/send-request`, { userId }),
  showFriendRequest: (payload: searchUserPayloadType) =>
    axiosInstance.post(`user/show-all-requests`, payload),
  acceptRejectRequest: (payload: requestAcceptRejectPayloadType) =>
    axiosInstance.post("user/accept-request", payload),
  getMyFriends: () => axiosInstance.get("user/my-friends"),

  createGroup: (values: FormData) =>
    axiosInstance.post("chat/new-group", values),
  getAllChats: () => axiosInstance.get("chat/my-chats"),
  getChatDetails: (chatId: string) => axiosInstance.get(`chat/${chatId}`),
  updateGroup: (values: FormData) =>
    axiosInstance.post("chat/edit-group", values),
  leaveGroup: (id: string) => axiosInstance.get(`chat/leave-group/${id}`),

  allMessages: (chatId: string) =>
    axiosInstance.get(`chat/allMessages/${chatId}`),
  sendAttachments: (payload: FormData) =>
    axiosInstance.post(`chat/message`, payload),
};

export default ChatServices;
