const express = require('express');
const cors = require('cors');
const db = require('./db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database with threadId: ' + db.threadId);
});

// Routes
app.use('/api', apiRoutes);

// Welcome route
app.get('/', (req, res) => {
    res.send(`
        <h1>Welcome to the Grand Entrance of Waheed Ahmed</h1>
        <p>Behold the majestic API that powers this glorious display</p>
        <p>Endpoints:</p>
        <ul>
            <li><a href="/api/welcome">/api/welcome</a> - Get welcome message</li>
            <li><a href="/api/users">/api/users</a> - Get all users</li>
        </ul>
    `);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to witness the splendor`);
});