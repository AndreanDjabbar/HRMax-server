import UserRepository from "../repository/user.repository.js";
import { auth } from "../util/auth.util.js"
import { responseError } from "../util/response.util.js";

const protectRoute = async (req, res, next) => {
    try {
        const sessionData = await auth.api.getSession({
            headers: req.headers,
        });
        if (!sessionData || !sessionData.user) {
            const error = new Error("Unauthorized access, please log in first.");
            error.statusCode = 401;
            throw error;
        }

        const userDetailData = await UserRepository.getUserByID(sessionData.user.id);

        req.user = {
            id: sessionData.user.id,
            email: sessionData.user.email,
            role: userDetailData.role ? userDetailData.role.name : null,
            name: sessionData.user.name,
        }
        next();
    } catch(error) {
        return responseError(res, error.statusCode || 401, error.message || "Unauthorized access", "error", error.message || "UNAUTHORIZED");
    }
}

export default protectRoute;