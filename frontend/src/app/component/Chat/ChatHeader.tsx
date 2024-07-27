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
import { useRouter } from 'next/navigation'

const ChatHeader = ({ chatDetails, groupAdmin, setRefresh, refresh }: {
    chatDetails: chatDetailsType | undefined, groupAdmin: boolean, refresh: boolean, setRefresh: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const { userInfo } = useSelector((state: RootState) => state.user)
    const [friendDetails, setFriendDetails] = useState<Member>()
    const router = useRouter()

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
                        <h3 className='text-semibold'>{friendDetails?.name}</h3>
                    </>
                    :
                    <>
                        <img
                            src={chatDetails?.avatar?.url || "/images/defaultGroupImage.jpg"}
                            alt='user image'
                            className='rounded-full object-cover h-[50px] w-[50px]'
                        />
                        <h3 className='text-semibold'>{chatDetails?.name}</h3>
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