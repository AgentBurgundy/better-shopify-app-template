#!/usr/bin/env bash

# Shopify App Template Setup Script for macOS/Linux
# This script will set up your development environment

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

echo -e "${CYAN}================================${NC}"
echo -e "${CYAN}Shopify App Template Setup${NC}"
echo -e "${CYAN}================================${NC}"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Detect OS
OS="$(uname -s)"
case "${OS}" in
    Linux*)     MACHINE=Linux;;
    Darwin*)    MACHINE=Mac;;
    *)          MACHINE="UNKNOWN:${OS}"
esac

echo -e "Detected OS: ${CYAN}${MACHINE}${NC}"
echo ""

# Step 1: Check for Node.js
echo -e "${YELLOW}[1/5] Checking for Node.js...${NC}"

if command_exists node; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}Success: Node.js is installed: ${NODE_VERSION}${NC}"
    
    # Check if version is 18 or higher
    VERSION_NUMBER=$(echo $NODE_VERSION | sed 's/v\([0-9]*\).*/\1/')
    if [ "$VERSION_NUMBER" -lt 18 ]; then
        echo -e "${YELLOW}Warning: Node.js 18 or higher is recommended. Current version: ${NODE_VERSION}${NC}"
        echo -e "${YELLOW}  Please upgrade Node.js${NC}"
    fi
else
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo ""
    echo -e "${YELLOW}Installing Node.js via nvm (Node Version Manager)...${NC}"
    echo ""
    
    # Check if nvm is installed
    if [ ! -d "$HOME/.nvm" ] && ! command_exists nvm; then
        echo -e "${CYAN}Installing nvm...${NC}"
        
        if [ "$MACHINE" = "Mac" ]; then
            # Try to install via Homebrew if available
            if command_exists brew; then
                echo -e "${CYAN}Using Homebrew to install nvm...${NC}"
                brew install nvm
                
                # Add nvm to shell profile
                export NVM_DIR="$HOME/.nvm"
                [ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"
                [ -s "/usr/local/opt/nvm/nvm.sh" ] && \. "/usr/local/opt/nvm/nvm.sh"
            else
                # Install nvm via curl
                curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
            fi
        else
            # Linux
            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
        fi
        
        # Load nvm
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
        
        echo -e "${GREEN}Success: nvm installed${NC}"
    else
        # Load nvm if it exists
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        [ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"
        [ -s "/usr/local/opt/nvm/nvm.sh" ] && \. "/usr/local/opt/nvm/nvm.sh"
    fi
    
    # Install Node.js 20 LTS
    echo -e "${CYAN}Installing Node.js 20 LTS...${NC}"
    nvm install 20
    nvm use 20
    nvm alias default 20
    
    if command_exists node; then
        NODE_VERSION=$(node --version)
        echo -e "${GREEN}Success: Node.js installed: ${NODE_VERSION}${NC}"
    else
        echo -e "${RED}Error: Failed to install Node.js${NC}"
        echo -e "${YELLOW}Please install Node.js manually from: https://nodejs.org/${NC}"
        exit 1
    fi
fi

# Step 2: Check npm
echo ""
echo -e "${YELLOW}[2/5] Checking for npm...${NC}"

if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}Success: npm is installed: v${NPM_VERSION}${NC}"
else
    echo -e "${RED}Error: npm is not installed (should come with Node.js)${NC}"
    exit 1
fi

# Step 3: Enable Corepack
echo ""
echo -e "${YELLOW}[3/5] Enabling Corepack...${NC}"

if command_exists corepack; then
    corepack enable 2>/dev/null || {
        echo -e "${YELLOW}Warning: Could not enable Corepack (may need sudo)${NC}"
        echo -e "${YELLOW}  Trying with sudo...${NC}"
        sudo corepack enable 2>/dev/null || echo -e "${YELLOW}  Skipping Corepack (will use npm-installed Yarn)${NC}"
    }
    echo -e "${GREEN}Success: Corepack enabled${NC}"
else
    echo -e "${YELLOW}Warning: Corepack not found, installing...${NC}"
    npm install -g corepack 2>/dev/null || {
        echo -e "${YELLOW}  Could not install Corepack globally${NC}"
    }
    corepack enable 2>/dev/null || true
fi

# Step 4: Verify Yarn
echo ""
echo -e "${YELLOW}[4/5] Checking for Yarn...${NC}"

if command_exists yarn; then
    YARN_VERSION=$(yarn --version)
    echo -e "${GREEN}Success: Yarn is available: v${YARN_VERSION}${NC}"
else
    echo -e "${YELLOW}Warning: Yarn not found, installing globally...${NC}"
    npm install -g yarn
    
    if command_exists yarn; then
        YARN_VERSION=$(yarn --version)
        echo -e "${GREEN}Success: Yarn installed: v${YARN_VERSION}${NC}"
    else
        echo -e "${RED}Error: Failed to install Yarn${NC}"
        echo -e "${YELLOW}  Please restart your terminal and try again${NC}"
        exit 1
    fi
fi

# Step 5: Install dependencies
echo ""
echo -e "${YELLOW}[5/5] Installing project dependencies...${NC}"
echo -e "${GRAY}This may take a few minutes...${NC}"
echo ""

if yarn install; then
    echo ""
    echo -e "${GREEN}================================${NC}"
    echo -e "${GREEN}Success: Setup completed successfully!${NC}"
    echo -e "${GREEN}================================${NC}"
    echo ""
    echo -e "${CYAN}Next steps:${NC}"
    echo -e "  ${NC}1. Copy apps/shopify-app/env.example to apps/shopify-app/.env${NC}"
    echo -e "  ${NC}2. Edit .env with your Shopify credentials${NC}"
    echo -e "  ${NC}3. Set up your database connection in .env${NC}"
    echo -e "  ${NC}4. Run: ${CYAN}yarn db:generate${NC}"
    echo -e "  ${NC}5. Run: ${CYAN}yarn db:migrate${NC}"
    echo -e "  ${NC}6. Run: ${CYAN}yarn dev${NC}"
    echo ""
    echo -e "${GRAY}See QUICKSTART.md for detailed instructions${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}Error: Installation failed${NC}"
    echo ""
    echo -e "${YELLOW}Try running manually: yarn install${NC}"
    exit 1
fi
