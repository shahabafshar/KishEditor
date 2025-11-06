# Installation Guide

Complete guide for installing KishEditor in your project.

## Prerequisites

- **Node.js**: Version 16 or higher
- **npm/yarn/pnpm**: Package manager
- **React**: Version 18 or higher (for React projects)

## Installation Methods

### npm

```bash
npm install kish-editor
```

### yarn

```bash
yarn add kish-editor
```

### pnpm

```bash
pnpm add kish-editor
```

## Peer Dependencies

KishEditor requires the following peer dependencies (usually installed automatically):

- `react`: ^18.3.1
- `react-dom`: ^18.3.1

If these aren't installed, install them:

```bash
npm install react react-dom
```

## Import Styles

After installation, import the CSS styles:

```typescript
import 'kish-editor/dist/style.css';
```

Or in your main CSS file:

```css
@import 'kish-editor/dist/style.css';
```

## Verify Installation

Create a simple test component:

```tsx
import React from 'react';
import { DualModeEditor } from 'kish-editor';
import 'kish-editor/dist/style.css';

function Test() {
  return (
    <DualModeEditor
      initialContent="\\section{Hello}"
      height="400px"
    />
  );
}

export default Test;
```

If the editor renders, installation is successful!

## TypeScript Support

TypeScript definitions are included automatically. No additional installation needed.

If you're using TypeScript, ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "esModuleInterop": true
  }
}
```

## Framework-Specific Installation

### Next.js

No special installation needed. Use dynamic imports for SSR:

```tsx
import dynamic from 'next/dynamic';

const DualModeEditor = dynamic(
  () => import('kish-editor').then(mod => mod.DualModeEditor),
  { ssr: false }
);
```

### Create React App

Works out of the box:

```bash
npx create-react-app my-app
cd my-app
npm install kish-editor
```

### Vite

Works out of the box:

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm install kish-editor
```

## Troubleshooting

### Module Not Found

**Error**: `Cannot find module 'kish-editor'`

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Styles Not Loading

**Problem**: Editor renders but styles are missing

**Solution**: Ensure you've imported the CSS:

```typescript
import 'kish-editor/dist/style.css';
```

### TypeScript Errors

**Problem**: Type errors after installation

**Solution**: 
1. Ensure TypeScript version is 5.6+
2. Check `tsconfig.json` configuration
3. Restart your IDE/TypeScript server

### Build Errors

**Problem**: Build fails with errors

**Solution**:
```bash
# Clear all caches
rm -rf node_modules dist .next
npm install
npm run build
```

## Version Compatibility

### React Versions

- **React 18.0+**: Fully supported
- **React 17**: May work but not officially supported
- **React 16**: Not supported

### TypeScript Versions

- **TypeScript 5.6+**: Fully supported
- **TypeScript 5.0-5.5**: Should work
- **TypeScript 4.x**: May have issues

### Node.js Versions

- **Node.js 18+**: Recommended
- **Node.js 16**: Supported
- **Node.js 14**: Not supported

## Next Steps

After installation:

1. **Read Getting Started**: [Getting Started Guide](../overview/getting-started.md)
2. **Check Examples**: [Usage Examples](./usage-examples.md)
3. **Integration**: [Integration Guide](./integration.md)
4. **Customization**: [Customization Guide](./customization.md)

## Uninstallation

To remove KishEditor:

```bash
npm uninstall kish-editor
```

Or:

```bash
yarn remove kish-editor
```

## Updating

To update to the latest version:

```bash
npm update kish-editor
```

Or:

```bash
npm install kish-editor@latest
```

Check the [changelog](../../CHANGELOG.md) for breaking changes before updating.

