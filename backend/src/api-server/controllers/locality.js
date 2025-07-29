const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('../../../generated/prisma');
const prisma = new PrismaClient();

async function insertFeature(feature) {
    const location = feature.properties?.Office_Name || 'Unknown';
    const geometry = JSON.stringify(feature.geometry);

    try {
        await prisma.$executeRaw`
        INSERT INTO "Locality"(id, location, boundary)
        VALUES (gen_random_uuid(), ${location}, ST_SetSRID(ST_Multi(ST_GeomFromGeoJSON(${geometry})), 4326))
        ON CONFLICT (location) DO NOTHING`
    } catch (err) {
        console.error(`Failed to insert ${location}:`, err.message);
    }
}


const addLocalities = async (req, res) => {
    const filePath = path.join(__dirname, '..', 'utils', 'locations.geojson');

    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const geojson = JSON.parse(data);

        if (!geojson.features || !Array.isArray(geojson.features)) {
            return res.status(400).json({ error: 'Invalid GeoJSON format' });
        }

        for (const feature of geojson.features) {
            await insertFeature(feature);
        }

        res.status(200).json({ message: 'Locations inserted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to process GeoJSON file' });
    }
};

const findLocality = async (req, res) => {
    const { latitude, longitude } = req.body;

    try {
        const result = await prisma.$queryRaw`
      SELECT location FROM "Locality"
      WHERE ST_Contains(
        boundary,
        ST_SetSRID(ST_Point(${longitude}, ${latitude}), 4326)
      )
      LIMIT 1;
    `;

        if (result.length > 0) {
            res.status(200).json(`Location found: ${result[0].location}`);
        } else {
            res.status(400).json("No matching location found for the coordinates.");
        }
    } catch (error) {
        res.status(500).json({ error: "Error during location lookup:" });
    }
}

const getLocalitiesNameAndId = async (req, res) => {
    try {
        const localities = await prisma.locality.findMany({
            select: { id: true, location: true },
        });
        res.status(200).json({ localities });
    } catch (error) {
        return res.status(500).json("Internal Server Error");
    }
}

const getBoundary = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await prisma.$queryRawUnsafe(`
            SELECT ST_AsGeoJSON(boundary) as geojson
            FROM "Locality"
            WHERE id = '${id}'
        `);

        const geometry = JSON.parse(result[0].geojson);

        const geojson = {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    geometry,
                    properties: {}
                }
            ]
        };

        return res.status(200).json({ success: true, geojson });
    } catch (error) {
        return res.status(500).json("Internal Server Error");
    }
}

module.exports = {
    addLocalities,
    findLocality,
    getLocalitiesNameAndId,
    getBoundary,
};
