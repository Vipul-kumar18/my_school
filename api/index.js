const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// Add School API


module.exports = (req, res) => {
    res.json({ message: 'Welcome to the School Management API!' });
  };
  