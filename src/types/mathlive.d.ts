/**
 * TypeScript declarations for MathLive custom elements
 */

declare namespace JSX {
  interface IntrinsicElements {
    'math-field': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        ref?: React.Ref<any>;
        'read-only'?: boolean;
        'virtual-keyboard-mode'?: string;
      },
      HTMLElement
    >;
  }
}
