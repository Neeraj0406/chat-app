"use client"
import { RootState } from '@/app/redux/store'
import { MessageType } from '@/app/types/commonType'
import { scrollChatToBottom } from '@/app/utils/commonFunction'
import React, { RefObject, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

type ChatMessageProps = {
    messages: MessageType[];
    bottomRef : RefObject<HTMLDivElement>
};

type messageProp = {
    message: MessageType
}

const ChatMessage: React.FC<ChatMessageProps> = ({ messages ,bottomRef}) => {
    // const bottomRef = useRef<HTMLDivElement>(null);
    const { userInfo } = useSelector((state: RootState) => state.user)

 

    useEffect(() => {
        scrollChatToBottom(bottomRef)
        
    }, [])


    return (
        <div className='h-chatHeight overflow-y-auto p-5 flex flex-col w-full'>
            {messages?.map((message: any) => (
                userInfo?._id == message?.sender?._id ? <YourMessages message={message} /> : <SenderMessage message={message} />
            ))}


            <span ref={bottomRef}></span>
        </div>
    )
}




const SenderMessage: React.FC<messageProp> = ({ message }) => {

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

const YourMessages: React.FC<messageProp> = ({ message }) => {
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