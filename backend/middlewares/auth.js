import { showError, showServerError } from "../utils/apiResponse.js";
import constant from "../constants/contant.js";
import { verifyToken } from "../utils/helper.js";

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

const socketAuthenticator = async (req, res, next) => {

}

export { isAuthenticatedUser, socketAuthenticator };
