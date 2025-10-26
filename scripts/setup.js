#!/usr/bin/env node

/**
 * Shopify App Template Setup Script
 * 
 * Cross-platform setup script that works on Windows, macOS, and Linux
 * 
 * Usage:
 *   node scripts/setup.js
 *   yarn setup (if yarn is already installed)
 */

import { execSync, spawn } from 'child_process';
import { platform } from 'os';
import fs from 'fs';
import path from 'path';
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
  gray: '\x1b[90m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Check if a command exists
function commandExists(command) {
  try {
    const testCmd = platform() === 'win32' ? 'where' : 'which';
    execSync(`${testCmd} ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Get command output
function getCommandOutput(command) {
  try {
    return execSync(command, { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

// Run command with real-time output
function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    proc.on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  log('\n================================', 'cyan');
  log('  Shopify App Template Setup', 'cyan');
  log('================================\n', 'cyan');

  const os = platform();
  const osName = os === 'win32' ? 'Windows' : os === 'darwin' ? 'macOS' : 'Linux';
  log(`Detected OS: ${osName}\n`, 'cyan');

  // Step 1: Check Node.js
  log('[1/4] Checking for Node.js...', 'yellow');

  if (commandExists('node')) {
    const nodeVersion = getCommandOutput('node --version');
    log(`✓ Node.js is installed: ${nodeVersion}`, 'green');

    // Check version
    const versionNumber = parseInt(nodeVersion.replace('v', '').split('.')[0]);
    if (versionNumber < 18) {
      log(`⚠ Warning: Node.js 18+ is recommended. Current: ${nodeVersion}`, 'yellow');
      log('  Please upgrade Node.js from: https://nodejs.org/', 'yellow');
    }
  } else {
    log('✗ Node.js is not installed', 'red');
    log('\nPlease install Node.js before continuing:', 'yellow');
    
    if (os === 'win32') {
      log('  Option 1 (Recommended): NVM for Windows', 'cyan');
      log('    Download: https://github.com/coreybutler/nvm-windows/releases', 'gray');
      log('  Option 2: Direct install', 'cyan');
      log('    Download: https://nodejs.org/ (LTS version)', 'gray');
    } else if (os === 'darwin') {
      log('  Option 1: Homebrew + NVM', 'cyan');
      log('    brew install nvm', 'gray');
      log('    nvm install 20', 'gray');
      log('  Option 2: Direct install', 'cyan');
      log('    Download: https://nodejs.org/', 'gray');
    } else {
      log('  Option 1: NVM', 'cyan');
      log('    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash', 'gray');
      log('    nvm install 20', 'gray');
      log('  Option 2: Package manager', 'cyan');
      log('    sudo apt install nodejs npm', 'gray');
    }
    
    log('\nAfter installation, close this terminal, open a new one, and run this script again.\n', 'yellow');
    process.exit(1);
  }

  // Step 2: Check npm
  log('\n[2/4] Checking for npm...', 'yellow');

  if (commandExists('npm')) {
    const npmVersion = getCommandOutput('npm --version');
    log(`✓ npm is installed: v${npmVersion}`, 'green');
  } else {
    log('✗ npm is not installed (should come with Node.js)', 'red');
    process.exit(1);
  }

  // Step 3: Enable Corepack and check Yarn
  log('\n[3/4] Setting up Yarn...', 'yellow');

  try {
    if (commandExists('corepack')) {
      try {
        execSync('corepack enable', { stdio: 'ignore' });
        log('✓ Corepack enabled', 'green');
      } catch (error) {
        log('⚠ Could not enable Corepack (may need admin/sudo)', 'yellow');
        log('  Will install Yarn via npm instead...', 'gray');
      }
    }

    // Check if yarn is available
    if (!commandExists('yarn')) {
      log('  Installing Yarn globally...', 'gray');
      execSync('npm install -g yarn', { stdio: 'ignore' });
    }

    const yarnVersion = getCommandOutput('yarn --version');
    if (yarnVersion) {
      log(`✓ Yarn is available: v${yarnVersion}`, 'green');
    } else {
      throw new Error('Yarn installation failed');
    }
  } catch (error) {
    log('✗ Failed to set up Yarn', 'red');
    log('  Please install Yarn manually: npm install -g yarn', 'yellow');
    process.exit(1);
  }

  // Step 4: Install dependencies
  log('\n[4/4] Installing project dependencies...', 'yellow');
  log('This may take a few minutes...\n', 'gray');

  try {
    await runCommand('yarn', ['install']);

    log('\n================================', 'green');
    log('✓ Setup completed successfully!', 'green');
    log('================================\n', 'green');

    log('Next steps:', 'cyan');
    log('  1. Rename your app:', 'reset');
    log('     yarn rename', 'gray');
    log('  2. Copy apps/shopify-app/env.example to apps/shopify-app/.env', 'reset');
    log('  3. Edit .env with your Shopify credentials', 'reset');
    log('  4. Set up your database:', 'reset');
    log('     yarn db:generate', 'gray');
    log('     yarn db:migrate', 'gray');
    log('  5. Start development:', 'reset');
    log('     yarn dev', 'gray');
    log('\nSee README.md for detailed instructions\n', 'gray');
  } catch (error) {
    log('\n✗ Installation failed', 'red');
    log(`  Error: ${error.message}`, 'red');
    log('\nTry running manually: yarn install', 'yellow');
    process.exit(1);
  }
}

main().catch((error) => {
  log(`\n✗ Setup failed: ${error.message}`, 'red');
  process.exit(1);
});

