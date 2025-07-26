const { authMiddleware, roleMiddleware } = require("../middlewares/auth");
const express = require("express");
const router = express.Router();
const {addLocalities,findLocality} = require("../controllers/locality");

router.get("/findLocality",authMiddleware,findLocality);
router.post("/addLocalities",authMiddleware,roleMiddleware("ADMIN"),addLocalities);

module.exports = router;