const { authMiddleware, roleMiddleware } = require("../middlewares/auth");
const express = require("express");
const router = express.Router();
const {addHouse} = require("../controllers/household");

router.post("/addHouse",authMiddleware,roleMiddleware("ADMIN"),addHouse);

module.exports = router;
