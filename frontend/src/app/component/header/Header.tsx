
import CreateGroup from './CreateGroup'
import Logout from './Logout'

const Header = () => {
    return (
        <div className='w-100 bg-blue-400 py-4 px-8 relative z-10'>
            {/* logo */}


            <div className="flex items-center justify-between">
                <span className=" font-semibold text-white  text-xl ">ChatMe</span>

                <div className="flex items-center gap-6">

                    <CreateGroup pageName='create' chatDetails={undefined} />
                    <Logout />
                </div>
            </div>
        </div>
    )
}

export default Header