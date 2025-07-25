const express = require("express");
const router = express.Router();
const { PrismaClient } = require("../../../generated/prisma");
const prisma = new PrismaClient();
const { supabase } = require("../utils/supabase-server");

router.post("/signup", async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    const { data: userInfo, error } = await supabase.auth.getUser(token);
    const name = userInfo.user?.user_metadata?.name;

    if (error) {
        return res.status(401).json({ error: "User not authorized" });
    }

    try {
        await prisma.user.create({
            data: {
                id:userInfo.user?.id,
                email: userInfo.user?.email,
                name: name,
            }
        });
        return res.status(201).json({success:true});
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;

