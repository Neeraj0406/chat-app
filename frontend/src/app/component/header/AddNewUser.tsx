"use client"
import { Button } from '@material-tailwind/react'
import React, { useState } from 'react'

const AddNewUser = () => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);



    return (
        <>
            <Button onClick={openModal}
                className="bg-mainColor float-right mb-1">
                Add New User
            </Button>



            {isOpen && (
                <div
                    onClick={closeModal}
                    className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative m-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 antialiased shadow-2xl"
                    >
                        <div className="flex items-center p-4 font-sans text-2xl antialiased font-semibold leading-snug shrink-0 text-blue-gray-900">
                            Search User
                        </div>
                        <div className="relative p-4  text-base  overflow-y-auto  border-t border-b border-t-blue-gray-100 border-b-blue-gray-100 ">

                            <input
                                type="text"
                                className='input border'
                                placeholder='Search User'
                            />

                            <div className="flex flex-wrap gap-2 h-[500px] mt-2  overflow-y-auto ">
                                {new Array(4)?.fill(0)?.map(() => (
                                    <div className=" w-[240px] border flex items-center py-4 px-1 flex-col gap-2">
                                        <img src="/images/defaultUser.png" alt="user image" className='h-[80px] w-[80px] rounded-full' />
                                        <div className="">
                                            <div>
                                                <strong> Name: </strong>  Neeraj
                                            </div>
                                            <div>
                                                <strong>Username:</strong>  Neeraj
                                            </div>
                                            {/* <div className='w-[200px] overflow-hidden text-ellipsis'>
                                               Bio : Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eos eaque corporis reiciendis labore est accusantium ducimus, laborum quam quae ratione optio laboriosam rerum mollitia, corrupti laudantium sapiente soluta ea aspernatur cum perspiciatis. Impedit dicta facilis corporis, labore recusandae nisi obcaecati voluptates sit quos ea? Dolorum ullam vitae praesentium rem qui!
                                           </div> */}

                                        </div>
                                        <Button className="bg-green-400">Add</Button>

                                    </div>
                                ))}
                            </div>


                        </div>



                        <div className="flex flex-wrap items-center justify-end p-4 shrink-0 text-blue-gray-500">
                            <button
                                onClick={closeModal}
                                className="px-6 py-3 mr-1 font-sans text-xs font-bold bg-red-500 text-white uppercase transition-all rounded-lg middle none center hover:bg-red-700  disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            >
                                Close
                            </button>

                        </div>
                    </div>
                </div >
            )}


        </>
    )
}

export default AddNewUser