const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Welcome message endpoint
router.get('/welcome', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE name LIKE "%Waheed Ahmed%" LIMIT 1'
        );
        
        if (rows.length > 0) {
            const user = rows[0];
            const welcomeMessages = [
                `Hail and well met, ${user.name}, ${user.title}!`,
                `All rise for the honorable ${user.name}!`,
                `The realm rejoices at your presence, ${user.title} ${user.name.split(' ')[0]}!`,
                `By the stars! ${user.name} graces us with their magnificence!`
            ];
            
            const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
            
            res.json({
                status: 'success',
                message: randomMessage,
                user: user
            });
        } else {
            res.status(404).json({ 
                status: 'error', 
                message: 'User not found' 
            });
        }
    } catch (err) {
        console.error('Error in /welcome endpoint:', err);
        res.status(500).json({ 
            status: 'error', 
            message: 'Database error',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
        res.json({ 
            status: 'success', 
            data: rows,
            count: rows.length
        });
    } catch (err) {
        console.error('Error in /users endpoint:', err);
        res.status(500).json({ 
            status: 'error', 
            message: 'Failed to fetch users',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Add new user
router.post('/users', async (req, res) => {
    try {
        const { name, title } = req.body;
        
        if (!name || !title) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Name and title are required',
                fields: { name: !name ? 'required' : 'valid', title: !title ? 'required' : 'valid' }
            });
        }
        
        const [result] = await pool.query(
            'INSERT INTO users (name, title) VALUES (?, ?)',
            [name, title]
        );
        
        // Fetch the newly created user
        const [newUserRows] = await pool.query(
            'SELECT * FROM users WHERE id = ?',
            [result.insertId]
        );
        
        res.status(201).json({
            status: 'success',
            message: 'User added successfully',
            data: newUserRows[0]
        });
    } catch (err) {
        console.error('Error in POST /users endpoint:', err);
        res.status(500).json({ 
            status: 'error', 
            message: 'Failed to add user',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Get single user by ID
router.get('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE id = ?',
            [userId]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ 
                status: 'error', 
                message: 'User not found' 
            });
        }
        
        res.json({ 
            status: 'success', 
            data: rows[0] 
        });
    } catch (err) {
        console.error('Error in GET /users/:id endpoint:', err);
        res.status(500).json({ 
            status: 'error', 
            message: 'Failed to fetch user',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Update user
router.put('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, title } = req.body;
        
        if (!name || !title) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Name and title are required' 
            });
        }
        
        const [result] = await pool.query(
            'UPDATE users SET name = ?, title = ? WHERE id = ?',
            [name, title, userId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                status: 'error', 
                message: 'User not found' 
            });
        }
        
        // Fetch the updated user
        const [updatedUserRows] = await pool.query(
            'SELECT * FROM users WHERE id = ?',
            [userId]
        );
        
        res.json({
            status: 'success',
            message: 'User updated successfully',
            data: updatedUserRows[0]
        });
    } catch (err) {
        console.error('Error in PUT /users/:id endpoint:', err);
        res.status(500).json({ 
            status: 'error', 
            message: 'Failed to update user',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        
        // First fetch the user to return in response
        const [userRows] = await pool.query(
            'SELECT * FROM users WHERE id = ?',
            [userId]
        );
        
        if (userRows.length === 0) {
            return res.status(404).json({ 
                status: 'error', 
                message: 'User not found' 
            });
        }
        
        // Then delete the user
        await pool.query(
            'DELETE FROM users WHERE id = ?',
            [userId]
        );
        
        res.json({
            status: 'success',
            message: 'User deleted successfully',
            data: userRows[0]
        });
    } catch (err) {
        console.error('Error in DELETE /users/:id endpoint:', err);
        res.status(500).json({ 
            status: 'error', 
            message: 'Failed to delete user',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

module.exports = router;