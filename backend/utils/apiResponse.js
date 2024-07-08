export const showResponse = async (res, data, message, statusCode = 200) => {
    if (data) {
        return res.status(statusCode).json({ data, message })
    } else {
        return res.status(statusCode).json({ message })
    }
}


export const showError = (res, message, statusCode = 400) => {
    return res.status(statusCode).json({ message })
}



export const showServerError = (res) => {
    return res.status(500).json({ message: "Server error" })
}
