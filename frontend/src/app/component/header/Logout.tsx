"use client"
import { logoutUser } from '@/app/redux/feature/user';
import { RootState } from '@/app/redux/store';
import { useRouter } from 'next/navigation';
import React from 'react'
import { RiLogoutBoxLine } from "react-icons/ri";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Logout = () => {
    const { token } = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch()
    const router = useRouter()

    const handleLogout = () => {
        dispatch(logoutUser())
        localStorage.removeItem("chat-token")
        router.push("/login")
        toast.success("Logged out successfully")
    }

    return (
        <span onClick={handleLogout} className='flex items-center gap-1 text-white cursor-pointer'>
            <RiLogoutBoxLine />
            Logout
        </span>
    )
}

export default Logout