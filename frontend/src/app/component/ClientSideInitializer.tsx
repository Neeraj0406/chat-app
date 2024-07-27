"use client"
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from "socket.io-client";
import { serverUrl } from '../axios/axiosInstance';
import { fetchUserData, setSocket, setToken } from '../redux/feature/user';
import { AppDispatch, RootState } from '../redux/store';


const ClientSideInitializer = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { userInfo, token } = useSelector((state: RootState) => state.user)


    useEffect(() => {
        const token = localStorage.getItem("chat-token");
        if (token) {
            // Example payload, adjust as needed
            dispatch(setToken(token));
            dispatch(fetchUserData())
        }
    }, [dispatch]);

    const connectSocket = () => {
        const socket = io(serverUrl, { auth: { token: token } })
        console.log("socket", socket, socket.id)
        dispatch(setSocket(socket?.id || ""))
    }


    useEffect(() => {
        if (userInfo?._id && token) {
            connectSocket()
            // dispatch(setSocket(socket.id))
        }
    }, [token, userInfo._id])


    return null
}

export default ClientSideInitializer