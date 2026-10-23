/**
 * dev.js
 * 
 * Zero-dependency helper script to run both Express backend and Vite React frontend
 * simultaneously in a single terminal session.
 */

import { spawn } from 'child_process';
import path from 'path';

console.log('='.repeat(60));
console.log('🚀 Starting Full-Stack Development Environment...');
console.log('='.repeat(60));

// Spawn Express Backend
const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

const backend = spawn(npmCmd, ['run', 'dev:server'], {
  stdio: 'pipe',
  shell: true
});

backend.stdout.on('data', (data) => {
  process.stdout.write(`\x1b[36m[Backend]\x1b[0m ${data}`);
});

backend.stderr.on('data', (data) => {
  process.stderr.write(`\x1b[31m[Backend Error]\x1b[0m ${data}`);
});

// Spawn Vite React Frontend
const frontend = spawn(npmCmd, ['run', 'dev:client'], {
  stdio: 'pipe',
  shell: true
});

frontend.stdout.on('data', (data) => {
  process.stdout.write(`\x1b[32m[Frontend]\x1b[0m ${data}`);
});

frontend.stderr.on('data', (data) => {
  process.stderr.write(`\x1b[31m[Frontend Error]\x1b[0m ${data}`);
});

// Clean shutdown on Ctrl+C (SIGINT)
function shutdown() {
  console.log('\n🛑 Shutting down backend and frontend...');
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

