const { supabase } = require("../../auth-server/utils/supabase-server");
const { sendOtpToEmail, verifyOtp } = require("../utils/otp");
const express = require("express");
const router = express.Router();

router.post("/send-otp", async (req, res) => {
    const { email } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const { data: userInfo, error } = await supabase.auth.getUser(token);

    if (error) {
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }

    console.log(userInfo.user.id);

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    await sendOtpToEmail(email, userInfo.user.id);
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