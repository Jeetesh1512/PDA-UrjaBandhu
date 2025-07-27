const { authMiddleware, roleMiddleware } = require("../middlewares/auth");
const express = require("express");
const router = express.Router();
const { addHouse, verifyHouse, verifyOtpForHouse } = require("../controllers/household");

router.post("/send-house-verification-otp/:consumerId", authMiddleware, verifyHouse);
router.post("/verifyOtpForHouse/:consumerId", authMiddleware, verifyOtpForHouse);
router.post("/addHouse", authMiddleware, roleMiddleware("ADMIN"), addHouse);

module.exports = router;
