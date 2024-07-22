"use client"
import { cookies } from 'next/headers'
import React, { ReactNode, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from "@/app/redux/store";
import { useRouter } from 'next/navigation';

interface RouteProps {
    children: ReactNode;
}


const PublicRoute = ({ children }: RouteProps) => {

    const router = useRouter()
    const { token } = useSelector((state: RootState) => state.user)
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        console.log("token", token)
        if (token) {
            return router.push("/")
        }
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [token])


    return (
        <>
            {loading ? null : children}
        </>
    )
}

const PrivateRoute = ({ children }: RouteProps) => {
    const { token } = useSelector((state: RootState) => state.user)
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        if (!token) {
            return router.push("/login")
        }
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [token])



    return (
        <>
            {loading ? null : children}
        </>
    )
}

export { PublicRoute, PrivateRoute }