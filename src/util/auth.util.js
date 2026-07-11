import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../../prisma/generated/prisma/index.js";
import { sendVerificationEmail } from "./main.util.js";

const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        sendVerificationEmailOnSignUp: false,
        autoSignIn: false,
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp, type }) { 
                if (type === "sign-in") { 
                } else if (type === "email-verification") { 
                    sendVerificationEmail(email, otp);
                } else { 
                    throw new Error(`Unhandled OTP type: ${type}`);
                } 
            }, 
        })
    ]
})

export const isCorporateEmail = (email) => {
    if (!email || !email.includes("@")) return false;
    const domain = email.split("@")[1].toLowerCase();
    
    const publicDomains = [
        'gmail.com',
        'yahoo.com',
        'hotmail.com',
        'outlook.com',
        'live.com',
        'icloud.com',
        'aol.com',
        'zoho.com'
    ];

    return !publicDomains.includes(domain);
}