const { PrismaClient } = require("../../../generated/prisma");
const prisma = new PrismaClient();
const { sendOtpToEmail, verifyOtp } = require("../utils/otp");

const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 12);

const MAX_RETRIES = 5;

function maskEmail(email) {
    const [name, domain] = email.split("@");
    const visible = name.slice(0, 5);
    return `${visible}${"*".repeat(Math.max(0, name.length - 2))}@${domain}`;
}

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
                consumerName: consumerName,
                address: address,
                latitude: latitude,
                longitude: longitude,
                primaryEmail: primaryEmail,
                localityId: localityId,
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

const verifyHouse = async (req, res) => {
    const { consumerId } = req.params;
    const userId = req.user.id

    if (!consumerId || !userId) {
        return res.status(500).json("Cosumer Id and userId are required");
    }

    const house = await prisma.household.findUnique({
        where: {
            id: consumerId
        },
        select: {
            primaryEmail: true,
        }
    })

    if (!house) {
        return res.status(400).json({ error: "No such consumer" });
    }

    const masked = maskEmail(house.primaryEmail);

    await sendOtpToEmail(house.primaryEmail, userId);

    return res.status(200).json(`Otp sent to ${masked}`);
}

const verifyOtpForHouse = async (req, res) => {
    const { otp } = req.body;
    const { consumerId } = req.params;
    const userId = req.user.id;

    if (!otp || !consumerId || !userId) {
        return res.status(400).json({ error: "OTP, Consumer ID and user ID are required" });
    }

    const house = await prisma.household.findUnique({
        where: { id: consumerId },
        select: { primaryEmail: true }
    });

    if (!house) {
        return res.status(404).json({ error: "No such consumer" });
    }

    try {
        const result = await verifyOtp(house.primaryEmail, otp, userId);

        if (!result.success) {
            return res.status(400).json({ error: result.message });
        }

        var alreadyLinked=false;

        await prisma.$transaction(async (tx) => {
            const existing = await tx.basicUser.findUnique({
                where: {
                    id: userId,
                    householdId: consumerId
                }
            });

            if(existing){
                alreadyLinked=true;
            }

            if (!existing) {
                await tx.basicUser.create({
                    data: {
                        id: userId,
                        householdId: consumerId
                    }
                });
            }
        });

        return res.status(200).json({ success: alreadyLinked ? "User already linked" : result.message });
    } catch (error) {
        console.error("OTP verification failed:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


module.exports = {
    addHouse,
    verifyHouse,
    verifyOtpForHouse
}