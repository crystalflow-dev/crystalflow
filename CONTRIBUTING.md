# Contributing to ReactFlo

Thank you for your interest in contributing to ReactFlo! We welcome contributions from the community.

## Getting Started

1. **Fork the repository** and clone it locally
2. **Install dependencies:** `npm install`
3. **Build all packages:** `npm run build`
4. **Run tests:** `npm test`

## Development Workflow

1. Create a new branch for your feature/fix: `git checkout -b feature/my-feature`
2. Make your changes in the appropriate package(s)
3. Add tests for your changes
4. Run tests and linting: `npm test && npm run lint`
5. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/)
6. Push to your fork and submit a pull request

## Project Structure

ReactFlo is organized as a monorepo with multiple packages:

- `packages/core` - Core workflow engine
- `packages/react` - React UI components
- `packages/cli` - Command-line tools
- `packages/types` - TypeScript type definitions
- `packages/plugins` - Official plugins

## Coding Standards

- **TypeScript:** All code must be written in TypeScript
- **ESLint:** Follow the ESLint configuration
- **Prettier:** Code is automatically formatted with Prettier
- **Tests:** Add tests for new features and bug fixes
- **Documentation:** Update documentation for API changes

## Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(core): add async node execution support
fix(react): prevent connection to incompatible ports
docs(readme): update installation instructions
```

## Pull Request Process

1. Update the README.md or documentation with details of changes if applicable
2. Update the package version following [Semantic Versioning](https://semver.org/)
3. The PR will be merged once you have the approval of at least one maintainer

## Reporting Bugs

Please use the GitHub issue tracker to report bugs. Include:

- A clear description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Version information
- Code examples if applicable

## Feature Requests

We welcome feature requests! Please:

- Check if the feature has already been requested
- Clearly describe the feature and its use case
- Explain why it would be valuable to the project

## Questions?

Feel free to open an issue or reach out to the maintainers.

## Code of Conduct

Be respectful and constructive in all interactions. We aim to foster a welcoming and inclusive community.

## License

By contributing to ReactFlo, you agree that your contributions will be licensed under the MIT License.
