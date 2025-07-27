const express = require("express");
const router  = express.Router();
const {authMiddleware,roleMiddleware} = require("../middlewares/auth");
const {addIncident,updateIncidentStatus} = require("../controllers/incident")
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/add-incident",authMiddleware,roleMiddleware("BASIC_USER"),upload.single('photo'),addIncident);
router.post("/update-incident/:incidentId",authMiddleware,roleMiddleware("LINEMAN"),updateIncidentStatus);

module.exports = router;