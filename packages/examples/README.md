# @reactflo/examples

Example applications and demos showcasing ReactFlo workflow builder capabilities.

## Running Examples

```bash
# From the monorepo root
npm install
npm run build

# Start the examples dev server
cd packages/examples
npm run dev
```

Then open http://localhost:5173 in your browser.

## Available Examples

### Simple Workflow

Basic workflow builder with math operations and display nodes. Demonstrates:

- Node palette with drag-and-drop
- Property panel for editing node properties
- Toolbar with workflow actions
- Node connections with type validation

## Adding New Examples

1. Create a new component in `src/examples/`
2. Import and add it to `src/App.tsx`
3. Define custom nodes using `@defineNode`, `@Input`, and `@Output` decorators

## Building Examples

```bash
npm run build
```

This creates a production build in the `dist/` folder.
