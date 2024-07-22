
import Logout from './Logout'

const Header = () => {
    return (
        <div className='w-100 bg-blue-400 py-4 px-8'>
            {/* logo */}


            <div className="flex items-center justify-between">
                <span className=" font-semibold text-white  text-xl ">ChatMe</span>

                <div className="flex items-center gap-4">
                
                    <Logout />
                </div>
            </div>
        </div>
    )
}

export default Header