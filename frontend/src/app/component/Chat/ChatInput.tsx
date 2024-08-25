"use client"
import { RootState } from '@/app/redux/store'
import EmitEvents from '@/app/utils/constant'
import React, { RefObject, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { GrAttachment } from "react-icons/gr";
import { MessageType } from '@/app/types/commonType'
import { errorHandler, scrollChatToBottom } from '@/app/utils/commonFunction'
import { toast } from 'react-toastify'
import ChatServices from '@/app/services/chatServices'


interface chatProps {
    chatId: string
    bottomRef: RefObject<HTMLDivElement>
    setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>

}

const ChatInput: React.FC<chatProps> = ({ chatId, setMessages, bottomRef }) => {
    const [message, setMessage] = useState<string>("")
    const { userInfo, socket } = useSelector((state: RootState) => state.user)
    const inputRef = useRef<HTMLInputElement | null>(null);
    const attachmentRef = useRef<HTMLInputElement>(null);
    const [typing, setTyping] = useState<boolean>(false)

    const handleSubmit = (e: any) => {
        e.preventDefault()
        if (message?.trim().length > 0 && socket) {
            socket?.emit(EmitEvents.NEW_MESSAGE, { chatId, message })
            const newMessage: MessageType = {
                content: message,
                _id: userInfo?._id,
                sender: {
                    _id: userInfo?._id,
                    name: userInfo?.name,
                    avatar: {
                        url: userInfo?.avatar,
                        public_id: "adf"
                    }
                },
                attachments: [],
                chatId,
                createdAt: new Date()?.toISOString(),
                updatedAt: new Date()?.toISOString(),
            }
            setMessages((prev) => [...prev, newMessage])
            setMessage("")

        }
    }

    useEffect(() => {
        setMessage("")
        inputRef?.current?.focus()
    }, [chatId])


    const handleAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e?.target?.files || [])

        if (files.length < 1) return
        if (files.length > 5) {
            return toast.error("Can't upload more than 5 files")
        }
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"]
        let imageTypeError = false
        const toastId = toast.loading('File sending')

        files?.forEach((file) => {
            if (!allowedTypes?.includes(file.type)) {
                return imageTypeError = true
            }
        })

        if (imageTypeError) {
            toast.update(toastId, {
                render: `Image not sent,Only following file types are allowed ${allowedTypes?.join(", ")}`,
                type: "error",
                isLoading: false,
                autoClose: 5000
            });
        }

        try {
            const formdata = new FormData()
            formdata.append("chatId", chatId)
            files?.forEach((file) => {
                formdata.append("files", file)
            })
            const res = await ChatServices.sendAttachments(formdata)
            toast.update(toastId, {
                render: res.data?.message,
                type: "success",
                isLoading: false,
                autoClose: 5000
            });
            const sentFileUrl = files?.map((file) => {
                return {
                    url: URL.createObjectURL(file),
                    public_id: "asdfasd"
                }
            })
            const newMessage: MessageType = {
                content: "",
                _id: userInfo?._id,
                sender: {
                    _id: userInfo?._id,
                    name: userInfo?.name,
                    avatar: {
                        url: userInfo?.avatar,
                        public_id: "adf"
                    }
                },
                attachments: sentFileUrl,
                chatId,
                createdAt: new Date()?.toISOString(),
                updatedAt: new Date()?.toISOString(),
            }
            setMessages((prev) => [...prev, newMessage])
        } catch (error) {
            errorHandler(error, toastId)
        }
        e.target.value = ""
    }

    const handleInputChange = (value: string,) => {
        if (value.length > 0) {
            if (!typing) {
                socket.emit(EmitEvents.START_TYPING, { chatId })
                setTyping(true)
            }
        }
        setMessage(value)
    }

    useEffect(() => {

        const handler = setTimeout(() => {
            if (typing) {
                setTyping(false)
            }
        }, 2000)


        return () => clearTimeout(handler)
    }, [typing])


    const handleInputBlur = () => {
        if (message?.length < 1) {
            socket.emit(EmitEvents.STOP_TYPING, { chatId })
            setTyping(false)
        }
    }

    return (
        <div className='mx-4'>
            <form onSubmit={handleSubmit}>
                <div className=" flex gap-1">

                    <input
                        ref={inputRef}
                        type="text"
                        className='input border w-auto'
                        value={message}
                        autoFocus
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            handleInputChange(e.target.value)

                        }}
                        onBlur={handleInputBlur}
                    />
                    <input type="file" name="attachment" ref={attachmentRef} className='hidden' onChange={e => handleAttachment(e)} />
                    <button className='button' type='button' onClick={() => attachmentRef?.current?.click()}><GrAttachment /> </button>
                    <button type="submit" className='button'>Send</button>
                </div>
            </form>
        </div>
    )
}

export default ChatInput