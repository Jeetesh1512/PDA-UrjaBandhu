const { uploadToCloudinary } = require("../utils/uploadToCloudinary");
const { PrismaClient } = require("../../../generated/prisma");
const prisma = new PrismaClient();

const addIncident = async (req, res) => {

    try {
        const { latitude, longitude, description, localityId } = req.body;
        const reporterId = req.user.id;

        if (!latitude || !longitude || !description || !localityId) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const file = req.file;
        if (!file) {
            return res.status(400).json("Image is required");
        }

        const uploadRes = await uploadToCloudinary(file.buffer);

        const incident = await prisma.incident.create({
            data: {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                description,
                localityId,
                reporterId,
                photoUrl: uploadRes.secure_url,
            }
        });

        return res.status(201).json({success:true,incident});
    } catch (error) {
        console.error("Error adding incident: ", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    addIncident,
}