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
        const newUser = await prisma.user.create({
            data: {
                id: userInfo.user?.id,
                email: userInfo.user?.email,
                name: name,
            }
        });

        if (!user) {
            return res.status(404).json({ error: "Couldn't create user" });
        }
        return res.status(201).json({ success: true, newUser });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error || !data?.session) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    return res.status(200).json({
        message: "Login successful",
        token: data.session.access_token,
        user: data.user,
    });
});

router.get("/me", async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (!user || error) {
        return res.status(404).json({ error: "Invalid Token" });
    }

    const userId = user?.id;

    const dbUser = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            basicUser:true,
            admin:true,
            lineman:true,
        },
    });

    if (!dbUser) return res.status(404).json({ error: 'User not found' });

    return res.status(200).json({ user: dbUser });
})


module.exports = router;

