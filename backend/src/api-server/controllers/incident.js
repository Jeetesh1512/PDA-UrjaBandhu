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

        return res.status(201).json({ success: true, incident });
    } catch (error) {
        console.error("Error adding incident: ", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const updateIncidentStatus = async (req, res) => {
    try {
        const { incidentId } = req.params;
        const { resolution, status } = req.body;
        const linemanId = req.user.id;

        if (!resolution || !incidentId || !status || !linemanId) {
            return res.status(404).json({ error: "All fields are required" });
        }

        const validStatuses = ['REPORTED', 'IN_PROGRESS', 'RESOLVED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid incident status" });
        }


        const [updatedIncident, incidentUpdateDetails] = await prisma.$transaction([
            prisma.incident.update({
                where: { id: incidentId },
                data: { status },
            }),
            prisma.incidentUpdate.create({
                data: {
                    resolution,
                    linemanId,
                    incidentId,
                }
            })
        ]);

        return res.status(200).json({ success: true, incidentUpdateDetails });

    } catch (error) {
        console.error("Error changing incident status", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getActiveIncidents = async (req,res) => {
    try {
        const incidents = await prisma.incident.findMany({
            where:{
                status:{
                    not:"RESOLVED"
                }
            },
            select:{
                id:true,
                latitude:true,
                longitude:true,
                status:true,
                photoUrl:true,
                locality:true,
                updatedAt:true,
                description:true,
            }
        })

        if(!incidents){
            return res.status(404).json("Error finding incidents");
        }

        return res.status(200).json({success:true, incidents});
    } catch (error) {
        return res.status(500).json("Internal server error");
    }
}

module.exports = {
    addIncident,
    updateIncidentStatus,
    getActiveIncidents
}