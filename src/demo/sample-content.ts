/**
 * Sample LaTeX documents for the demo
 */

export const sampleArticle = `\\documentclass{article}
\\usepackage{amsmath}

\\title{Sample LaTeX Document}
\\author{Your Name}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Introduction}

This is a sample LaTeX document demonstrating the capabilities of the client-side Overleaf clone.

\\section{Mathematical Expressions}

Here's an inline equation: $E = mc^2$

And here's a display equation:

$$\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$

\\subsection{Matrix Example}

$$
\\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix}
$$

\\section{Lists}

\\subsection{Unordered List}

\\begin{itemize}
\\item First item
\\item Second item
\\item Third item with some \\textbf{bold text}
\\end{itemize}

\\subsection{Ordered List}

\\begin{enumerate}
\\item First step
\\item Second step
\\item Third step with \\textit{italic text}
\\end{enumerate}

\\section{Text Formatting}

This paragraph demonstrates various text formatting options:
\\textbf{bold text}, \\textit{italic text}, \\underline{underlined text},
and \\texttt{monospace text}.

\\section{Conclusion}

This demonstrates the basic features of the LaTeX editor. More complex
features can be added as needed.

\\end{document}
`;

export const sampleMath = `\\documentclass{article}
\\usepackage{amsmath}

\\begin{document}

\\section{Mathematical Formulas}

\\subsection{Fractions and Roots}

Inline: $\\frac{a}{b}$ and $\\sqrt{x^2 + y^2}$

Display:
$$\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

\\subsection{Summations and Products}

$$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$

$$\\prod_{i=1}^{n} i = n!$$

\\subsection{Integrals}

$$\\int_{a}^{b} f(x) dx$$

$$\\oint_{C} \\vec{F} \\cdot d\\vec{r}$$

\\subsection{Limits}

$$\\lim_{x \\to \\infty} \\frac{1}{x} = 0$$

\\subsection{Greek Letters}

$\\alpha, \\beta, \\gamma, \\delta, \\epsilon, \\theta, \\lambda, \\mu, \\pi, \\sigma, \\omega$

\\end{document}
`;

export const simpleExample = `\\documentclass{article}

\\begin{document}

\\section{Hello World}

This is a simple LaTeX document.

The famous equation: $E = mc^2$

And the Pythagorean theorem:
$$a^2 + b^2 = c^2$$

\\textbf{Bold text} and \\textit{italic text}.

\\end{document}
`;
