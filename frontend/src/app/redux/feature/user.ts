import authServices from "@/app/services/authServices";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

// Define the type for userInfo
interface UserInfo {
  username: string;
  _id: string;
  avatar: string;
  name: string;
}

interface userData {
  username: string;
  _id: string;
  avatar: {
    url: string
  };
  name: string;
  // socket: ""
}

// Define the type for the userState
interface UserState {
  token?: string;
  userInfo: UserInfo;
  socket: any,
}

// Initial state
const initialState: UserState = {
  userInfo: {
    username: "",
    _id: "",
    avatar: "",
    name: "",
  },
  token: localStorage.getItem("chat-token") || "",
  socket: null,
};

// Fetch user data async thunk
export const fetchUserData = createAsyncThunk<userData>("userProfileData", async () => {
  const res = await authServices.getProfile();
  return res.data.data; // Ensure res.data matches the UserInfo type
});

// User slice
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<{ data: UserInfo & { token: string } }>) => {
      const { data } = action.payload;
      state.userInfo = {
        username: data.username,
        name: data.name,
        _id: data._id,
        avatar: data.avatar,
      };
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setSocket: (state, action: PayloadAction<Socket | null>) => {
      console.log("action.payload", action.payload)
      state.socket = action.payload;
    },
    logoutUser: (state) => {
      state.token = "";
      state.userInfo = {
        _id: "",
        username: "",
        name: "",
        avatar: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserData.fulfilled, (state, action: PayloadAction<userData>) => {
      state.userInfo._id = action.payload._id;
      state.userInfo.username = action.payload.username;
      state.userInfo.name = action.payload.name;
      state.userInfo.avatar = action.payload.avatar.url
    });
  },
});

// Export actions and reducer
export const { setUserInfo, logoutUser, setToken, setSocket } = userSlice.actions;
export default userSlice.reducer;
