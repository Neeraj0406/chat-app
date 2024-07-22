"use client"
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/feature/user';

const ClientSideInitializer = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const token = localStorage.getItem("chat-token");
        if (token) {
            // Example payload, adjust as needed
            dispatch(setToken(token));
        }
    }, [dispatch]);
    return null
}

export default ClientSideInitializer