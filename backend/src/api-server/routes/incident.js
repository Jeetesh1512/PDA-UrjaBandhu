const express = require("express");
const router  = express.Router();
const {authMiddleware,roleMiddleware} = require("../middlewares/auth");
const {addIncident} = require("../controllers/incident")

router.post("/add-incident",addIncident);


module.exports = router;