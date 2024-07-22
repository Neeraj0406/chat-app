import Image from 'next/image'
import React from 'react'

const ChatHeader = () => {
    return (
        <div className='border p-2 flexCon gap-4 '>
            <Image
                src={"https://picsum.photos/200"}
                alt='user image'
                width={50}
                height={50}
                className='rounded-full'
            />
            <h3 className='text-semibold'>Neeraj</h3>
        </div>
    )
}

export default ChatHeader