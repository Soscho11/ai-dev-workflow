import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/server.js';
import { closePool } from '../src/config/db.js';

let server;
let baseUrl;

test.before(async () => {
  process.env.NODE_ENV = 'test';
  await new Promise((resolve) => {
    // Port 0 tells the OS to assign an available ephemeral port
    server = app.listen(0, () => {
      baseUrl = `http://localhost:${server.address().port}`;
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await closePool();
});

test('GET /api/health should return 200 and healthy status', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);

  const data = await res.json();
  assert.equal(data.status, 'healthy');
  assert.equal(data.dbConnected, true);
});

test('GET /api/tasks should return list of tasks', async () => {
  const res = await fetch(`${baseUrl}/api/tasks`);
  assert.equal(res.status, 200);

  const tasks = await res.json();
  assert.ok(Array.isArray(tasks));
  assert.ok(tasks.length >= 1);
});

test('POST /api/tasks should validate missing title', async () => {
  const res = await fetch(`${baseUrl}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description: 'No title given' })
  });

  assert.equal(res.status, 400);
  const data = await res.json();
  assert.match(data.message, /Title is required/);
});

test('POST /api/tasks should create a task with valid input', async () => {
  const payload = {
    title: 'Automated Test Task',
    description: 'Created during test run'
  };

  const res = await fetch(`${baseUrl}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  assert.equal(res.status, 201);
  const task = await res.json();
  assert.equal(task.title, payload.title);
  assert.ok(task.id);
});

test('PUT /api/tasks/:id should update completion status', async () => {
  const res = await fetch(`${baseUrl}/api/tasks/1`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: true })
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.completed, 1);
});

