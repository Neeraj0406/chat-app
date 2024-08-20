"use client"
import { RootState } from '@/app/redux/store'
import EmitEvents from '@/app/utils/constant'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { GrAttachment } from "react-icons/gr";


interface chatProps {
    chatId: string
}

const ChatInput = ({ chatId }: chatProps) => {
    const [message, setMessage] = useState<string>("")
    const { socket } = useSelector((state: RootState) => state.user)

    const handleSubmit = (e: any) => {
        e.preventDefault()
        if (message?.trim().length > 0 && socket) {
            socket?.emit(EmitEvents.NEW_MESSAGE, { chatId, message })
            setMessage("")
        }
    }


    return (
        <div className='mx-4'>
            <form onSubmit={handleSubmit}>
                <div className=" flex gap-1">

                    <input
                        type="text"
                        className='input border w-auto'
                        value={message}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setMessage(e.target.value)
                        }}
                    />
                    <button className='button'><GrAttachment /> </button>
                    <button type="submit" className='button'>Send</button>
                </div>
            </form>
        </div>
    )
}

export default ChatInput