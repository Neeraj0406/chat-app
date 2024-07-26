"use client"
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { fetchUserData, setToken } from '../redux/feature/user';
import { AppDispatch, RootState } from '../redux/store';
import { useSelector } from 'react-redux';

const ClientSideInitializer = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { userInfo } = useSelector((state: RootState) => state.user)

    console.log("userInfo", userInfo)

    useEffect(() => {
        const token = localStorage.getItem("chat-token");
        if (token) {
            // Example payload, adjust as needed
            dispatch(setToken(token));
            console.log("aasdfasdfl")
            dispatch(fetchUserData())
        }
    }, [dispatch]);

    return null
}

export default ClientSideInitializer