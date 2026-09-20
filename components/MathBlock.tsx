import katex from "katex";

export function MathBlock({ latex }: { latex: string }) {
  const html = katex.renderToString(latex, { displayMode: true, throwOnError: false, strict: false });
  return <div className="math-block" dangerouslySetInnerHTML={{ __html: html }} />;
}
