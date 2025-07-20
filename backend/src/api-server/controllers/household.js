const { PrismaClient } = require("../../../generated/prisma");
const prisma = new PrismaClient();

const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 12);

const MAX_RETRIES = 5;

const addHouse = async (req, res) => {
    const { address, latitude, longitude, consumerName, primaryEmail, localityId } = req.body;

    console.log(req.body);

    let uniqueId = null;

    for (let i = 0; i < MAX_RETRIES; i++) {
        const generateId = `CC-${nanoid()}`;

        try {
            const exists = await prisma.household.findFirst({
                where: {
                    id: generateId
                }
            });

            if (!exists) {
                uniqueId = generateId;
                break;
            }
        } catch (error) {
            res.json(400).json({ error: "Couldn't generate unique id, trying again" });
        }
    }

    if (!uniqueId) {
        return res.status(500).json({
            error: "Failed to generate a unique household id"
        });
    }

    console.log(uniqueId);

    try {
        const locality = await prisma.locality.findUnique({
            where: {
                id: localityId
            }
        })

        if (!locality) {
            return res.status(400).json({ error: "Locality doesn't exist" });
        }

        console.log(locality);

        const household = await prisma.household.create({
            data: {
                id: uniqueId,
                consumerName:consumerName,
                address:address,
                latitude:latitude,
                longitude:longitude,
                primaryEmail:primaryEmail,
                localityId:localityId,
                meter: {
                    create: {
                        powerStatus: false,
                        currentReading: BigInt(0),
                        lastReading: BigInt(0),
                    },
                },
            },
        });

        console.log(household);

        return res.status(200).json({ success: "Created household connection" });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    addHouse,
}