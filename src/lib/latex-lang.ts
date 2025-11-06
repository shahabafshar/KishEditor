import { StreamLanguage } from '@codemirror/language';
import type { StreamParser } from '@codemirror/language';

/**
 * Simple LaTeX language support for CodeMirror
 * Provides syntax highlighting for LaTeX commands, environments, and comments
 */

interface LatexState {
  inMath: boolean;
  inComment: boolean;
}

const latexParser: StreamParser<LatexState> = {
  token(stream, state) {
    // Comments
    if (stream.match(/^%.*$/)) {
      return 'comment';
    }

    // Math mode: $ ... $ or $$ ... $$
    if (stream.match('$$')) {
      state.inMath = !state.inMath;
      return 'keyword';
    }
    if (stream.match('$')) {
      state.inMath = !state.inMath;
      return 'keyword';
    }

    if (state.inMath) {
      stream.next();
      return 'string';
    }

    // Commands: \command
    if (stream.match(/^\\[a-zA-Z@]+/)) {
      return 'keyword';
    }

    // Special characters
    if (stream.match(/^[{}[\]]/)) {
      return 'bracket';
    }

    // Environments: \begin{} \end{}
    if (stream.match(/^\\(begin|end)\{[^}]*\}/)) {
      return 'atom';
    }

    // Default: advance one character
    stream.next();
    return null;
  },

  startState() {
    return {
      inMath: false,
      inComment: false
    };
  },

  copyState(state) {
    return {
      inMath: state.inMath,
      inComment: state.inComment
    };
  }
};

export const latex = () => StreamLanguage.define(latexParser);
