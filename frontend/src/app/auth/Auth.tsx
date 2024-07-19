"use client"
import { cookies } from 'next/headers'
import React, { ReactNode, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from "@/app/redux/store";
import { useRouter } from 'next/navigation';

interface PublicRouteProps {
    children: ReactNode;
}
interface PrivateRouteProps {
    children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {

    const router = useRouter()
    const { token } = useSelector((state: RootState) => state.user)
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        if (token) {
            return router.push("/")
        }
        setLoading(false)
    }, [])

    return (
        <>
            {loading ? null : children}
        </>
    )
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const { token } = useSelector((state: RootState) => state.user)
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    console.log("token private", token)

    useEffect(() => {

        if (!token) {
            return router.push("/login")
        }
        setLoading(false)
    }, [])



    return (
        <>
            {loading ? null : children}
        </>
    )
}

export { PublicRoute, PrivateRoute }