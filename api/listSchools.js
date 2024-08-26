const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();

app.get('/', async (req, res) => {
  const { userLat, userLng } = req.query;

  if (!userLat || !userLng) {
    return res.status(400).json({ error: 'User latitude and longitude are required' });
  }

  try {
    const userLatitude = parseFloat(userLat);
    const userLongitude = parseFloat(userLng);

    const schools = await prisma.school.findMany();

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

module.exports = app;
