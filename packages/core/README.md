# @myapp/core

Shared core utilities and configuration management for all apps in the workspace.

## Features

- **Configuration Management** - Centralized environment variable handling
- **Type Safety** - Full TypeScript support

## Usage

### Configuration

```typescript
import { createAppConfig } from '@myapp/core';

const config = createAppConfig();

console.log(config.SHOPIFY_API_KEY);
console.log(config.DATABASE_URL);
```

## Adding Utilities

Add new shared utilities to the `src/` directory and export them from `index.ts`:

```typescript
// src/my-utility.ts
export function myUtility() {
  // ...
}

// src/index.ts
export * from './my-utility.js';
```

## Development

```bash
# Build the package
yarn build

# Watch for changes
yarn dev
```

