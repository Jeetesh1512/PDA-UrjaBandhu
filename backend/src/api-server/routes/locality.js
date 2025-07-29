const { authMiddleware, roleMiddleware } = require("../middlewares/auth");
const express = require("express");
const router = express.Router();
const {addLocalities,findLocality,getLocalitiesNameAndId,getBoundary} = require("../controllers/locality");

router.get("/findLocality",authMiddleware,findLocality);
router.get("/boundary/:id",authMiddleware,getBoundary);
router.get("/basic-features",authMiddleware,getLocalitiesNameAndId);
router.post("/addLocalities",authMiddleware,roleMiddleware("ADMIN"),addLocalities);

module.exports = router;