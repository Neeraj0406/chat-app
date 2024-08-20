"use client"
import { RootState } from '@/app/redux/store'
import Image from 'next/image'
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

interface ChatMessageProps {
    messages: any
}

interface Message {

}

const ChatMessage = ({ messages }: ChatMessageProps) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const { userInfo } = useSelector((state: RootState) => state.user)

    const scrollChatToBottom = () => {
        if (bottomRef.current) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth', inline: "end" });
        }
    }

    useEffect(() => {
        scrollChatToBottom()
    }, [])

    console.log("userInfo", userInfo?._id,)

    return (
        <div className='h-chatHeight overflow-y-auto p-5 flex flex-col w-full'>
            {messages?.map((message: any) => (
                userInfo?._id == message?.sender?._id ? <YourMessages message={message} /> : <SenderMessage message={message} />
            ))}


            <span ref={bottomRef}></span>
        </div>
    )
}




const SenderMessage = ({ message }: any) => {

    console.log("condition did not matched", message?.sender?._id)
    return (
        <>
            <div className=' max-w-[400px]  mb-6 '>
                <h3 className='text-bold text-sm ml-[50px]'>{message?.sender?.name}</h3>
                <div className="flex items-start gap-2">
                    <img
                        src={message?.sender?.avatar?.url}
                        alt='user image'

                        className='rounded-full h-[40px] w-[40px]'
                    />
                    <p className='bg-mainColor rounded-md p-3 shadow-md'>{message.content}</p>
                </div>
            </div>

        </>
    )
}

const YourMessages = ({ message }: any) => {
    return (
        <>
            <div className="flex items-start justify-end gap-2 mr-10  mb-6">
                <div className=" max-w-[400px]">
                    <p className='border bg-gray-300 rounded-md p-3'>{message.content}</p>
                </div>
            </div>

        </>
    )
}


export default ChatMessage