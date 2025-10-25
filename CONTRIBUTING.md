# Contributing Guide

Thank you for your interest in improving this Shopify app template!

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `yarn install`
3. Set up your environment (see QUICKSTART.md)
4. Create a feature branch: `git checkout -b feature/my-feature`

## Project Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Run `yarn build` to ensure no type errors
- Use Prettier for formatting (config in `.prettierrc`)

### Package Structure

When adding features, consider where they belong:

- **@myapp/core** - Shared utilities, no app-specific logic
- **@myapp/database** - Database models and queries only
- **@myapp/shopify-app** - Shopify-specific features

### Adding Dependencies

```bash
# For a specific package
yarn workspace @myapp/shopify-app add package-name

# For the root
yarn add -W package-name

# For all packages
yarn add package-name
```

### Database Changes

1. Edit `packages/database/prisma/schema.prisma`
2. Create migration: `yarn db:migrate`
3. Test the migration
4. Commit both schema and migration files

### Commit Messages

Use clear, descriptive commit messages:

```
feat: add customer repository
fix: resolve session timeout issue
docs: update installation guide
refactor: simplify config loading
```

## Testing

Before submitting:

1. Build all packages: `yarn build`
2. Check for type errors
3. Test your changes locally
4. Ensure no breaking changes

## Pull Requests

1. Update relevant documentation
2. Add a clear description of changes
3. Reference any related issues
4. Ensure all checks pass

## Questions?

Open an issue for:
- Bug reports
- Feature requests
- Architecture questions
- Documentation improvements

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

