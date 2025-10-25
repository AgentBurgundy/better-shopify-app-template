# Setup Scripts Documentation

This template includes automated setup scripts to help you get started quickly, especially if you're new to Node.js development or don't have all the prerequisites installed.

## Available Scripts

### Windows: `setup.ps1`

PowerShell script for Windows users.

**Usage:**
```powershell
.\setup.ps1
```

**What it does:**
1. ✅ Checks if Node.js is installed (requires v18+)
2. ✅ If not installed, provides clear instructions for installation via:
   - NVM for Windows (recommended)
   - Direct Node.js installer
3. ✅ Verifies npm is available
4. ✅ Enables Corepack for Yarn management
5. ✅ Installs Yarn if not already available
6. ✅ Runs `yarn install` to install all dependencies

**Requirements:**
- Windows 10 or higher
- PowerShell 5.1 or higher

### macOS/Linux: `setup.sh`

Bash script for macOS and Linux users.

**Usage:**
```bash
chmod +x setup.sh
./setup.sh
```

**What it does:**
1. ✅ Detects your operating system
2. ✅ Checks if Node.js is installed (requires v18+)
3. ✅ If not installed, automatically installs Node.js via nvm:
   - On macOS: Uses Homebrew if available, otherwise uses curl
   - On Linux: Uses curl to install nvm
4. ✅ Installs Node.js 20 LTS via nvm
5. ✅ Verifies npm is available
6. ✅ Enables Corepack (with sudo fallback if needed)
7. ✅ Installs Yarn if not already available
8. ✅ Runs `yarn install` to install all dependencies

**Requirements:**
- macOS 10.15+ or Linux
- Bash 4.0 or higher
- curl (for nvm installation)

## Troubleshooting

### Windows Issues

**"Execution of scripts is disabled on this system"**
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

**"Cannot find path" errors**
- Make sure you're running the script from the repository root
- Try opening a new PowerShell window as Administrator

**Node.js installed but not detected**
- Close all terminal windows and open a new one
- The PATH needs to be refreshed after Node.js installation

### macOS/Linux Issues

**"Permission denied"**
```bash
chmod +x setup.sh
```

**Script fails during nvm installation**
- Check your internet connection
- Make sure curl is installed: `brew install curl` (macOS) or `sudo apt install curl` (Ubuntu/Debian)

**Corepack enable fails**
- Try running with sudo: `sudo corepack enable`
- Or skip Corepack and use npm-installed Yarn (script handles this automatically)

**NVM commands not found after installation**
- Close and reopen your terminal
- Or manually source nvm:
  ```bash
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  ```

## Manual Setup Alternative

If the scripts don't work for your environment, you can set up manually:

### 1. Install Node.js

**Windows:**
- Download from [nodejs.org](https://nodejs.org/)
- Or use [nvm-windows](https://github.com/coreybutler/nvm-windows)

**macOS:**
```bash
brew install nvm
nvm install 20
nvm use 20
```

**Linux:**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

### 2. Enable Corepack

```bash
corepack enable
```

### 3. Install Dependencies

```bash
cd shopify-app-template
yarn install
```

## After Setup

Once the setup script completes successfully, follow these next steps:

1. **Configure environment variables:**
   ```bash
   cd apps/shopify-app
   cp env.example .env
   # Edit .env with your settings
   ```

2. **Set up database:**
   ```bash
   yarn db:generate
   yarn db:migrate
   ```

3. **Start development:**
   ```bash
   yarn dev
   ```

See [QUICKSTART.md](QUICKSTART.md) for detailed next steps.

## Script Maintenance

These scripts are designed to be:
- ✅ Idempotent (safe to run multiple times)
- ✅ Non-destructive (won't overwrite existing installations)
- ✅ Informative (clear output and error messages)
- ✅ Fail-safe (stops on errors with helpful guidance)

If you encounter issues not covered here, please open an issue on GitHub.

