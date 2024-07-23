

"use client"
import ChatServices from '@/app/services/chatServices';
import { friendRequestType, searchUserPayloadType, serachUserType, userListPropsType } from '@/app/types/commonType';
import { errorHandler } from '@/app/utils/commonFunction';
import { Button } from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const UserList = ({ pageName, buttonName, pageHeading }: userListPropsType) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [searchUser, setSearchUser] = useState<string | number>("")
    const [allUserList, setAllUserList] = useState<serachUserType[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [payload, setPayload] = useState<searchUserPayloadType>({
        pageSize: 10,
        pageNumber: 1,
        search: ""
    })

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false)
        setAllUserList([])

        setSearchUser("")
    };


    useEffect(() => {
        const handleTimer = setTimeout(() => {
            setPayload({ ...payload, search: searchUser })
            setAllUserList([])
        }, 500)

        return () => clearTimeout(handleTimer)
    }, [searchUser])


    const fetchUser = async () => {
        try {

            setLoading(true)
            const res = await ChatServices.serachNewUser(payload)
            console.log(res)
            setLoading(false)
            setAllUserList(res?.data?.data?.data || [])
        } catch (error) {
            errorHandler(error)
        }
    }

    const fetchRequest = async () => {
        try {

            setLoading(true)
            const res = await ChatServices.showFriendRequest()
            const modifiedData = res?.data?.data?.map((data: friendRequestType) => {
                return {
                    _id: data?.sender?.sender_id,
                    name: data?.sender?.name,
                    username: data?.sender?.name,
                    avatar: {
                        url: data?.sender?.avatar?.url
                    },
                    status: true,
                    pendingFromOurSide: true,
                    requestId: data?._id
                }
            })
            setLoading(false)
            setAllUserList(modifiedData || [])

            console.log(res)
            setLoading(false)
        } catch (error) {
            errorHandler(error)
        }
    }

    useEffect(() => {
        if (payload && isOpen) {
            if (pageName == "searchUserPage") {
                fetchUser()
            } else if (pageName == "requestPage") {
                fetchRequest()
            }
        }
    }, [payload, isOpen])


    const sendRequest = async (userId: string) => {
        try {
            const res = await ChatServices.sendRequest(userId)
            toast.success(res.data.message)
            fetchUser()
            console.log(res)
        } catch (error) {
            errorHandler(error)
        }
    }


    const changeRequestStatus = async (requestId: string, status: boolean) => {
        try {
            const payload = {
                requestId, status
            }
            const res = await ChatServices.acceptRejectRequest(payload)
            toast.success(res?.data?.message)
            if (pageName == "searchUserPage") {
                fetchUser()
            } else if (pageName == "requestPage") {
                fetchRequest()
            }
        } catch (error) {
            errorHandler(error)
        }
    }


    const showButton = (status: boolean, pendingFromOurSide: boolean, id: string, requestId: string) => {
        if (!status && !pendingFromOurSide) {
            return <Button className="bg-green-400" onClick={() => sendRequest(id)}>Add</Button>
        }
        else if (status && !pendingFromOurSide) {
            return <Button className="bg-gray-400 cursor-not-allowed" >Sent</Button>
        }
        else if (status && pendingFromOurSide) {
            return (
                <div className='flex gap-1'>
                    <Button className="bg-green-400 py-3 px-4 " onClick={() => changeRequestStatus(requestId, true)}>Accept</Button>
                    <Button className="bg-red-400 py-3 px-4" onClick={() => changeRequestStatus(requestId, false)}>Reject</Button>
                </div>
            )
        }
    }





    return (
        <>
            <Button onClick={openModal}
                className="bg-mainColor  mb-1">
                {buttonName}
            </Button>



            {isOpen && (
                <div
                    onClick={closeModal}
                    className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative m-4 w-2/5 max-w-[40%] rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 antialiased shadow-2xl"
                    >

                        <div className="flex items-center p-4 font-sans text-2xl antialiased font-semibold leading-snug shrink-0 text-blue-gray-900">
                            {pageHeading}
                        </div>


                        <div className="relative p-4  text-base  overflow-y-auto  border-t border-b border-t-blue-gray-100 border-b-blue-gray-100 ">
                            {pageName == "searchUserPage" && (
                                <input
                                    type="text"
                                    className='input border'
                                    placeholder='Search User'
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchUser(e.target.value)}
                                    value={searchUser}
                                />
                            )}

                            <div className="flex flex-wrap gap-2 max-h-[400px]  mt-2  overflow-y-auto ">
                                {loading && <div className='my-5 text-center w-full'> Loading...</div>}
                                {(allUserList?.length < 1 && !loading) && <div className='my-5 text-center w-full'> No user found</div>}
                                {allUserList?.map((user, id) => (
                                    <div className=" w-[230px] border flex items-center justify-evenly py-4 px-1 flex-col gap-2" key={id}>
                                        <img src={user?.avatar?.url || "/images/defaultUser.png"} alt="user image" className='h-[80px] w-[80px] rounded-full' />
                                        <div className="">
                                            <div>
                                                <strong> Name: </strong>  {user?.name}
                                            </div>
                                            <div>
                                                <strong>Username:</strong>  {user?.username}
                                            </div>
                                        </div>

                                        {showButton(user?.status, user?.pendingFromOurSide, user?._id, user?.requestId)}



                                    </div>
                                ))}
                            </div>


                        </div>



                        <div className="flex flex-wrap items-center justify-end p-4 shrink-0 text-blue-gray-500">
                            <button
                                onClick={closeModal}
                                className="px-6 py-3 mr-1 font-sans text-xs font-bold bg-red-500 text-white uppercase transition-all rounded-lg middle none center hover:bg-red-700  disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            >
                                Close
                            </button>

                        </div>
                    </div>
                </div >
            )}


        </>
    )
}

export default UserList