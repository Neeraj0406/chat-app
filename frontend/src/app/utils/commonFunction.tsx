import { toast } from "react-toastify"

export const errorHandler = (error: any, toastId?: any) => {
    if (error.response.data.message) {
        if (toastId) {
            toast.update(toastId, {
                render: error.response.data.message,
                type: "error",
                isLoading: false,
                autoClose: 5000
            });
        } else {
            console.log(error.response.data.message)
            toast.error(error.response.data.message)
        }

    } else {
        toast.error("Something went wrong!!")
    }
}



export const scrollChatToBottom = (ref: any) => {
    if (ref?.current) {
        ref?.current?.scrollIntoView({ behavior: 'smooth', inline: "end" });
    }
}

