import authServices from "@/app/services/authServices";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { cookies } from "next/headers";
import { useEffect } from "react";


export const fetchUserData = createAsyncThunk("userProfileData", async () => {
  const res = await authServices.getProfile()
  return res.data
})

interface userState {
  token?: string
  userInfo: {
    username: string;
    _id: string;
    avatar: string;
    name: string

  }
}

const initialState: userState = {
  userInfo: {
    username: "",
    _id: "",
    avatar: "",
    name: ""
  },
  token: ""
};




export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.token = action.payload.data.token
      state.userInfo.username = action.payload.data.username
      state.userInfo.name = action.payload.data.name
      state.userInfo._id = action.payload.data._id
      state.userInfo.avatar = action.payload.data.avatar.url
    },

    setToken: (state, action) => {
      state.token = action.payload
    },

    logoutUser: (state) => {
      
      state.token = ""
      state.userInfo.username = ""
      state.userInfo.name = ""
      state.userInfo._id = ""
      state.userInfo.avatar = ""

    }

  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserData.fulfilled, (state, action: PayloadAction) => {
    })
  }
});

export const { setUserInfo, logoutUser, setToken } = userSlice.actions;

export default userSlice.reducer;
