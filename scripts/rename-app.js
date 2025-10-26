#!/usr/bin/env node

/**
 * Rename App Script
 * 
 * This script renames the app from @myapp to a custom name throughout the project.
 * 
 * Usage:
 *   node scripts/rename-app.js
 *   yarn rename-app
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// ANSI colors
const colors = {
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

// Validate package name
function validatePackageName(name) {
  // Check for common mistakes
  if (name.includes(' ')) {
    return {
      valid: false,
      error: 'Package name cannot contain spaces.\nUse hyphens instead: my-app or mycompany/my-app',
    };
  }
  
  if (name !== name.toLowerCase()) {
    return {
      valid: false,
      error: 'Package name must be lowercase.\nTry: ' + name.toLowerCase(),
    };
  }
  
  // Remove @ if present for validation
  const cleanName = name.startsWith('@') ? name.slice(1) : name;
  
  // Check format
  const scopedPattern = /^[a-z0-9-~][a-z0-9-._~]*\/[a-z0-9-~][a-z0-9-._~]*$/;
  const unscopedPattern = /^[a-z0-9-~][a-z0-9-._~]*$/;
  
  if (!scopedPattern.test(cleanName) && !unscopedPattern.test(cleanName)) {
    return {
      valid: false,
      error: 'Package name can only contain:\n  - Lowercase letters (a-z)\n  - Numbers (0-9)\n  - Hyphens (-)\n  - Underscores (_)\n  - Dots (.)\n\nFor scoped packages use: yourcompany/appname (@ will be added automatically)',
    };
  }
  
  // Additional checks for scoped packages
  if (cleanName.includes('/')) {
    const [scope, pkgName] = cleanName.split('/');
    if (!scope || !pkgName) {
      return {
        valid: false,
        error: 'Scoped package format should be: yourcompany/appname',
      };
    }
  }
  
  return { valid: true };
}

// Files to update
const filesToUpdate = [
  'package.json',
  'packages/core/package.json',
  'packages/core/README.md',
  'packages/database/package.json',
  'packages/database/README.md',
  'apps/shopify-app/package.json',
  'apps/shopify-app/README.md',
  'apps/shopify-app/shopify.app.toml',
  'apps/shopify-app/app/db.server.ts',
  'apps/shopify-app/app/shopify.server.ts',
  'README.md',
  'docker-compose.yml',
];

// Detect current package scope/name
function detectCurrentPackageName() {
  try {
    // Try to read from core package.json
    const corePkgPath = path.join(rootDir, 'packages/core/package.json');
    if (fs.existsSync(corePkgPath)) {
      const corePkg = JSON.parse(fs.readFileSync(corePkgPath, 'utf8'));
      if (corePkg.name) {
        // Extract scope from package name
        // e.g., "@myapp/core" -> "@myapp" or "test/core" -> "test"
        const match = corePkg.name.match(/^(@?[^/]+)\//);
        if (match) {
          return match[1];
        }
      }
    }
    
    // Fallback to @myapp
    return '@myapp';
  } catch (error) {
    log(`  ⚠ Could not detect current package name, using @myapp`, 'yellow');
    return '@myapp';
  }
}

function replaceInFile(filePath, oldName, newName) {
  const fullPath = path.join(rootDir, filePath);
  
  if (!fs.existsSync(fullPath)) {
    log(`  ⚠ File not found: ${filePath}`, 'yellow');
    return false;
  }
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;
    
    // For docker-compose.yml, only replace in package name contexts, not database usernames
    if (filePath === 'docker-compose.yml') {
      // Only replace in environment variables and PostgreSQL user/db names
      // Don't replace in pg_isready commands or other internal references
      const lines = content.split('\n');
      content = lines.map(line => {
        // Skip lines that are pg_isready commands or test commands
        if (line.includes('pg_isready') || line.includes('CMD-SHELL')) {
          return line;
        }
        // Replace in other contexts
        return line.replace(new RegExp(oldName, 'g'), newName);
      }).join('\n');
    } else {
      // Replace all occurrences in other files
      content = content.replace(new RegExp(oldName, 'g'), newName);
    }
    
    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content, 'utf8');
      log(`  ✓ Updated: ${filePath}`, 'green');
      return true;
    } else {
      log(`  - No changes: ${filePath}`, 'reset');
      return false;
    }
  } catch (error) {
    log(`  ✗ Error updating ${filePath}: ${error.message}`, 'red');
    return false;
  }
}

async function main() {
  log('\n================================', 'cyan');
  log('     Rename Shopify App', 'cyan');
  log('================================\n', 'cyan');
  
  // Detect current package name
  const currentName = detectCurrentPackageName();
  log(`Current package scope: ${colors.bold}${currentName}${colors.reset}\n`, 'cyan');
  
  log('This script will rename your app to a new custom name.\n', 'reset');
  log('Examples:', 'yellow');
  log('  Scoped (recommended):', 'cyan');
  log('    mycompany/shopify-app  →  @mycompany/shopify-app', 'reset');
  log('    @acme/store            →  @acme/store', 'reset');
  log('  Unscoped:', 'cyan');
  log('    myapp                  →  myapp\n', 'reset');
  
  // Get new name
  const newName = await question('Enter your new app name (or press Ctrl+C to cancel): ');
  
  if (!newName.trim()) {
    log('\n✗ App name cannot be empty.', 'red');
    rl.close();
    process.exit(1);
  }
  
  // Process and normalize the name
  let finalName = newName.trim();
  
  // This template ALWAYS uses scoped packages (@scope/core, @scope/database, @scope/shopify-app)
  // Auto-add @ if missing
  if (finalName.includes('/')) {
    // Has slash - format is "scope/name" or "@scope/name"
    if (!finalName.startsWith('@')) {
      finalName = '@' + finalName;
      log(`\n→ Auto-adding @ for scoped package: ${finalName}`, 'cyan');
    }
  } else {
    // No slash - user entered just the scope name
    if (!finalName.startsWith('@')) {
      // Always add @ since this template uses scoped packages
      log(`\n→ Auto-adding @ for scoped package: @${finalName}`, 'cyan');
      log(`  Packages will be: @${finalName}/core, @${finalName}/database, @${finalName}/shopify-app\n`, 'gray');
      finalName = '@' + finalName;
    }
  }
  
  // Validate
  const validation = validatePackageName(finalName);
  if (!validation.valid) {
    log(`\n✗ Invalid package name:\n  ${validation.error}`, 'red');
    rl.close();
    process.exit(1);
  }
  
  // Check if already using this name
  if (currentName === finalName) {
    log(`\n⚠ The app is already named ${finalName}`, 'yellow');
    rl.close();
    process.exit(0);
  }
  
  // Confirm
  log(`\nYou are about to rename:`, 'yellow');
  log(`  ${colors.bold}${currentName}${colors.reset} → ${colors.bold}${colors.green}${finalName}${colors.reset}\n`);
  
  const confirm = await question('Continue? (y/N): ');
  
  if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
    log('\n✗ Cancelled.', 'yellow');
    rl.close();
    process.exit(0);
  }
  
  log('\nRenaming files...\n', 'cyan');
  
  let updatedCount = 0;
  for (const file of filesToUpdate) {
    if (replaceInFile(file, currentName, finalName)) {
      updatedCount++;
    }
  }
  
  log('\n================================', 'green');
  log(`✓ Rename complete!`, 'green');
  log('================================\n', 'green');
  
  log(`Updated ${updatedCount} file(s).\n`, 'reset');
  
  log('Next steps:', 'cyan');
  log('  1. Run: yarn install', 'reset');
  log('  2. Review the changes with: git diff', 'reset');
  log('  3. Update your Shopify app name in apps/shopify-app/shopify.app.toml', 'reset');
  log('  4. See README.md for development setup', 'reset');
  log('  5. Start building! 🚀\n', 'reset');
  
  rl.close();
}

main().catch((error) => {
  log(`\n✗ Error: ${error.message}`, 'red');
  rl.close();
  process.exit(1);
});

