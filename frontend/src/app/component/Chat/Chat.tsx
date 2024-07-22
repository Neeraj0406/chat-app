import React from 'react'
import ChatHeader from './ChatHeader'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'

const Chat = () => {
    return (
        <div className='w-full h-chatCon  '>
            <ChatHeader />
            <ChatMessage />
            <ChatInput />
        </div>
    )
}

export default Chat