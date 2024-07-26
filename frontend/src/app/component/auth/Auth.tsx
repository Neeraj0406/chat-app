"use client"
import { RootState } from "@/app/redux/store";
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface RouteProps {
    children: ReactNode;
}


const PublicRoute = ({ children }: RouteProps) => {

    const router = useRouter()
    const { token } = useSelector((state: RootState) => state.user)
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        if (token) {
            return router.push("/")
        }
        setLoading(false)

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
        setLoading(false)

    }, [token])



    return (
        <>
            {loading ? null : children}
        </>
    )
}

export { PrivateRoute, PublicRoute };
