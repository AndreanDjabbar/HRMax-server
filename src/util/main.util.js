import crypto from 'crypto';
import nodemailer from 'nodemailer';
import logger from '../config/logger.config.js';
import { 
    CLIENT_URL, 
    EMAIL, 
    EMAIL_PASSWORD,
    EMAIL_HOST,
    EMAIL_PORT, 
    NODE_ENV 
} from './env.util.js';

export const generateOTPNumber = (len = 6) => {
    const characters = '12345678';
    let result = '';
    for (let i = 0; i < len; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

export const generateRandomToken = (len) => {
    return crypto.randomBytes(len).toString("hex");
}

const transporterConfig = NODE_ENV === 'development' ? {
    service: "gmail",
    auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD,
    },
} : {
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD,
    },
}

const transporter = nodemailer.createTransport(transporterConfig);

export const sendVerificationEmail = (email, otpCode) => {
    const subject = "HRMax Email Verification";
    const body = `
        <html>
        <body>
            <p>Please make sure to go back into the OTP verification page and enter the code immediately.</p>
            <p>Your OTP Code is: <span style="font-size: 27px; letter-spacing: 6px; font-weight: bold;">${otpCode}</span></p>
            <p>Valid for 5 minutes. If you did not request this, ignore this email.</p>
        </body>
        </html>
    `;
    const mailOptions = {
        from: `"HRMax" <${EMAIL}>`,
        to: email,
        subject: subject,
        text: `Your OTP Code is: ${otpCode}\nValid for 5 minutes. If you did not request this, ignore this email.`,
        html: body,
    };
    
    transporter.sendMail(mailOptions)
        .then(() => logger.info(`Verification email sent to ${email}`))
        .catch((error) => logger.error(`Failed to send email to ${email}: ${error.message}`));
}

export const sendResetPasswordEmail = (email, token) => {
    const resetLink = `${CLIENT_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    const subject = "HRMax Password Reset";
    const body = `
        <html>
        <body>
            <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
        </body>
        </html>
    `
    const mailOptions = {
        from: `"HRMax" <${EMAIL}>`,
        to: email,
        subject: subject,
        text: `Click the link to reset your password: ${resetLink}`,
        html: body,
    };
    
    transporter.sendMail(mailOptions)
        .then(() => logger.info(`Password reset email sent to ${email}`))
        .catch((error) => logger.error(`Failed to send email to ${email}: ${error.message}`));
}