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
        console.log(error);
        return showServerError(res);
    }
}

export { isAuthenticatedUser };
