const multer = require('multer');
const  {uploadToCloudinary} = require("../utils/cloudinary");
const {PrismaClient} = require("../../../generated/prisma");
const prisma = new PrismaClient();
const storage = multer.memoryStorage();
const upload = multer({storage});

const addIncident = async (req,res) => {
    
}

module.exports = {
    addIncident,
}