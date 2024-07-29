"use client"
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io, { Socket } from "socket.io-client";
import { serverUrl } from '../axios/axiosInstance';
import { fetchUserData, setSocket, setToken } from '../redux/feature/user';
import { AppDispatch, RootState } from '../redux/store';
import { toast } from 'react-toastify';


const ClientSideInitializer = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { userInfo, token, socket } = useSelector((state: RootState) => state.user)



    useEffect(() => {
        const token = localStorage.getItem("chat-token");
        if (token) {
            dispatch(setToken(token));
            dispatch(fetchUserData())
        }
    }, [dispatch]);

    useEffect(() => {
        let socketConnection: Socket | undefined;

        const connectSocket = async () => {
            console.log("calling", userInfo?._id, token)
            socketConnection = io(serverUrl,
                {
                    auth: { token },
                    transports: ['websocket'],
                }
            );
            socketConnection.on("connect", () => {
                console.log("socket", socketConnection)
                if (socketConnection) {
                    dispatch(setSocket(socketConnection));
                }
            })



        };

        if (userInfo?._id && token && !socket) {
            connectSocket();
        }

        // Cleanup function to disconnect the socket
        return () => {
            if (socketConnection) {
                socketConnection.disconnect();
            }
        };
    }, [token, userInfo._id]);


    console.log("socket details", socket)

    return null
}

export default ClientSideInitializer


