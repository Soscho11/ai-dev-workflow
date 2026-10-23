import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool = null;
let isMock = false;

// In-memory fallback store if MySQL service is not running locally
let memoryTasks = [
  { id: 1, title: 'Review AGENTS.md', description: 'Understand safety rules and operating standards', completed: 1, created_at: new Date() },
  { id: 2, title: 'Run analyze-project.js', description: 'Inspect the sample-app structure and dependencies', completed: 0, created_at: new Date() },
  { id: 3, title: 'Test Bug Investigation Protocol', description: 'Simulate and fix a small bug using checklist 02', completed: 0, created_at: new Date() }
];
let nextId = 4;

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'task_manager',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
} catch (err) {
  isMock = true;
}

/**
 * Execute a query with parameterized values
 * Always uses parameterized queries (?, ?) to prevent SQL injection.
 */
export async function dbQuery(sql, params = []) {
  if (!isMock && pool) {
    try {
      const [rows] = await pool.execute(sql, params);
      return rows;
    } catch (err) {
      // If database connection fails (e.g. MySQL server not started locally)
      if (
        err.code === 'ECONNREFUSED' || 
        err.code === 'ER_BAD_DB_ERROR' || 
        err.code === 'ENOTFOUND' || 
        err.code === 'ER_ACCESS_DENIED_ERROR'
      ) {
        console.warn(`[DB Notice] MySQL not accessible (${err.code}). Using in-memory fallback store.`);
        isMock = true;
        // Proceed with fallback for the current call
      } else {
        throw err;
      }
    }
  }

  // --- In-Memory Mock Fallback ---
  const upper = sql.trim().toUpperCase();

  if (upper.startsWith('SELECT 1')) {
    return [{ 1: 1 }];
  }

  if (upper.startsWith('SELECT')) {
    if (params.length === 1 && upper.includes('WHERE ID =')) {
      const id = Number(params[0]);
      return memoryTasks.filter(t => t.id === id);
    }
    return [...memoryTasks];
  }

  if (upper.startsWith('INSERT')) {
    const newTask = {
      id: nextId++,
      title: params[0],
      description: params[1] || '',
      completed: 0,
      created_at: new Date()
    };
    memoryTasks.push(newTask);
    return { insertId: newTask.id, affectedRows: 1 };
  }

  if (upper.startsWith('UPDATE')) {
    const id = Number(params[params.length - 1]);
    const task = memoryTasks.find(t => t.id === id);
    if (task) {
      if (upper.includes('COMPLETED = ?') && upper.includes('TITLE = ?')) {
        task.title = params[0];
        task.completed = params[1] ? 1 : 0;
      } else if (upper.includes('COMPLETED = ?')) {
        task.completed = params[0] ? 1 : 0;
      }
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  if (upper.startsWith('DELETE')) {
    const id = Number(params[0]);
    const initialLen = memoryTasks.length;
    memoryTasks = memoryTasks.filter(t => t.id !== id);
    return { affectedRows: initialLen - memoryTasks.length };
  }

  return [];
}

export function isUsingMock() {
  return isMock;
}

export async function closePool() {
  if (pool) {
    try {
      await pool.end();
    } catch (_) {}
    pool = null;
  }
}

