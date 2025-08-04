const express = require("express");
const router  = express.Router();
const {authMiddleware,roleMiddleware} = require("../middlewares/auth");
const {addIncident,updateIncidentStatus, getActiveIncidents, getIncidentRecords} = require("../controllers/incident")
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/active",authMiddleware,getActiveIncidents);
router.get("/records",authMiddleware,getIncidentRecords);
router.post("/add-incident",authMiddleware,roleMiddleware("BASIC_USER"),upload.single('photo'),addIncident);
router.post("/update-incident/:incidentId",authMiddleware,roleMiddleware("LINEMAN"),updateIncidentStatus);

module.exports = router;