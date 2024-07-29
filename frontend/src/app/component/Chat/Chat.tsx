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
import EmitEvents from '@/app/utils/constant'

const Chat = () => {
    const searchParams = useSearchParams()
    const chatId = searchParams?.get("chatId")
    const [loading, setLoading] = useState<boolean>(false)
    const [chatDetails, setChatDetails] = useState<chatDetailsType | null>()
    const { userInfo, socket } = useSelector((state: RootState) => state.user)
    const [refresh, setRefresh] = useState<boolean>(false)
    const [messages, setMessages] = useState<any>([])      /////////////////////correct this

    const fetchChatDetails = async (id: string) => {
        try {
            const res = await ChatServices.getChatDetails(id)
            setChatDetails(res?.data?.data)
        } catch (error) {
            errorHandler(error)
        } finally {
            setLoading(false)
        }
    }

    const fetchAllMessages = async (id: string) => {
        try {
            const res = await ChatServices.allMessages(id)
            setMessages(res?.data?.data)
        } catch (error) {
            errorHandler(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (chatId) {
            setMessages([])
            setChatDetails(null)
            fetchChatDetails(chatId)
            fetchAllMessages(chatId)
        }
    }, [chatId, refresh])

    console.log("messages", messages)
    if (loading) {
        return <div> Loading...</div>
    }

    useEffect(() => {
        const newMessageListner = (data: any) => {
            console.log("message received", data)
        }
        if (socket) {
            socket.on(EmitEvents.NEW_MESSAGE, newMessageListner)
        }

        return () => socket && socket.off(EmitEvents.NEW_MESSAGE, newMessageListner)


    }, [socket])


    return (
        <div className='flex-1 md:w-auto h-chatCon  '>
            {chatId ?
                <>
                    <ChatHeader chatDetails={chatDetails} groupAdmin={userInfo?._id == chatDetails?.creator} setRefresh={setRefresh} refresh={refresh} />
                    <ChatMessage messages={messages} />
                    <ChatInput chatId={chatId} />
                </>
                : <div className='flex items-center justify-center h-full opacity-50 '>
                    <div className="w-[500px] h-[500px] relative">

                        <Image
                            src="/images/defaultChat.png"
                            alt='default chat image'
                            layout='fill'
                            objectFit='cover'
                        />
                    </div>
                </div>
            }
        </div>
    )
}

export default Chat