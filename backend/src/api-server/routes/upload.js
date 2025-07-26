const express = require("express");
const multer = require('multer');
const {uploadToCloudinary} = require("../utils/uploadToCloudinary");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage});

router.post('/upload',upload.single('photo'),async(req,res)=>{
    try {
        const result = await uploadToCloudinary(req.file.buffer);
        res.status(200).json({
            url: result.secure_url
        });        
    } catch (error) {
        console.error('Upload error: ',error);
        res.status(500).json({error: 'Upload Failed'});
    }
})

module.exports = router;
