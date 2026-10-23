/**
 * analyze-project.js
 * 
 * Zero-dependency Node.js script to quickly inspect and map any project structure.
 * Usage: node scripts/analyze-project.js [optional-target-path]
 */

const fs = require('fs');
const path = require('path');

const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();

console.log('='.repeat(60));
console.log(`🔍 Project Architecture Inspection: ${targetDir}`);
console.log('='.repeat(60));

// 1. Check package.json
const pkgPath = path.join(targetDir, 'package.json');
if (fs.existsSync(pkgPath)) {
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    console.log('\n📦 Package Info:');
    console.log(`  - Name:        ${pkg.name || '(unnamed)'}`);
    console.log(`  - Version:     ${pkg.version || '0.0.0'}`);
    console.log(`  - Module Type: ${pkg.type || 'CommonJS'}`);
    console.log(`  - Main Entry:  ${pkg.main || '(not specified)'}`);

    if (pkg.scripts && Object.keys(pkg.scripts).length > 0) {
      console.log('\n⚙️ Available Scripts:');
      for (const [cmd, script] of Object.entries(pkg.scripts)) {
        console.log(`  - npm run ${cmd.padEnd(12)} -> ${script}`);
      }
    }

    const deps = Object.keys(pkg.dependencies || {});
    const devDeps = Object.keys(pkg.devDependencies || {});
    console.log(`\n📚 Dependencies (${deps.length}):`);
    console.log(`  ${deps.length > 0 ? deps.join(', ') : 'None'}`);
    console.log(`\n🛠️ DevDependencies (${devDeps.length}):`);
    console.log(`  ${devDeps.length > 0 ? devDeps.join(', ') : 'None'}`);

    // Stack detection
    console.log('\n💡 Detected Tech Stack:');
    if (deps.includes('react') || devDeps.includes('react')) console.log('  [✓] React Frontend');
    if (deps.includes('express')) console.log('  [✓] Express.js Backend');
    if (deps.includes('mysql') || deps.includes('mysql2')) console.log('  [✓] MySQL Database Driver');
    if (deps.includes('jsonwebtoken')) console.log('  [✓] JWT Authentication');
    if (deps.includes('sequelize') || deps.includes('prisma')) console.log('  [✓] ORM Layer Detected');
    if (devDeps.includes('jest') || devDeps.includes('vitest') || devDeps.includes('mocha')) console.log('  [✓] Automated Test Framework');

  } catch (err) {
    console.error('❌ Failed to parse package.json:', err.message);
  }
} else {
  console.log('\nℹ️ No package.json found in the target directory.');
}

// 2. Environment Check
console.log('\n🔐 Environment & Configuration:');
const envExampleExists = fs.existsSync(path.join(targetDir, '.env.example'));
const envExists = fs.existsSync(path.join(targetDir, '.env'));
const gitignoreExists = fs.existsSync(path.join(targetDir, '.gitignore'));

console.log(`  - .env.example:  ${envExampleExists ? '✓ Present' : '⚠️ Missing (Recommended)'}`);
console.log(`  - .env:          ${envExists ? '✓ Present locally' : 'ℹ️ Not present'}`);
console.log(`  - .gitignore:    ${gitignoreExists ? '✓ Present' : '⚠️ Missing (High Risk!)'}`);

if (gitignoreExists && envExists) {
  const gitignoreContent = fs.readFileSync(path.join(targetDir, '.gitignore'), 'utf8');
  const isEnvIgnored = gitignoreContent.includes('.env');
  console.log(`  - .env in .gitignore: ${isEnvIgnored ? '✓ Protected' : '🚨 CRITICAL WARNING: .env is NOT ignored!'}`);
}

// 3. Scan File Directory Tree (Excluding heavy directories)
console.log('\n📁 Directory Map:');
const IGNORE_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.vscode', '.idea']);

function scanDir(dir, depth = 0, maxDepth = 2) {
  if (depth > maxDepth) return;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.') && entry.name !== '.env.example') continue;
      if (IGNORE_DIRS.has(entry.name)) continue;

      const indent = '  '.repeat(depth + 1);
      if (entry.isDirectory()) {
        console.log(`${indent}📁 ${entry.name}/`);
        scanDir(path.join(dir, entry.name), depth + 1, maxDepth);
      } else {
        console.log(`${indent}📄 ${entry.name}`);
      }
    }
  } catch (err) {
    console.error(`Error reading ${dir}:`, err.message);
  }
}

scanDir(targetDir, 0, 2);

console.log('\n' + '='.repeat(60));
console.log('✅ Project inspection complete.');
console.log('='.repeat(60));

