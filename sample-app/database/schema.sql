-- Database: task_manager
CREATE DATABASE IF NOT EXISTS task_manager;
USE task_manager;

-- Table: tasks
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed Initial Data
INSERT INTO tasks (title, description, completed) VALUES
('Review AGENTS.md', 'Understand the safety rules and operating standards', TRUE),
('Run analyze-project.js', 'Inspect the sample-app structure and dependencies', FALSE),
('Test Bug Investigation Protocol', 'Simulate and fix a small bug using checklist 02', FALSE);

