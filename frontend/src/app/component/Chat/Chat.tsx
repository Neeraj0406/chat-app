"use client"
import React from 'react'
import ChatHeader from './ChatHeader'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import { useSearchParams } from 'next/navigation'

const Chat = () => {
    const searchParams = useSearchParams()
    const chatId = searchParams?.get("chatId")

    console.log(chatId)

    return (
        <div className='w-full h-chatCon  '>
            {chatId ?
                <>
                    <ChatHeader />
                    <ChatMessage />
                    <ChatInput />
                </>
                : <div className='flex items-center justify-center h-full opacity-50'>
                    <img src="/images/defaultChat.png" alt='default chat image' />
                </div>
            }
        </div>
    )
}

export default Chat