const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'welcome_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to database with threadId:', connection.threadId);
        connection.release();
        return true;
    } catch (err) {
        console.error('Database connection failed:', err);
        return false;
    }
}

module.exports = {
    pool,
    testConnection
};