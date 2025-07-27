const { PrismaClient } = require("../../../generated/prisma");
const prisma = new PrismaClient();

const addOutage = async (req, res) => {
    try {
        const { location, localityId, reason, startTime, endTime } = req.body;
        const linemanId = req.user.id;

        if (!location || !localityId || !reason || !startTime || !endTime || !linemanId) {
            return res.status(404).json({ error: "All fields are required" });
        }

        const outage = await prisma.outage.create({
            data: {
                location,
                reason,
                startTime,
                endTime,
                localityId,
                linemanId,
            }
        });

        if (!outage) {
            return res.status(404).json({ error: "Unable to create outage" });
        }

        return res.status(201).json({success:true,outage})
    } catch (error) {
        console.error("unable to create error", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    addOutage,
}