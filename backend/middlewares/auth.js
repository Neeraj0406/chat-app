import { showError, showServerError } from "../utils/apiResponse.js";
import constant from "../constants/contant.js";
import { verifyToken } from "../utils/helper.js";
import { User } from "../models/userModel.js";

const isAuthenticatedUser = async (req, res, next) => {
    try {
        const token = req.headers.token?.split(" ")[1]

        if (!token) {
            return showError(res, "Token not provided", 401);
        }

        const decodedToken = verifyToken(token);
        if (!decodedToken._id) {
            return showError(res, "Invalid token", 401);
        }

        req.id = decodedToken._id;
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return showError(res, "Token has expired", 401);
        }
        return showServerError(res);
    }
}

const socketAuthenticator = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token

        if (!token) {
            return next(new Error("Authentication error"))
        }

        const decodedToken = verifyToken(token)
        if (decodedToken?._id) {
            const user = await User.findById(decodedToken?._id)
            socket.user = user
            next()

        } else {
            console.log("Error while verify token for socket")
            next(new Error("Token expired"))
        }
    } catch (error) {
        console.log("Error while verify token for socket")
        next(new Error('Authentication error'));
    }
}

export { isAuthenticatedUser, socketAuthenticator };
