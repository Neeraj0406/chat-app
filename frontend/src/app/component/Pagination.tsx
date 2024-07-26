"use client"
import { Button } from '@material-tailwind/react'
import React, { useMemo } from 'react'
import { paginDataType, searchUserPayloadType } from '../types/commonType'

type PaginationInterface = {
    payload: searchUserPayloadType,
    setPayload: React.Dispatch<React.SetStateAction<searchUserPayloadType>>
    ,
    totalDocumentCount: number,

}

const Pagination = ({ payload, setPayload, totalDocumentCount }: PaginationInterface) => {


    const minPageSize = 1
    const maxPageSize = useMemo(() => {
        return totalDocumentCount > 0 ? Math.ceil(totalDocumentCount / payload.pageSize) : 1
    }, [totalDocumentCount, payload])



    const onInputChange = (type: "add" | "sub") => {

        if (type == "add" && payload.pageNumber < maxPageSize) {

            setPayload({
                ...payload,
                pageNumber: payload.pageNumber + 1
            })
        }
        else if (type == "sub" && payload.pageNumber > minPageSize) {
            setPayload({
                ...payload,
                pageNumber: payload.pageNumber - 1
            })
        }
    }

    return (
        <div className='flex  justify-center mt-2'>
            <Button onClick={() => onInputChange("sub")}>-</Button>
            <p className='border w-10 h-auto text-center pt-2 mx-3 rounded-full' > {payload?.pageNumber?.toString()}</p>
            <Button onClick={() => onInputChange("add")}>+</Button>
        </div>
    )
}

export default Pagination