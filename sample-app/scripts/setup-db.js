/**
 * setup-db.js
 * 
 * Automatically initializes the MySQL database and creates tables.
 * Usage: node scripts/setup-db.js [mysql-password]
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');

dotenv.config({ path: envPath });

const host = process.env.DB_HOST || 'localhost';
const port = Number(process.env.DB_PORT) || 3306;
const user = process.env.DB_USER || 'root';
const password = process.argv[2] !== undefined ? process.argv[2] : (process.env.DB_PASSWORD || '');
const database = process.env.DB_NAME || 'task_manager';

console.log('='.repeat(60));
console.log(`🔌 Initializing MySQL Database: ${database} on ${host}:${port}`);
console.log('='.repeat(60));

async function setup() {
  let connection;
  try {
    // 1. Connect to MySQL server (without selecting database yet)
    connection = await mysql.createConnection({ host, port, user, password });
    console.log('✓ Successfully connected to MySQL server.');

    // 2. Create Database
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    console.log(`✓ Database \`${database}\` verified/created.`);

    await connection.query(`USE \`${database}\`;`);

    // 3. Create Table
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;
    await connection.query(createTableSql);
    console.log('✓ Table `tasks` verified/created.');

    // 4. Seed initial tasks if table is empty
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM tasks');
    if (rows[0].count === 0) {
      await connection.query(`
        INSERT INTO tasks (title, description, completed) VALUES
        ('Review AGENTS.md', 'Understand the safety rules and operating standards', TRUE),
        ('Run analyze-project.js', 'Inspect the sample-app structure and dependencies', FALSE),
        ('Test Bug Investigation Protocol', 'Simulate and fix a small bug using checklist 02', FALSE);
      `);
      console.log('✓ Seeded initial tasks into database.');
    }

    // 5. Update or write .env file with the working password
    const envContent = [
      `# Server Configuration`,
      `PORT=5000`,
      `NODE_ENV=development`,
      ``,
      `# Database Configuration (MySQL)`,
      `DB_HOST=${host}`,
      `DB_PORT=${port}`,
      `DB_USER=${user}`,
      `DB_PASSWORD=${password}`,
      `DB_NAME=${database}`,
      ``,
      `# Client CORS Origin`,
      `CLIENT_ORIGIN=http://localhost:5173`,
      ``
    ].join('\n');

    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('✓ Updated sample-app/.env with working credentials.');

    console.log('='.repeat(60));
    console.log('🎉 Setup complete! The app will now use your live MySQL database.');
    console.log('='.repeat(60));
    process.exit(0);
  } catch (err) {
    console.error('\n❌ MySQL Setup Failed:', err.message);
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('👉 The password provided for user "root" was incorrect.');
    }
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

setup();

