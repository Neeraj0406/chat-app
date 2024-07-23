"use client"
import ChatServices from '@/app/services/chatServices';
import { searchUserPayloadType, serachUserType } from '@/app/types/commonType';
import { errorHandler } from '@/app/utils/commonFunction';
import { Button } from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import UserList from '../header/UserList';

const AddNewUser = () => {


    return (
        <UserList
            pageName="searchUserPage"
            buttonName="Add New User"
            pageHeading="Search User"
        />
    )
}

export default AddNewUser