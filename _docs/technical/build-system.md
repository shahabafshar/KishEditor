# Build System

This document describes KishEditor's build system and configuration.

## Build Tools

### Vite

**Version**: ^6.0.3

**Purpose**: Build tool, dev server, and bundler

**Configuration File**: `vite.config.ts`

**Modes**:
1. **Library Mode** (`--mode lib`): Builds as reusable library
2. **Demo Mode** (default): Builds demo application

## Build Configuration

### Library Build

**Command**: `npm run build:lib`

**Configuration**:
```typescript
build: {
  lib: {
    entry: resolve(__dirname, 'src/index.ts'),
    name: 'KishEditor',
    fileName: (format) => `kish-editor.${format}.js`,
    formats: ['es', 'umd']
  },
  rollupOptions: {
    external: ['react', 'react-dom'],
    output: {
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM'
      }
    }
  }
}
```

**Output**:
- `dist/kish-editor.es.js` - ES module format
- `dist/kish-editor.umd.js` - UMD format
- `dist/index.d.ts` - TypeScript declarations
- `dist/style.css` - Compiled styles

### Demo Build

**Command**: `npm run build`

**Configuration**:
- Entry: `src/demo/main.tsx`
- Output: `dist/` directory
- Includes all dependencies
- Optimized for production

**Output**:
- `dist/index.html` - HTML entry point
- `dist/assets/` - Bundled JavaScript and CSS
- Optimized and minified

## TypeScript Configuration

### tsconfig.json

**Key Settings**:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "strict": true,
    "declaration": true,
    "declarationDir": "./dist"
  }
}
```

**Features**:
- ES2020 target
- ESNext modules
- React JSX transform
- Strict type checking
- Declaration file generation

## Build Scripts

### Development

```bash
npm run dev
```

**What it does**:
- Starts Vite dev server
- Enables HMR (Hot Module Replacement)
- Serves demo application
- Opens at `http://localhost:5173`

### Production Build

```bash
npm run build
```

**What it does**:
- Builds demo application
- Optimizes and minifies
- Generates production assets

### Library Build

```bash
npm run build:lib
```

**What it does**:
- Builds library package
- Generates TypeScript declarations
- Creates UMD and ES module formats
- Externalizes React dependencies

### Preview

```bash
npm run preview
```

**What it does**:
- Serves production build locally
- Tests production build
- Useful for testing before deployment

### Linting

```bash
npm run lint
```

**What it does**:
- Runs ESLint on TypeScript files
- Reports errors and warnings
- Enforces code quality

## Build Process

### Library Build Process

```
1. TypeScript Compilation
   ├── Compile .ts/.tsx files
   ├── Generate .d.ts files
   └── Output to dist/
   
2. Vite Library Build
   ├── Bundle entry point (src/index.ts)
   ├── Externalize React/ReactDOM
   ├── Generate ES module
   └── Generate UMD module
   
3. CSS Processing
   ├── Process CSS files
   ├── Bundle styles
   └── Output to dist/style.css
   
4. TypeScript Declarations
   ├── Generate .d.ts files
   └── Output to dist/
```

### Demo Build Process

```
1. TypeScript Compilation
   ├── Compile all source files
   └── Type checking
   
2. Vite Build
   ├── Bundle application
   ├── Process CSS
   ├── Optimize assets
   └── Generate HTML
   
3. Optimization
   ├── Code splitting
   ├── Tree shaking
   ├── Minification
   └── Asset optimization
```

## Dependencies

### External Dependencies (Library Build)

These are externalized in library builds:
- `react`
- `react-dom`

**Reason**: Consumers provide their own React version

### Bundled Dependencies

These are included in library builds:
- CodeMirror 6
- Tiptap
- MathLive
- KaTeX
- LaTeX.js

**Reason**: Core functionality dependencies

## Output Structure

### Library Build Output

```
dist/
├── kish-editor.es.js       # ES module
├── kish-editor.umd.js      # UMD module
├── index.d.ts              # TypeScript declarations
├── style.css               # Compiled styles
└── [other .d.ts files]     # Additional type definitions
```

### Demo Build Output

```
dist/
├── index.html              # Entry HTML
├── assets/
│   ├── index-[hash].js     # Bundled JavaScript
│   ├── index-[hash].css    # Bundled CSS
│   └── [other assets]      # Fonts, images, etc.
```

## Development Workflow

### Local Development

1. **Start Dev Server**:
   ```bash
   npm run dev
   ```

2. **Make Changes**:
   - Edit source files
   - HMR updates automatically

3. **Test Changes**:
   - Browser auto-refreshes
   - See changes immediately

### Building for Distribution

1. **Build Library**:
   ```bash
   npm run build:lib
   ```

2. **Check Output**:
   - Verify `dist/` directory
   - Check TypeScript declarations
   - Test in consuming project

3. **Publish** (if applicable):
   ```bash
   npm publish
   ```

## Build Optimizations

### Code Splitting

- Components can be lazy-loaded
- Large libraries load on demand
- Reduces initial bundle size

### Tree Shaking

- Unused code is eliminated
- Only imported code is bundled
- Reduces final bundle size

### Minification

- JavaScript minified
- CSS minified
- Source maps generated (dev mode)

### Asset Optimization

- Images optimized
- Fonts subsetted
- Assets compressed

## Environment Variables

### Development

- `NODE_ENV=development`
- Source maps enabled
- HMR enabled

### Production

- `NODE_ENV=production`
- Minification enabled
- Optimizations enabled

## Troubleshooting Build Issues

### TypeScript Errors

**Problem**: Type errors during build

**Solution**:
```bash
# Check TypeScript config
npx tsc --noEmit

# Fix type errors
# Update tsconfig.json if needed
```

### Build Failures

**Problem**: Build fails with errors

**Solution**:
```bash
# Clear cache
rm -rf node_modules dist
npm install

# Rebuild
npm run build:lib
```

### Missing Dependencies

**Problem**: Module not found errors

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Declaration File Issues

**Problem**: `.d.ts` files not generated

**Solution**:
- Check `tsconfig.json` has `declaration: true`
- Ensure `vite-plugin-dts` is configured
- Check build mode is `lib`

## CI/CD Considerations

### Build Commands

```yaml
# Example GitHub Actions
- run: npm ci
- run: npm run build:lib
- run: npm run lint
```

### Testing Build

```bash
# Test library build
npm run build:lib

# Test in consuming project
cd ../test-project
npm install ../KishEditor
npm run build
```

## Package.json Configuration

### Main Entry Points

```json
{
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"]
}
```

### Build Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:lib": "tsc && vite build --mode lib",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx"
  }
}
```

For more details on the build output, see the generated files in the `dist/` directory after building.

