# Development Workflow

## Quick Start

### Development Mode (Watch All Packages)

Start all package watch modes and the examples dev server with a single command:

```bash
npm run dev
```

This will:

- ✅ Watch `@reactflo/types` and rebuild on changes
- ✅ Watch `@reactflo/core` and rebuild on changes
- ✅ Watch `@reactflo/react` and rebuild on changes
- ✅ Start Vite dev server for `@reactflo/examples`
- ✅ Auto-reload browser when packages are rebuilt

**No more clearing cache!** Changes to any package are automatically compiled and hot-reloaded in the examples app.

### How It Works

1. **TypeScript Watch Mode**: Each package runs `tsc --watch` to automatically rebuild on file changes
2. **Built Package Consumption**: Examples app consumes the built `dist/` folders (not source)
3. **Vite HMR**: Vite watches `node_modules/@reactflo/*/dist` and triggers HMR when files change
4. **Concurrently**: All watch processes run in parallel with color-coded output

### Terminal Output

```
[types]    tsc watch output (cyan)
[core]     tsc watch output (magenta)
[react]    tsc watch output (blue)
[examples] Vite dev server output (green)
```

## Manual Commands

### Build All Packages Once

```bash
npm run build
```

### Build Individual Package

```bash
npm run build -w @reactflo/core
npm run build -w @reactflo/react
npm run build -w @reactflo/types
```

### Watch Individual Package

```bash
npm run dev -w @reactflo/core
```

### Run Examples Only

```bash
cd packages/examples
npm run dev
```

### Run Documentation Site

```bash
cd packages/docs-site
mint dev --port 3333
# Open http://localhost:3333
```

## Clean Build

If you encounter issues, clean all build artifacts:

```bash
npm run clean
npm install
npm run build
npm run dev
```

## Configuration Changes

### What Changed

1. **Removed Vite Source Aliases**: Examples no longer uses `resolve.alias` to point to `src/` folders
2. **Package.json Exports**: Packages export `dist/index.js` and `dist/index.d.ts`
3. **Vite Watch Config**: Configured to watch `node_modules/@reactflo/*/dist`
4. **Concurrently**: Added to root package to orchestrate all watch processes

### Benefits

- ✅ Production-representative (consuming built packages)
- ✅ Proper TypeScript declaration files
- ✅ No Vite cache issues
- ✅ Works with any bundler (not Vite-specific)
- ✅ Fast feedback loop with watch mode
- ✅ Standard library development practice

## Troubleshooting

### Changes Not Reflecting?

1. Check that `npm run dev` is running (all 4 processes)
2. Look for TypeScript errors in the watch output
3. Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)

### TypeScript Errors?

- Watch output shows compile errors in real-time
- Fix errors in the package source
- TypeScript will automatically recompile

### Port Already in Use?

```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
npm run dev
```

## Best Practices

1. **Always use `npm run dev`** at the root for development
2. **Don't manually clear Vite cache** - it's no longer needed
3. **Check watch output** for TypeScript errors
4. **Test in production mode** periodically: `npm run build -w @reactflo/examples && npm run preview -w @reactflo/examples`
