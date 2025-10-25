# Shopify App Template Setup Script for Windows
# This script will set up your development environment

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Shopify App Template Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-Command {
    param($Command)
    try {
        if (Get-Command $Command -ErrorAction Stop) {
            return $true
        }
    }
    catch {
        return $false
    }
}

# Step 1: Check for Node.js
Write-Host "[1/5] Checking for Node.js..." -ForegroundColor Yellow

if (Test-Command node) {
    $nodeVersion = node --version
    Write-Host "Success: Node.js is installed: $nodeVersion" -ForegroundColor Green
    
    # Check if version is 18 or higher
    $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($versionNumber -lt 18) {
        Write-Host "Warning: Node.js 18 or higher is recommended. Current version: $nodeVersion" -ForegroundColor Yellow
        Write-Host "  Please upgrade Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    }
} else {
    Write-Host "Error: Node.js is not installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js before continuing:" -ForegroundColor Yellow
    Write-Host "  Option 1 (Recommended): Use NVM for Windows" -ForegroundColor Cyan
    Write-Host "    1. Download from: https://github.com/coreybutler/nvm-windows/releases" -ForegroundColor White
    Write-Host "    2. Install nvm-setup.exe" -ForegroundColor White
    Write-Host "    3. Open a new PowerShell and run:" -ForegroundColor White
    Write-Host "       nvm install 20" -ForegroundColor Gray
    Write-Host "       nvm use 20" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  Option 2: Direct install" -ForegroundColor Cyan
    Write-Host "    Download from: https://nodejs.org/ (LTS version)" -ForegroundColor White
    Write-Host ""
    Write-Host "After installation, close this terminal, open a new one, and run this script again." -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}

# Step 2: Check npm
Write-Host ""
Write-Host "[2/5] Checking for npm..." -ForegroundColor Yellow

if (Test-Command npm) {
    $npmVersion = npm --version
    Write-Host "Success: npm is installed: v$npmVersion" -ForegroundColor Green
} else {
    Write-Host "Error: npm is not installed (should come with Node.js)" -ForegroundColor Red
    exit 1
}

# Step 3: Enable Corepack
Write-Host ""
Write-Host "[3/5] Enabling Corepack..." -ForegroundColor Yellow

try {
    # Check if corepack is available
    if (Test-Command corepack) {
        $null = corepack enable 2>&1
        Write-Host "Success: Corepack enabled successfully" -ForegroundColor Green
    } else {
        Write-Host "Warning: Corepack not found, trying to enable via npm..." -ForegroundColor Yellow
        $null = npm install -g corepack 2>&1
        $null = corepack enable 2>&1
        Write-Host "Success: Corepack installed and enabled" -ForegroundColor Green
    }
} catch {
    Write-Host "Warning: Could not enable Corepack automatically" -ForegroundColor Yellow
    Write-Host "  You may need to run as Administrator or manually run: corepack enable" -ForegroundColor Yellow
}

# Step 4: Verify Yarn
Write-Host ""
Write-Host "[4/5] Checking for Yarn..." -ForegroundColor Yellow

# Corepack should provide yarn, let's verify
if (Test-Command yarn) {
    $yarnVersion = yarn --version
    Write-Host "Success: Yarn is available: v$yarnVersion" -ForegroundColor Green
} else {
    Write-Host "Warning: Yarn not found after enabling Corepack" -ForegroundColor Yellow
    Write-Host "  Installing Yarn globally via npm..." -ForegroundColor Yellow
    $null = npm install -g yarn 2>&1
    
    if (Test-Command yarn) {
        Write-Host "Success: Yarn installed successfully" -ForegroundColor Green
    } else {
        Write-Host "Error: Failed to install Yarn" -ForegroundColor Red
        Write-Host "  Please close this terminal, open a new one, and try again" -ForegroundColor Yellow
        exit 1
    }
}

# Step 5: Install dependencies
Write-Host ""
Write-Host "[5/5] Installing project dependencies..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray
Write-Host ""

try {
    yarn install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "================================" -ForegroundColor Green
        Write-Host "Success: Setup completed successfully!" -ForegroundColor Green
        Write-Host "================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "  1. Copy apps/shopify-app/env.example to apps/shopify-app/.env" -ForegroundColor White
        Write-Host "  2. Edit .env with your Shopify credentials" -ForegroundColor White
        Write-Host "  3. Set up your database connection in .env" -ForegroundColor White
        Write-Host "  4. Run: yarn db:generate" -ForegroundColor White
        Write-Host "  5. Run: yarn db:migrate" -ForegroundColor White
        Write-Host "  6. Run: yarn dev" -ForegroundColor White
        Write-Host ""
        Write-Host "See QUICKSTART.md for detailed instructions" -ForegroundColor Gray
        Write-Host ""
    } else {
        throw "Yarn install failed"
    }
} catch {
    Write-Host ""
    Write-Host "Error: Installation failed" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Try running manually: yarn install" -ForegroundColor Yellow
    exit 1
}

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
