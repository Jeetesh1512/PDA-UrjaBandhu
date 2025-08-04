const { uploadToCloudinary } = require("../utils/uploadToCloudinary");
const { categorizeAndPrioritizeIncident } = require("../utils/prioritizeIncidents")
const { PrismaClient } = require("../../../generated/prisma");
const prisma = new PrismaClient();

const addIncident = async (req, res) => {

    try {
        const { latitude, longitude, description, localityId, location } = req.body;
        const reporterId = req.user.id;

        if (!latitude || !longitude || !description || !localityId || !location) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const file = req.file;
        if (!file) {
            return res.status(400).json("Image is required");
        }

        const { category, priority } = await categorizeAndPrioritizeIncident(description);

        const uploadRes = await uploadToCloudinary(file.buffer);

        const incident = await prisma.incident.create({
            data: {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                description,
                localityId,
                category,
                priority,
                location,
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

const getActiveIncidents = async (req, res) => {
    try {
        const [liveIncidents, countsByPriorityRaw, countsByStatusRaw] = await Promise.all([
            prisma.incident.findMany({
                where: { status: { not: 'RESOLVED' } },
                orderBy: { updatedAt: 'desc' },
                select: {
                    id: true,
                    description: true,
                    location: true,
                    latitude: true,
                    longitude: true,
                    category: true,
                    priority: true,
                    status: true,
                    updatedAt: true,
                    photoUrl: true,
                    locality: {
                        select: {
                            id: true,
                            location: true
                        }
                    },
                }
            }),
            prisma.incident.groupBy({
                by: ['priority'],
                where: { status: { not: 'RESOLVED' } },
                _count: true
            }),
            prisma.incident.groupBy({
                by: ['status'],
                where: { status: { not: 'RESOLVED' } },
                _count: true
            })
        ]);

        const countsByPriority = Object.fromEntries(
            countsByPriorityRaw.map(({ priority, _count }) => [priority, _count])
        );

        const countsByStatus = Object.fromEntries(
            countsByStatusRaw.map(({ status, _count }) => [status, _count])
        );

        res.status(200).json({
            success: true,
            liveIncidents,
            counts: {
                byPriority: countsByPriority,
                byStatus: countsByStatus,
                total: liveIncidents.length
            }
        });
    } catch (error) {
        console.error("Error fetching active incidents:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


const getIncidentRecords = async (req, res) => {
    try {
        const [totalCount, priorityCounts] = await prisma.$transaction([
            prisma.incident.count(),
            prisma.incident.groupBy({
                by: ['priority'],
                _count: {
                    priority: true
                }
            })
        ]);

        const formattedCounts = {};
        priorityCounts.forEach((item) => {
            formattedCounts[item.priority] = item._count.priority;
        });

        return res.json({
            totalIncidents: totalCount,
            priorityBreakdown: formattedCounts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch incident records' });
    }
};

module.exports = {
    addIncident,
    updateIncidentStatus,
    getActiveIncidents,
    getIncidentRecords,
}