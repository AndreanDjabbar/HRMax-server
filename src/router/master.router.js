import express from "express";
import * as MasterController from "../controller/master.controller.js";
import catchAsync from "../middleware/catchAsync.middleware.js";
import timeout from "connect-timeout";
import rateLimiter from "../middleware/limiter.middleware.js";

const router = express.Router();
const masterLimiter = (minuteTime, requestAmount, prefix) => {
    return rateLimiter('master', { minuteTime, requestAmount, prefix });
}

router.get(
    "/countries", 
    masterLimiter(5, 50, "countries"),
    timeout('3s'),
    catchAsync(MasterController.getCountriesController)
);

export default router;