"use client";
import React, { useState } from 'react';
import { Button } from '@material-tailwind/react';

const ConfirmModal = ({ msg, btnName, handleConfirm }: { msg: string, btnName: string, handleConfirm: () => Promise<void> }) => {
    const [open, setOpen] = useState<boolean>(false);

    const onConfirm = () => {
        // Handle delete action here
        handleConfirm()
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button onClick={() => setOpen(true)} className="bg-red-500">
                {btnName}
            </Button>

            {open && (
                <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
                    <div className="relative p-6 m-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 antialiased shadow-2xl">
                        <div className="flex items-center pt-8 justify-center font-sans text-2xl antialiased font-semibold leading-snug shrink-0 text-blue-gray-900">
                            {msg}
                        </div>
                        <div className="flex flex-wrap gap-2 items-center justify-center p-4 shrink-0 text-blue-gray-500 ">
                            <Button
                                onClick={handleClose}
                                className="px-6 py-3 mr-1 font-sans text-xs font-bold bg-red-500 uppercase transition-all rounded-lg  active:bg-red-500/30"
                            >
                                No
                            </Button>
                            <Button
                                onClick={onConfirm}
                                className="px-6 py-3 font-sans text-xs font-bold text-white uppercase transition-all rounded-lg bg-gradient-to-tr from-green-600 to-green-400 shadow-md hover:shadow-lg"
                            >
                                Yes
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConfirmModal;
