const { sendOtpToEmail, verifyOtp } = require("../utils/otp");
const express = require("express");
const router = express.Router();

router.post("/send-otp", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    await sendOtpToEmail(email);
    res.status(200).json({ success: "OTP sent" });
})


router.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    const result = await verifyOtp(email, otp);

    if (result.success) {
        res.status(200).json({
            success: "Verified"
        });
    }
    else {
        res.status(400).json({
            error: result.message
        });
    }
})

module.exports = router;