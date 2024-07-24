"use client"
import ChatServices from '@/app/services/chatServices'
import { errorHandler } from '@/app/utils/commonFunction'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import AddNewUser from './AddNewUser'
import FriendRequest from './FriendRequest'
import { sidebarFriendsType } from '@/app/types/commonType'
import Link from 'next/link'



const Sidebar = () => {

    const [inputValue, setInputValue] = useState("")
    const [allFriends, setAllFriends] = useState<sidebarFriendsType[]>([])
    const [filterFriends, setFilteredFriends] = useState<sidebarFriendsType[]>([])
    const [loading, setLoading] = useState(true)

    const fetchFriendList = async () => {
        try {
            setLoading(true)
            const res = await ChatServices.getMyFriends()
            setAllFriends(res.data.data)
            setFilteredFriends(res.data.data)
        } catch (error) {
            errorHandler(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFriendList()
    }, [])


    useEffect(() => {
        if (inputValue?.length > 0) {
            let filteredFriends = allFriends?.filter((data) => {
                if (data?.friend?.name?.toLowerCase()?.includes(inputValue?.toLowerCase())) {
                    return data
                }
            })
            setFilteredFriends(filteredFriends)
        } else {
            setFilteredFriends(allFriends)
        }
    }, [inputValue])

    console.log("allFriends", allFriends)


    return (
        <div className=' w-1/4 h-chatCon border-r border'>
            <div className='m-2'>
                <div className="flex justify-end gap-1">
                    <FriendRequest />
                    <AddNewUser />
                </div>
                <input
                    type='text'
                    className='input border  border-black w-full'
                    placeholder='Search User'
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                />
            </div>

            {loading && <p className='text-center mt-10'>List is loading...</p>}
            {!loading && filterFriends?.map((data, key) => (
                <Link href={`/?chatId=${data?.friend?._id}`}>
                    <div className="w-100  flex items-center gap-4 p-3 border-gray-100 border-b border-1 hover:bg-gray-200 cursor-pointer  ">
                        <img
                            src={data?.friend?.avatar?.url}
                            alt="user-image"
                            className="rounded-full h-[50px] w-[50px]"

                        />
                        <div className="w-48">
                            <h3 className='font-semibold'>{data?.friend?.name}</h3>
                            <p className='text-sm truncate  '>Message : Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde quas eius voluptate amet nostrum ab iste incidunt expedita dicta, culpa assumenda, aliquam dignissimos placeat est quasi voluptas pariatur similique minus enim fugit voluptatibus consequuntur, tenetur cupiditate nulla? Iste perferendis quia, maiores deserunt maxime debitis dolorem nobis repudiandae ea. Ratione, nostrum. </p>
                        </div>

                    </div>
                </Link>
            ))}



        </div>
    )
}

export default Sidebar