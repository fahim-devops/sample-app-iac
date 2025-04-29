const express = require('express');
const router = express.Router();
const db = require('../db');

// Welcome message endpoint
router.get('/welcome', async (req, res) => {
    try {
        const [user] = await db.query(
            'SELECT * FROM users WHERE name LIKE "%Waheed Ahmed%" LIMIT 1'
        );
        
        if (user.length > 0) {
            const welcomeMessages = [
                `Hail and well met, ${user[0].name}, ${user[0].title}!`,
                `All rise for the honorable ${user[0].name}!`,
                `The realm rejoices at your presence, ${user[0].title} ${user[0].name.split(' ')[0]}!`,
                `By the stars! ${user[0].name} graces us with their magnificence!`
            ];
            
            const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
            
            res.json({
                status: 'success',
                message: randomMessage,
                user: user[0]
            });
        } else {
            res.status(404).json({ status: 'error', message: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Database error' });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const [users] = await db.query('SELECT * FROM users');
        res.json({ status: 'success', data: users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Database error' });
    }
});

// Add new user
router.post('/users', async (req, res) => {
    try {
        const { name, title } = req.body;
        if (!name || !title) {
            return res.status(400).json({ status: 'error', message: 'Name and title are required' });
        }
        
        const [result] = await db.query(
            'INSERT INTO users (name, title) VALUES (?, ?)',
            [name, title]
        );
        
        res.json({
            status: 'success',
            message: 'User added successfully',
            userId: result.insertId
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Database error' });
    }
});

module.exports = router;