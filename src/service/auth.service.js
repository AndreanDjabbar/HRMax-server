import bcrypt from "bcrypt";
import { generateOTPNumber, generateRandomToken, sendResetPasswordEmail, sendVerificationEmail } from "../util/main.util.js";
import { getRedisClient } from "../config/redis.config.js";
import { generateJWTToken, verifyToken } from "../util/jwt.util.js";
import UserRepository from "../repository/user.repository.js";
import MasterRepository from "../repository/master.repository.js";
import { auth } from "../util/auth.util.js";

class AuthService {
    static async login(req) {
        const { email, password } = req.body;
        const user = await UserRepository.getUserByEmail(email);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        if (!user.is_verified || !user.emailVerified) {
            const error = new Error("User email not verified");
            error.statusCode = 403;
            throw error;
        }

        const sessionData = await auth.api.signInEmail({
            body: {
                email: email,
                password: password
            },
            headers: req.headers,
            asResponse: true
        })
        return sessionData
    }

    static async register(name, email, password, phoneInformation) {
        const { countryCode, phoneNumber } = phoneInformation || {};

        const existingCountry = await MasterRepository.getCountryByCountryCode(countryCode);
        if (!existingCountry) {
            const error = new Error("Invalid country code");
            error.statusCode = 400;
            throw error;
        }
        const existingUser = await UserRepository.getUserByEmail(email);
        if (existingUser) {
            const error = new Error("User with this email already exists, please use a different email or login.");
            error.statusCode = 400;
            throw error;
        }
        let newUser = null;

        try {
            const registerResult = await auth.api.signUpEmail({
                body: {
                    email: email,
                    password: password,
                    name: name,
                }
            })
            newUser = registerResult.user;

            const userProfile = await UserRepository.createUserProfile(newUser.id, {
                profileImage: null,
                phoneCountryID: existingCountry.id,
                phoneNumber: phoneNumber,
            });

            await auth.api.sendVerificationOTP({
            body: {
                    email: email,
                    otp: generateOTPNumber(),
                    type: "email-verification"
                }
            });

            return {
                user: newUser,
            }
        } catch(error) {
            if (newUser && newUser.id) {
                await UserRepository.deleteUserbyID(newUser.id);
            }
            throw error;
        }
    }

        static async verifyRegisterOtp(email, otpCode) {
        const user = await UserRepository.getUserByEmail(email);
        if(!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        if(user.is_verified) {
            const error = new Error("User is already verified");
            error.statusCode = 400;
            throw error;
        }
        const verificationResult = await auth.api.verifyEmailOTP({
        body: { 
            email: email, 
            otp: otpCode
            }
        });
        await UserRepository.verifiedUserByID(user.id);
        return user;
    }

    static async verifyRegisterToken(token, email) {
        const user = await UserRepository.getUserByEmail(email);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        const redisKey = `emailVerification:${user.id}`;
        const redisClient = await getRedisClient();
        const storedToken = await redisClient.hget(redisKey, "emailVerificationToken");
        if (token !== storedToken) {
            const error = new Error("Invalid or expired token");
            error.statusCode = 400;
            throw error;
        }
        return user;
    }

    static async forgotPasswordEmailVerification(email) {
        const user = await UserRepository.getUserByEmail(email);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        const redisClient = await getRedisClient();
        const resetToken = generateRandomToken(100);
        const redisKey = `forgotPassword:${user.id}`;
        await redisClient.hset(redisKey, {
            resetToken
        });
        await redisClient.expire(redisKey, 15 * 60);

        sendResetPasswordEmail(email, resetToken);
    }

    static async forgotPasswordLinkVerification(token, email) {
        const user = await UserRepository.getUserByEmail(email);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        const redisKey = `forgotPassword:${user.id}`;
        const redisClient = await getRedisClient();
        const storedToken = await redisClient.hget(redisKey, "resetToken");
        if (token !== storedToken) {
            const error = new Error("Invalid or expired token");
            error.statusCode = 400;
            throw error;
        }
    }

    static async forgotPasswordReset(token, email, newPassword) {
        const user = await UserRepository.getUserByEmail(email);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        if (!user.is_verified) {
            const error = new Error("User email not verified");
            error.statusCode = 403;
            throw error;
        }

        const redisKey = `forgotPassword:${user.id}`;
        const redisClient = await getRedisClient();
        const storedToken = await redisClient.hget(redisKey, "resetToken");
        if (token !== storedToken) {
            const error = new Error("Invalid or expired token");
            error.statusCode = 400;
            throw error;
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await UserRepository.updateUser(user.id, { password: hashedPassword });
        await redisClient.del(redisKey);
    }

    static async logout(token) {
        if (!token) {
            const error = new Error("Token is required");
            error.statusCode = 400;
            throw error;
        }
        const redisClient = await getRedisClient();
        const blacklistKey = `blacklistToken:${token}`;
        await redisClient.set(blacklistKey, "blacklisted");
        const decoded = verifyToken(token);
        const expiresAt = new Date(decoded.exp * 1000);
        const ttl = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
        await redisClient.expire(blacklistKey, ttl);
    }
}

export default AuthService;