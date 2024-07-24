"use client"
import Image from 'next/image'
import React, { useEffect, useRef } from 'react'

const ChatMessage = () => {
    const bottomRef = useRef<HTMLDivElement>(null);


    const scrollChatToBottom = () => {
        if (bottomRef.current) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth', inline: "end" });
        }
    }

    useEffect(() => {
        scrollChatToBottom()
    }, [])

    return (
        <div className='h-chatHeight overflow-y-auto m-5'>
            <SenderMessage />
            <div ref={bottomRef}>
                <YourMessages />
            </div>
        </div>
    )
}




const SenderMessage = () => {


    return (
        <div >
            <div className=' max-w-[400px] mb-2 '>
                <h3 className='text-bold text-sm ml-[50px]'>Neeraj</h3>
                <div className="flex items-start gap-2">
                    <Image
                        src={"https://picsum.photos/200"}
                        alt='user image'
                        width={40}
                        height={40}
                        className='rounded-full'
                    />
                    <p className='bg-mainColor rounded-md p-3 shadow-md'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laudantium dolores ab in tempore dicta sequi voluptates ad at similique doloremque! Excepturi, sed ipsa incidunt culpa sit deserunt neque, facere magnam quos totam repudiandae animi possimus nam? At, fuga quam. Ut animi dolore inventore enim dolorem quaerat amet, maiores hic excepturi quibusdam qui et reprehenderit similique, ex eaque dicta repellat praesentium quisquam laborum voluptatem at repudiandae non. Nostrum excepturi corrupti maiores aut neque, quam error. Illo recusandae sunt nisi natus, assumenda doloribus? Sequi vitae, laudantium suscipit corporis ipsum laborum debitis nam. Doloribus iusto eligendi eaque veniam deserunt, numquam suscipit asperiores totam.</p>
                </div>
            </div>
            <div className=' max-w-[400px] mb-2 '>
                <h3 className='text-bold text-sm ml-[50px]'>Neeraj</h3>
                <div className="flex items-start gap-2">
                    <Image
                        src={"https://picsum.photos/200"}
                        alt='user image'
                        width={40}
                        height={40}
                        className='rounded-full'

                    />
                    <p className='bg-mainColor rounded-md p-3'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Adipisci, alias!</p>
                </div>
            </div>
            <div className=' max-w-[400px] mb-2 '>
                <h3 className='text-bold text-sm ml-[50px]'>Neeraj</h3>
                <div className="flex items-start gap-2">
                    <Image
                        src={"https://picsum.photos/200"}
                        alt='user image'
                        width={40}
                        height={40}
                        className='rounded-full'
                    />
                    <p className='bg-mainColor rounded-md p-3'>Lorem ipsum dolor sit.</p>
                </div>
            </div>
            <div className=' max-w-[400px] mb-2 '>
                <h3 className='text-bold text-sm ml-[50px]'>Neeraj</h3>
                <div className="flex items-start gap-2">
                    <Image
                        src={"https://picsum.photos/200"}
                        alt='user image'
                        width={40}
                        height={40}
                        className='rounded-full'
                    />
                    <p className='bg-mainColor rounded-md p-3'>Lorem ipsum dolor sit.</p>
                </div>
            </div>
            <div className=' max-w-[400px] mb-2 '>
                <h3 className='text-bold text-sm ml-[50px]'>Neeraj</h3>
                <div className="flex items-start gap-2">
                    <Image
                        src={"https://picsum.photos/200"}
                        alt='user image'
                        width={40}
                        height={40}
                        className='rounded-full'
                    />
                    <p className='bg-mainColor rounded-md p-3'>Lorem ipsum dolor sit.</p>
                </div>
            </div>
        </div>
    )
}

const YourMessages = () => {
    return (
        <div className=' max-w-[400px] mb-2 float-right mr-2'>
            <div className="flex items-start gap-2">
                <p className='border bg-gray-300 rounded-md p-3'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laudantium dolores ab in tempore dicta sequi voluptates ad at similique doloremque! Excepturi, sed ipsa incidunt culpa sit deserunt neque, facere magnam quos totam repudiandae animi possimus nam? At, fuga quam. Ut animi dolore inventore enim dolorem quaerat amet, maiores hic excepturi quibusdam qui et reprehenderit similique, ex eaque dicta repellat praesentium quisquam laborum voluptatem at repudiandae non. Nostrum excepturi corrupti maiores aut neque, quam error. Illo recusandae sunt nisi natus, assumenda doloribus? Sequi vitae, laudantium suscipit corporis ipsum laborum debitis nam. Doloribus iusto eligendi eaque veniam deserunt, numquam suscipit asperiores totam.</p>
            </div>
        </div>
    )
}


export default ChatMessage