"use client"
import { RootState } from '@/app/redux/store'
import EmitEvents from '@/app/utils/constant'
import React, { RefObject, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { GrAttachment } from "react-icons/gr";
import { MessageType } from '@/app/types/commonType'
import { scrollChatToBottom } from '@/app/utils/commonFunction'


interface chatProps {
    chatId: string
    bottomRef: RefObject<HTMLDivElement>
    setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>

}

const ChatInput: React.FC<chatProps> = ({ chatId, setMessages, bottomRef }) => {
    const [message, setMessage] = useState<string>("")
    const { userInfo } = useSelector((state: RootState) => state.user)
    const { socket } = useSelector((state: RootState) => state.user)
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleSubmit = (e: any) => {
        e.preventDefault()
        if (message?.trim().length > 0 && socket) {
            socket?.emit(EmitEvents.NEW_MESSAGE, { chatId, message })
            const newMessage: MessageType = {
                content: message,
                _id: userInfo?._id,
                sender: {
                    _id: userInfo?._id,
                    name: userInfo?.name,
                    avatar: {
                        url: userInfo?.avatar,
                        public_id: "adf"
                    }
                },
                attachments: [],
                chatId,
                createdAt: new Date()?.toISOString(),
                updatedAt: new Date()?.toISOString(),
            }
            setMessages((prev) => [...prev, newMessage])
            setMessage("")
            scrollChatToBottom(bottomRef)
        }
    }

    useEffect(() =>{
        setMessage("")
        inputRef?.current?.focus()
    },[chatId])


    return (
        <div className='mx-4'>
            <form onSubmit={handleSubmit}>
                <div className=" flex gap-1">

                    <input
                        ref={inputRef}
                        type="text"
                        className='input border w-auto'
                        value={message}
                        autoFocus
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