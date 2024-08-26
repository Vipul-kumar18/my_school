const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
app.use(express.json());

// Add School API
app.post('/api/addSchool', async (req, res) => {
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

// List Schools API
app.get('/api/listSchools', async (req, res) => {
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

// Export the app as a serverless function
module.exports = (req, res) => {
  return app(req, res);
};
