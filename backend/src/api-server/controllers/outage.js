const { PrismaClient } = require("../../../generated/prisma");
const prisma = new PrismaClient();

const addOutage = async (req, res) => {
    try {
        const { location, localityId, reason, startTime, endTime } = req.body;
        const userId = req.user?.id;

        if (!location || !localityId || !reason || !startTime || !endTime || !userId) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const isAdmin = await prisma.admin.findUnique({ where: { id: userId } });

        let reporterType, linemanId = null, adminId = null;

        if (isAdmin) {
            reporterType = "ADMIN";
            adminId = userId;
        } else {
            // Check if Lineman
            const isLineman = await prisma.lineman.findUnique({ where: { id: userId } });
            if (isLineman) {
                reporterType = "LINEMAN";
                linemanId = userId;
            } else {
                return res.status(403).json({ error: "User is neither admin nor lineman" });
            }
        }

        const outage = await prisma.outage.create({
            data: {
                location,
                reason,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                localityId,
                reporterType,
                adminId,
                linemanId,
            },
        });

        return res.status(201).json({ success: true, outage });

    } catch (error) {
        console.error("Unable to create outage", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    addOutage,
}