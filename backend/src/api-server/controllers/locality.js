const { PrismaClient } = require("../../../generated/prisma");
const { supabase } = require("../../auth-server/utils/supabase-server");
const prisma = new PrismaClient();

const addLocality = async (req, res) => {
    const { location } = req.body;

    try {
        const existingLocality = await prisma.locality.findUnique({
            where: { location }
        });

        if (existingLocality) {
            return res.status(400).json({ error: "Location already exists" });
        }

        const locality = await prisma.locality.create({
            data: { location }
        });

        return res.status(201).json({ success: "Added Locality Successfully", locality });



    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

module.exports = {
    addLocality
}