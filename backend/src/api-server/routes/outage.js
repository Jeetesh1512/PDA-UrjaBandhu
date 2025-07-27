const express = require("express");
const router =  express.Router();
const {authMiddleware,roleMiddleware} = require("../middlewares/auth");
const {addOutage} = require("../controllers/outage");

router.post("/add-outage",authMiddleware,roleMiddleware("LINEMAN"),addOutage);

module.exports = router;