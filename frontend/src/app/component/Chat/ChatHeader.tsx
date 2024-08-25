"use client"
import { chatDetailsType, Member } from '@/app/types/commonType'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import CreateGroup from '../header/CreateGroup'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store'
import { Button } from '@material-tailwind/react'
import ConfirmModal from '../ConfirmModal'
import { errorHandler } from '@/app/utils/commonFunction'
import ChatServices from '@/app/services/chatServices'
import { toast } from 'react-toastify'
import { useRouter, useSearchParams } from 'next/navigation'
import EmitEvents from '@/app/utils/constant'

const ChatHeader = ({ chatDetails, groupAdmin, setRefresh, refresh }: {
    chatDetails: chatDetailsType | null | undefined, groupAdmin: boolean, refresh: boolean, setRefresh: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const { userInfo, socket } = useSelector((state: RootState) => state.user)
    const [friendDetails, setFriendDetails] = useState<Member>()
    const [typingInfo, setTypingInfo] = useState<string>("")
    const router = useRouter()
    const searchParams = useSearchParams()
    const chatId = searchParams.get("chatId")


    useEffect(() => {
        if (chatDetails) {
            if (!chatDetails?.groupChat) {
                const temp = chatDetails?.members?.filter((member) => member?._id != userInfo?._id)
                setFriendDetails(temp[0])
            }
        }
    }, [chatDetails])


    const handleConfirm = async () => {
        try {
            const res = await ChatServices.leaveGroup(chatDetails?._id || "")
            setRefresh(!refresh)
            toast.success(res?.data?.message)
            router.push("/")
        } catch (error) {
            errorHandler(error)
        }
    }

    useEffect(() => {
        const startTypingHandler = async (data: any) => {
            console.log("header", chatId, data.chatId)
            if (chatId == data?.chatId) {
                console.log("start typing listner", data)
                const msg = `${data?.user?.name} is typing...`
                setTypingInfo(msg)
            }
        }
        const stopTypingHandler = async (data: any) => {
            console.log("stop typing listner", data)
            setTypingInfo("")
        }
        if (socket) {
            socket.on(EmitEvents.START_TYPING, startTypingHandler)
            socket.on(EmitEvents.STOP_TYPING, stopTypingHandler)
        }
        return () => {
            if (socket) {
                socket.off(EmitEvents.START_TYPING, startTypingHandler)
            }
            setTypingInfo("")
        }
    }, [socket, chatId])

    console.log("typing info", typingInfo);


    return (
        <div className='border px-6 py-2 flexCon gap-4 justify-between'>
            <div className="flexCon gap-4">
                {!chatDetails?.groupChat
                    ?
                    <>
                        <img
                            src={friendDetails?.avatar?.url}
                            alt='user image'
                            className='rounded-full object-cover h-[50px] w-[50px]'
                        />
                        <div className="flex flex-col">
                            <h3 className='text-semibold'>{friendDetails?.name}</h3>
                            <small>{typingInfo}</small>
                        </div>
                    </>
                    :
                    <>
                        <img
                            src={chatDetails?.avatar?.url || "/images/defaultGroupImage.jpg"}
                            alt='user image'
                            className='rounded-full object-cover h-[50px] w-[50px]'
                        />
                        <div className="flex flex-col">
                            <h3 className='text-semibold'>{chatDetails?.name}</h3>
                            <small>{typingInfo}</small>
                        </div>
                    </>
                }

            </div>
            <div className='flex items-center gap-4'>
                <ConfirmModal btnName='Leave Group' msg='Are you sure you want to leave this group' handleConfirm={handleConfirm} />
                {groupAdmin && <CreateGroup pageName="manage" chatDetails={chatDetails} setRefresh={setRefresh} refresh={refresh} />}
            </div>

        </div>
    )
}

export default ChatHeader