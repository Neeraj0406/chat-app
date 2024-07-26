"use client"
import { chatDetailsType } from '@/app/types/commonType'
import Image from 'next/image'
import React from 'react'
import CreateGroup from '../header/CreateGroup'

const ChatHeader = ({ chatDetails, groupAdmin }: { chatDetails: chatDetailsType | undefined, groupAdmin: boolean }) => {
    return (
        <div className='border px-6 py-2 flexCon gap-4 justify-between'>
            <div className="flexCon gap-4">

                <img
                    src={chatDetails?.avatar?.url || "https://picsum.photos/200"}
                    alt='user image'
                    className='rounded-full object-cover h-[50px] w-[50px]'
                />
                <h3 className='text-semibold'>{chatDetails?.name}</h3>
            </div>
            {groupAdmin && <CreateGroup pageName="manage" chatDetails={chatDetails} />}

        </div>
    )
}

export default ChatHeader