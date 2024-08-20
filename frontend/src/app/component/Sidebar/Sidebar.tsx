"use client"
import ChatServices from '@/app/services/chatServices'
import { errorHandler } from '@/app/utils/commonFunction'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import AddNewUser from './AddNewUser'
import FriendRequest from './FriendRequest'
import { sidebarFriendsType, UserChatList } from '@/app/types/commonType'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/redux/store'
import { useParams, useSearchParams } from 'next/navigation'
import EmitEvents from '@/app/utils/constant'

interface Params {
    chatId?: string; // Define the expected route parameter
}

const Sidebar = () => {

    const { userInfo, socket } = useSelector((state: RootState) => state.user)
    const [inputValue, setInputValue] = useState("")
    const [allFriends, setAllFriends] = useState<UserChatList[]>([])
    const [filterFriends, setFilteredFriends] = useState<UserChatList[]>([])
    const [loading, setLoading] = useState(true)
    const searchParams = useSearchParams()
    const chatId = searchParams?.get("chatId")

    const fetchAllChats = async () => {
        try {

            const res = await ChatServices.getAllChats()

            const modifiedData = res?.data?.data?.map((chat: UserChatList) => {
                return { ...chat, friendDetails: chat?.members?.filter((member) => member._id != userInfo._id) }
            })
            setAllFriends(modifiedData)
            setFilteredFriends(modifiedData)
        } catch (error) {
            errorHandler(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (userInfo?._id) {
            setLoading(true)
            fetchAllChats()
        }
    }, [userInfo])

    useEffect(() => {

        const refetchChatHandler = () => {
            fetchAllChats()
        }

        if (socket) {
            socket.on(EmitEvents.REFETCH_CHATS, refetchChatHandler)
        }

        return () => socket && socket.off(EmitEvents.REFETCH_CHATS, refetchChatHandler)


    }, [socket])


    useEffect(() => {
        if (inputValue?.length > 0) {
            let filteredFriends = allFriends?.filter((data) => {
                // if (data?.members?.name?.toLowerCase()?.includes(inputValue?.toLowerCase())) {
                //     return data
                // }
            })
            setFilteredFriends(filteredFriends)
        } else {
            setFilteredFriends(allFriends)
        }
    }, [inputValue])



    return (
        <div className={`w-1/4  h-chatCon border-r border `}>
            <div className='m-2'>
                <div className="flex justify-end gap-1">
                    <FriendRequest />
                    <AddNewUser />
                </div>
                <input
                    type='text'
                    className='input border  border-black w-full object-cover'
                    placeholder='Search User'
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                />
            </div>
            {loading && <p className='text-center mt-10'>List is loading...</p>}
            {!loading && filterFriends?.map((data, key) => (
                <Link href={`/?chatId=${data?._id}`}>
                    {data?.groupChat
                        ?
                        <>
                            <div className={`w-100  flex items-center gap-4 p-3 border-gray-100 border-b border-1 ${chatId == data?._id && "bg-gray-200"} hover:bg-gray-200 cursor-pointer  `}>
                                <img
                                    src={data?.avatar?.url || "/images/defaultGroupImage.jpg"}
                                    alt="user-image"
                                    className="rounded-full h-[50px] w-[50px]"

                                />

                                <div className="w-48">
                                    <h3 className='font-semibold'>{data?.name}</h3>
                                    <p className='text-xs text-gray-700 truncate w-[100px]'>{data?.lastMessage}</p>
                                </div>

                            </div>
                        </>
                        :
                        <>
                            <div className={`w-100  flex items-center gap-4 p-3 border-gray-100 border-b border-1 ${chatId == data?._id && "bg-gray-200"} hover:bg-gray-200 cursor-pointer  `}>
                                <img
                                    src={data?.friendDetails?.[0]?.avatar?.url || ""}
                                    alt="user-image"
                                    className="rounded-full h-[50px] w-[50px]"

                                />
                                <div className="w-48">
                                    <h3 className='font-semibold'>{data?.friendDetails?.[0]?.name}</h3>
                                    <p className='text-xs text-gray-700 truncate w-[100px]'>{data?.lastMessage}</p>
                                </div>

                            </div>
                        </>
                    }

                </Link>
            ))}



        </div>
    )
}

export default Sidebar