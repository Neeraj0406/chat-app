import React from 'react'

const ChatInput = () => {
    return (
        <div className='mx-4'>
            <div className=" flex gap-1">
                <input type="text" className='input border w-auto' />
                <button className='button'>Send</button>
            </div>
        </div>
    )
}

export default ChatInput