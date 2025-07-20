const { PrismaClient } = require("../../../generated/prisma");
const prisma = new PrismaClient();
const { sendNotificationEmail } = require("./mailer");

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const sendOtpToEmail = async (email, userId) => {
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otp.create({
        data: {
            userId,
            email,
            code: otp,
            expiresAt,
        }
    });

    const subject = `OTP for verification of the entered consumer id`;
    const text = `Your OTP is ${otp}. It is valid for 10 minutes.`;

    await sendNotificationEmail(
        email,
        subject,
        text
    )
}

const verifyOtp = async (email, enteredOtp) => {
    const record = await prisma.otp.findFirst({
        where: { email },
        orderBy: { createdAt: "desc" },
    });

    if (!record) {
        return {
            success: false,
            message: "OTP not found",
        }
    }
    if (record.code !== enteredOtp) {
        return {
            success: false,
            message: "Invalid OTP",
        }
    }
    if (new Date() > record.expiresAt) {
        return {
            success: false,
            message: "OTP expired",
        };
    }

    await prisma.otp.update({
        where: { id: record.id },
        data: { verified: true },
    });

    await prisma.otp.deleteMany({
        where: {
            OR: [
                { verified: true },
                { expiresAt: { lt: new Date() } }
            ]
        }
    });

    return {
        success: true,
        message: "OTP verified"
    };
}

module.exports = {
    sendOtpToEmail,
    verifyOtp,
}