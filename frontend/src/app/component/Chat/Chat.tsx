"use client"
import React, { useEffect, useState } from 'react'
import ChatHeader from './ChatHeader'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { errorHandler } from '@/app/utils/commonFunction'
import ChatServices from '@/app/services/chatServices'
import { chatDetailsType } from '@/app/types/commonType'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store'

const Chat = () => {
    const searchParams = useSearchParams()
    const chatId = searchParams?.get("chatId")
    const [loading, setLoading] = useState<boolean>(false)
    const [chatDetails, setChatDetails] = useState<chatDetailsType>()
    const { userInfo } = useSelector((state: RootState) => state.user)

    const fetchChatDetails = async (id: string) => {
        try {
            const res = await ChatServices.getChatDetails(id)
            console.log("chat det", res)
            setChatDetails(res?.data?.data)
        } catch (error) {
            errorHandler(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (chatId) {
            fetchChatDetails(chatId)
        }
    }, [chatId])

    console.log("chatDetails", chatDetails)

    if (loading) {
        return <div> Loading...</div>
    }

    return (
        <div className='w-full h-chatCon  '>
            {chatId ?
                <>
                    <ChatHeader chatDetails={chatDetails} groupAdmin={userInfo?._id == chatDetails?.creator} />
                    <ChatMessage />
                    <ChatInput />
                </>
                : <div className='flex items-center justify-center h-full opacity-50 '>
                    <Image
                        src="/images/defaultChat.png"
                        alt='default chat image'
                        height={500}
                        width={600}
                    />
                </div>
            }
        </div>
    )
}

export default Chat