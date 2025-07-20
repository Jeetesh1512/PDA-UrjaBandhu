const { authMiddleware, roleMiddleware } = require("../middlewares/auth");
const express = require("express");
const router = express.Router();
const {addLocality} = require("../controllers/locality");

router.post("/addLocality",authMiddleware,roleMiddleware("ADMIN"),addLocality);

module.exports = router;