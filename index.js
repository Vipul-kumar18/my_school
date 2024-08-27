const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(bodyParser.json());

// Route: Home
app.get('/', async (req, res) => {
    try {
        res.status(200).json({ message: 'Welcome to the School Management API!' });
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route: Add School
app.post('/addSchool', async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const newSchool = await prisma.school.create({
            data: {
                name,
                address,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
            },
        });

        res.json(newSchool);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route: List Schools
app.get('/listSchools', async (req, res) => {
    const { userLat, userLng } = req.query;

    if (!userLat || !userLng) {
        return res.status(400).json({ error: 'User latitude and longitude are required' });
    }

    try {
        const userLatitude = parseFloat(userLat);
        const userLongitude = parseFloat(userLng);

        const schools = await prisma.school.findMany();

        // Calculate distance and sort by proximity
        const sortedSchools = schools.map((school) => {
            const distance = Math.sqrt(
                Math.pow(school.latitude - userLatitude, 2) +
                Math.pow(school.longitude - userLongitude, 2)
            );
            return { ...school, distance };
        }).sort((a, b) => a.distance - b.distance);

        res.json(sortedSchools);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
