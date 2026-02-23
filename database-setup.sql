-- FitForge Database Setup Script
-- Run this in MySQL to reset the database

-- Drop existing database and recreate
DROP DATABASE IF EXISTS fitforge;
CREATE DATABASE fitforge;
USE fitforge;

-- Create users table with correct schema
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    full_name VARCHAR(255),
    age INT,
    weight DOUBLE,
    height DOUBLE,
    fitness_goal VARCHAR(100)
);

--  workout table
CREATE TABLE workout (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type_of_workout VARCHAR(255),
    duration INT,
    calories_burned INT,
    date DATE,
    user_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

--  demo user (password is 'demo123' encrypted with BCrypt)
INSERT INTO users (email, password, role, full_name, age, weight, height, fitness_goal) 
VALUES (
    'demo@fitforge.com',
    '$2a$10$rN8qJ5K5vXxXxXxXxXxXxeN8qJ5K5vXxXxXxXxXxXxXxXxXxXxXxXx',
    'ROLE_USER',
    'Demo User',
    25,
    70.0,
    175.0,
    'general_fitness'
);

-- Grant privileges
GRANT ALL PRIVILEGES ON fitforge.* TO 'fituser'@'localhost';
FLUSH PRIVILEGES;

SELECT 'Database setup complete!' AS Status;
SELECT 'Login with: demo@fitforge.com / demo123' AS Credentials;
