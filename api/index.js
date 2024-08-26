const { PrismaClient } = require('@prisma/client');


module.exports = async (req, res) => {
    try {
        res.status(200).json({ message: 'Welcome to the School Management API!' });
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
