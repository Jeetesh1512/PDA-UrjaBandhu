const { supabase } = require("../../auth-server/utils/supabase-server")
const { PrismaClient } = require("../../../generated/prisma");
const prisma = new PrismaClient();

async function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
        return res.status(401).json({ error: "You are Unauthorized" });
    }

    const dbUser = await prisma.user.findUnique({
        where: { id: data.user.id },
    });

    if (!dbUser) {
        return res.status(404).json({ error: "User not found in DB" });
    }

    req.user = dbUser;

    next();
}

function roleMiddleware(...allowedRoles) {
    return async (req, res, next) => {
        const { user } = req;

        try {
            const dbUser = await prisma.user.findUnique({
                where: {
                    id: user.id,
                },
                select: {
                    role: true,
                }
            });

            if (!dbUser) {
                return res.status(404).json({
                    error: "User not found"
                });
            }

            if (!allowedRoles.includes(dbUser.role)) {
                return res.status(403).json({ error: "Access Denied. Not enough Priviledges" });
            }
            
            next();
        } catch (error) {
            return res.status(500).json({
                error: "Internal Server Error"
            });
        }
    }
}

module.exports = {
    authMiddleware,
    roleMiddleware
}