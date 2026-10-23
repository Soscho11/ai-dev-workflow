/**
 * audit-secrets.js
 * 
 * Zero-dependency Node.js script to scan project files for accidental secret leaks,
 * hardcoded API keys, database credentials, and unignored environment files.
 * Usage: node scripts/audit-secrets.js [optional-target-path]
 */

const fs = require('fs');
const path = require('path');

const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();

console.log('='.repeat(60));
console.log(`🛡️  Secret & Credential Audit: ${targetDir}`);
console.log('='.repeat(60));

const SUSPICIOUS_PATTERNS = [
  {
    name: 'Hardcoded Private Key',
    regex: /-----BEGIN\s+(RSA|EC|DSA|OPENSSH)?\s*PRIVATE KEY-----/i
  },
  {
    name: 'AWS Access Key ID',
    regex: /\b(AKIA|ABIA|ACCA|ASIA)[0-9A-Z]{16}\b/
  },
  {
    name: 'Hardcoded JWT Secret in sign/verify',
    regex: /jwt\.(sign|verify)\s*\(\s*[^,]+,\s*['"`]([a-zA-Z0-9!@#$%^&*()_+=-]{8,})['"`]/
  },
  {
    name: 'Generic API Key / Secret assignment',
    regex: /(api_key|apikey|secret_key|client_secret)\s*[:=]\s*['"`]([a-zA-Z0-9_\-]{16,})['"`]/i
  },
  {
    name: 'Hardcoded Database Password',
    regex: /(password|passwd|db_pass|db_password)\s*[:=]\s*['"`](?!.*process\.env)(?!(root|admin|password|your_password|test|dummy|\s*)$)([^'"`\n\r]{6,})['"`]/i
  }
];

const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  '.vscode',
  '.idea',
  'coverage'
]);

const SCANNABLE_EXTENSIONS = new Set([
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.json',
  '.sql',
  '.html',
  '.env',
  '.env.local'
]);

let findingsCount = 0;

function scanFile(filePath) {
  // If the file itself is a real .env file and not .env.example
  const fileName = path.basename(filePath);
  if (fileName === '.env' || fileName.startsWith('.env.') && fileName !== '.env.example') {
    // Check if git tracks it or gitignore ignores it
    const gitignorePath = path.join(targetDir, '.gitignore');
    if (!fs.existsSync(gitignorePath) || !fs.readFileSync(gitignorePath, 'utf8').includes('.env')) {
      console.log(`\n🚨 CRITICAL: Sensitive environment file found without .gitignore protection:`);
      console.log(`   File: ${filePath}`);
      findingsCount++;
    }
    return;
  }

  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    return; // Skip unreadable files
  }

  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    // Skip comments and sample/test files
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('#')) {
      return;
    }

    for (const pattern of SUSPICIOUS_PATTERNS) {
      if (pattern.regex.test(line)) {
        console.log(`\n⚠️  Potential Secret Found [${pattern.name}]:`);
        console.log(`   Location: ${path.relative(targetDir, filePath)}:${index + 1}`);
        console.log(`   Snippet:  ${trimmed.substring(0, 100)}`);
        findingsCount++;
      }
    }
  });
}

function traverseDir(dir) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (IGNORED_DIRS.has(entry.name)) continue;

      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        traverseDir(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (SCANNABLE_EXTENSIONS.has(ext) || entry.name.startsWith('.env')) {
          // Skip scanning audit-secrets.js itself to avoid self-match on regexes
          if (entry.name === 'audit-secrets.js') continue;
          scanFile(fullPath);
        }
      }
    }
  } catch (err) {
    console.error(`Error traversing ${dir}:`, err.message);
  }
}

traverseDir(targetDir);

console.log('\n' + '='.repeat(60));
if (findingsCount === 0) {
  console.log('✅ Audit clean: No obvious credentials or unignored secrets found.');
  console.log('='.repeat(60));
  process.exit(0);
} else {
  console.log(`❌ Audit Warning: Found ${findingsCount} potential secret(s) or risks.`);
  console.log('   Review the findings above before committing or sharing code.');
  console.log('='.repeat(60));
  process.exit(1);
}

