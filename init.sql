-- Create database
CREATE DATABASE IF NOT EXISTS welcome_db;
USE welcome_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial data
INSERT INTO users (name, title) VALUES 
('Waheed Ahmed', 'Distinguished Visitor'),
('John Doe', 'Esteemed Guest'),
('Jane Smith', 'Honored Colleague');