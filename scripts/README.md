# Scripts

Utility scripts for the Shopify app template. See main [README.md](../README.md) for full documentation.

## setup.js

Cross-platform setup script that installs all prerequisites and dependencies. Works on Windows, macOS, and Linux.

### Usage

```bash
node scripts/setup.js
```

Or if you already have Yarn:

```bash
yarn setup
```

### What it does

1. ✅ Checks if Node.js is installed (v18+)
2. ✅ Checks if npm is available
3. ✅ Enables Corepack for Yarn management
4. ✅ Installs Yarn if not available
5. ✅ Runs `yarn install` to install all dependencies

### Platform Support

- ✅ Windows (PowerShell/CMD)
- ✅ macOS (Terminal/iTerm)
- ✅ Linux (Bash/Zsh/Fish)

No need for separate `.ps1` or `.sh` files!

## rename-app.js

Renames the app to your custom package name throughout the entire project. **Can be run multiple times** to change the name again.

### Usage

```bash
yarn rename
```

Or directly:

```bash
node scripts/rename-app.js
```

### What it does

The script will:
1. **Auto-detect the current package name** from your workspace
2. Prompt you for a new package name
3. Validate the package name format
4. Update all references to the current name in:
   - All `package.json` files
   - Source code imports
   - Documentation files
   - Docker compose configuration

### Examples

**Scoped package (recommended) - multiple ways:**
```bash
$ yarn rename
Enter your new app name: mycompany/shopify-app
→ Auto-corrected to scoped package: @mycompany/shopify-app
```

```bash
$ yarn rename
Enter your new app name: @mycompany/shopify-app
# Already correct!
```

**Unscoped package:**
```bash
$ yarn rename
Enter your new app name: my-shopify-app
→ Creating unscoped package: my-shopify-app
```

**The script automatically adds `@` if you forget it!**

### Running Multiple Times

The script can be run multiple times to rename your app:

```bash
# First time: @myapp → @mycompany/app
$ yarn rename
Current package scope: @myapp
Enter your new app name: mycompany/app
→ Auto-corrected to scoped package: @mycompany/app

# Second time: @mycompany/app → @acme/store
$ yarn rename
Current package scope: @mycompany
Enter your new app name: acme/store
→ Auto-corrected to scoped package: @acme/store
```

The script automatically detects your current package name!

### Files Updated

- `package.json` (root)
- `packages/core/package.json`
- `packages/core/README.md`
- `packages/database/package.json`
- `packages/database/README.md`
- `apps/shopify-app/package.json`
- `apps/shopify-app/README.md`
- `apps/shopify-app/app/db.server.ts`
- `apps/shopify-app/app/shopify.server.ts`
- `README.md`
- `ARCHITECTURE.md`
- `docker-compose.yml`

### After Renaming

1. Run `yarn install` to update workspace links
2. Review changes with `git diff`
3. Update your Shopify app name in `apps/shopify-app/shopify.app.toml`
4. Start building! 🚀

### Package Name Requirements

- Must be lowercase
- Can contain letters, numbers, hyphens, dots, and underscores
- Scoped packages use `@scope/name` format
- Cannot start with a dot or underscore
- Cannot contain spaces or special characters

**Valid examples:**
- `@mycompany/shopify-app`
- `@acme/store`
- `my-awesome-app`
- `shopify-app-v2`

**Invalid examples:**
- `MyApp` (uppercase)
- `my app` (spaces)
- `@MyCompany/App` (uppercase)

