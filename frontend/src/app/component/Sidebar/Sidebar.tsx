import Image from 'next/image'

const fetchChatList = async () => {
    // const res = await axiosInstance()
}


const Sidebar = () => {
    return (
        <div className=' w-1/4 h-chatCon border-r border'>
            <div className='m-2'>
                <input type='text' className='input border  border-black w-full' placeholder='Search User' />
            </div>

            <div className="w-100  flex items-center gap-4 p-3 border-gray-100 border-b border-1 hover:bg-gray-200 cursor-pointer  ">
                <Image
                    src="https://picsum.photos/200"
                    alt="user-image"
                    width={50}
                    height={50}
                    className="rounded-full"
                    objectFit="cover"
                />
                <div className="w-48">
                    <h3 className='font-semibold'>Neeraj</h3>
                    <p className='text-sm truncate  '>Message : Hello  Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello </p>
                </div>

            </div>
            <div className="  flex items-center gap-4 p-3 border-gray-100 border-b border-1 hover:bg-gray-200 cursor-pointer  ">
                <Image
                    src="https://picsum.photos/200"
                    alt="user-image"
                    width={50}
                    height={50}
                    className="rounded-full"
                    objectFit="cover"
                />
                <div className="w-48">
                    <h3 className='font-semibold'>Neeraj</h3>
                    <p className='text-sm truncate  '>Message : Hello  Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello </p>
                </div>
            </div>
            <div className="  flex items-center gap-4 p-3 border-gray-100 border-b border-1 hover:bg-gray-200 cursor-pointer  ">
                <Image
                    src="https://picsum.photos/200"
                    alt="user-image"
                    width={50}
                    height={50}
                    className="rounded-full"
                    objectFit="cover"
                />
                <div className="w-48">
                    <h3 className='font-semibold'>Neeraj</h3>
                    <p className='text-sm truncate  '>Message : Hello  Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello </p>
                </div>
            </div>
            <div className="  flex items-center gap-4 p-3 border-gray-100 border-b border-1 hover:bg-gray-200 cursor-pointer  ">
                <Image
                    src="https://picsum.photos/200"
                    alt="user-image"
                    width={50}
                    height={50}
                    className="rounded-full"
                    objectFit="cover"
                />
                <div className="w-48">
                    <h3 className='font-semibold'>Neeraj</h3>
                    <p className='text-sm truncate  '>Message : Hello  Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello </p>
                </div>
            </div>

        </div>
    )
}

export default Sidebar