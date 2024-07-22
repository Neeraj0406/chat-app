
import React from 'react'
import Logout from './Logout'

const Header = () => {
    return (
        <div className='w-100 bg-blue-400 py-4 px-8'>
            {/* logo */}
            <div className="flex items-center justify-between">
                <span className=" font-semibold text-white  text-xl ">ChatMe</span>
                <Logout />
            </div>
        </div>
    )
}

export default Header