# Troubleshooting Guide

Common issues and solutions when using KishEditor.

## Installation Issues

### Module Not Found

**Error**: `Cannot find module 'kish-editor'`

**Solutions**:
1. Verify installation:
   ```bash
   npm list kish-editor
   ```

2. Clear cache and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Check package.json:
   ```json
   {
     "dependencies": {
       "kish-editor": "^0.1.0"
     }
   }
   ```

### Peer Dependency Warnings

**Warning**: `kish-editor requires a peer of react@^18.3.1`

**Solutions**:
1. Install React 18+:
   ```bash
   npm install react@^18.3.1 react-dom@^18.3.1
   ```

2. Check React version:
   ```bash
   npm list react
   ```

## Styling Issues

### Styles Not Loading

**Problem**: Editor renders but has no styling

**Solutions**:
1. Import CSS:
   ```tsx
   import 'kish-editor/dist/style.css';
   ```

2. Check CSS import path:
   ```tsx
   // In your main entry file
   import 'kish-editor/dist/style.css';
   ```

3. Verify CSS file exists:
   ```bash
   ls node_modules/kish-editor/dist/style.css
   ```

### Custom Styles Not Applying

**Problem**: Custom CSS not overriding defaults

**Solutions**:
1. Increase specificity:
   ```css
   .my-editor .dual-mode-editor {
     /* Your styles */
   }
   ```

2. Use `!important` (not recommended):
   ```css
   .dual-mode-editor {
     border: 2px solid #ccc !important;
   }
   ```

3. Check CSS load order (your styles should load after)

## TypeScript Issues

### Type Errors

**Error**: `Property 'DualModeEditor' does not exist`

**Solutions**:
1. Check import:
   ```tsx
   import { DualModeEditor } from 'kish-editor';
   ```

2. Verify TypeScript version:
   ```bash
   npm list typescript
   # Should be 5.6+
   ```

3. Restart TypeScript server in your IDE

### Missing Type Definitions

**Error**: `Cannot find module 'kish-editor' or its type definitions`

**Solutions**:
1. Check `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "moduleResolution": "bundler",
       "esModuleInterop": true
     }
   }
   ```

2. Reinstall types:
   ```bash
   npm install --save-dev @types/react @types/react-dom
   ```

## Runtime Issues

### Editor Not Rendering

**Problem**: Component renders but editor is blank

**Solutions**:
1. Check height prop:
   ```tsx
   <DualModeEditor height="600px" />
   ```

2. Check container styles:
   ```css
   .editor-container {
     height: 600px;
     width: 100%;
   }
   ```

3. Check browser console for errors

### Preview Not Updating

**Problem**: Preview doesn't update when content changes

**Solutions**:
1. Check onChange callback:
   ```tsx
   <DualModeEditor
     onChange={(content) => {
       console.log('Content changed:', content);
       setContent(content);
     }}
   />
   ```

2. Check debounce delay:
   ```tsx
   <DualModeEditor previewDebounce={300} />
   ```

3. Verify content prop is updating

### Mode Switching Not Working

**Problem**: Can't switch between source and WYSIWYG modes

**Solutions**:
1. Check initialMode prop:
   ```tsx
   <DualModeEditor initialMode="wysiwyg" />
   ```

2. Check onModeChange callback:
   ```tsx
   <DualModeEditor
     onModeChange={(mode) => {
       console.log('Mode:', mode);
     }}
   />
   ```

3. Verify content is valid LaTeX

## Next.js Issues

### SSR Errors

**Error**: `window is not defined` or similar

**Solutions**:
1. Use dynamic import with `ssr: false`:
   ```tsx
   import dynamic from 'next/dynamic';

   const DualModeEditor = dynamic(
     () => import('kish-editor').then(mod => mod.DualModeEditor),
     { ssr: false }
   );
   ```

2. Use 'use client' directive:
   ```tsx
   'use client';

   import { DualModeEditor } from 'kish-editor';
   ```

### Hydration Mismatch

**Error**: Hydration failed because the initial UI does not match

**Solutions**:
1. Ensure SSR is disabled (see above)
2. Use client-only rendering
3. Check for browser-only APIs

## Performance Issues

### Slow Rendering

**Problem**: Editor is slow with large documents

**Solutions**:
1. Increase debounce delay:
   ```tsx
   <DualModeEditor previewDebounce={1000} />
   ```

2. Use code splitting:
   ```tsx
   const DualModeEditor = lazy(() => import('kish-editor'));
   ```

3. Optimize content processing

### Memory Leaks

**Problem**: Memory usage increases over time

**Solutions**:
1. Clean up on unmount:
   ```tsx
   useEffect(() => {
     return () => {
       // Cleanup
     };
   }, []);
   ```

2. Avoid storing large content in state
3. Use debouncing for frequent updates

## Math Rendering Issues

### Math Not Rendering

**Problem**: Math equations don't render in preview

**Solutions**:
1. Check math syntax:
   ```latex
   $inline math$ or $$display math$$
   ```

2. Check KaTeX support:
   ```tsx
   import 'katex/dist/katex.min.css';
   ```

3. Check renderer options:
   ```tsx
   const renderer = new LatexRenderer({
     throwOnError: false
   });
   ```

### Math Rendering Errors

**Problem**: Errors when rendering math

**Solutions**:
1. Enable error handling:
   ```tsx
   <DualModeEditor
     onPreviewError={(error) => {
       console.error('Math error:', error);
     }}
   />
   ```

2. Check math syntax validity
3. Use KaTeX-compatible syntax

## Build Issues

### Build Fails

**Error**: Build errors during compilation

**Solutions**:
1. Check TypeScript errors:
   ```bash
   npx tsc --noEmit
   ```

2. Clear build cache:
   ```bash
   rm -rf dist .next node_modules/.cache
   ```

3. Update dependencies:
   ```bash
   npm update
   ```

### Bundle Size Too Large

**Problem**: Bundle size is larger than expected

**Solutions**:
1. Use code splitting
2. Tree-shake unused code
3. Use dynamic imports
4. Check for duplicate dependencies

## Browser Compatibility

### Not Working in Older Browsers

**Problem**: Editor doesn't work in IE11 or older browsers

**Solutions**:
1. KishEditor requires modern browsers (Chrome, Firefox, Safari, Edge latest)
2. Use polyfills if needed
3. Consider browser support requirements

### Mobile Issues

**Problem**: Editor doesn't work well on mobile

**Solutions**:
1. Use responsive CSS:
   ```css
   @media (max-width: 768px) {
     .dual-mode-split-view {
       flex-direction: column;
     }
   }
   ```

2. Adjust height for mobile:
   ```tsx
   <DualModeEditor height="50vh" />
   ```

3. Consider mobile-specific UI

## Getting Help

### Debug Mode

Enable debug logging:

```tsx
<DualModeEditor
  onPreviewError={(error) => {
    console.error('Preview error:', error);
  }}
  onChange={(content) => {
    console.log('Content:', content);
  }}
/>
```

### Common Debugging Steps

1. Check browser console for errors
2. Verify all dependencies are installed
3. Check React version compatibility
4. Verify TypeScript configuration
5. Test in isolation (minimal example)

### Reporting Issues

When reporting issues, include:
- KishEditor version
- React version
- Browser and version
- Error messages
- Minimal reproduction code
- Steps to reproduce

For more help, check:
- [GitHub Issues](https://github.com/your-repo/kish-editor/issues)
- [Documentation](../README.md)
- [Examples](./usage-examples.md)

