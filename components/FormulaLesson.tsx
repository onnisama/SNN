import { MathBlock } from "@/components/MathBlock";
import type { FormulaGuide } from "@/data/formulaGuides";

type Props = {
  index: number;
  total: number;
  label: string;
  latex: string;
  summary: string;
  guide?: FormulaGuide;
};

export function FormulaLesson({ index, total, label, latex, summary, guide }: Props) {
  return <article className="math-card">
    <header>
      <span>公式 {index + 1} / {total}</span>
      <b>{label}</b>
    </header>
    <MathBlock latex={latex}/>
    <div className="formula-lesson">
      <section className="formula-reading">
        <span>先用一句话读懂</span>
        <p>{guide?.reading ?? summary}</p>
      </section>
      {guide?.symbols && <section className="formula-section">
        <h3>符号分别是谁</h3>
        <dl className="symbol-list">
          {guide.symbols.map(item => <div key={item.symbol}><dt>{item.symbol}</dt><dd>{item.meaning}</dd></div>)}
        </dl>
      </section>}
      {guide?.steps && <section className="formula-section">
        <h3>按这个顺序计算</h3>
        <ol className="formula-steps">
          {guide.steps.map(step => <li key={step}>{step}</li>)}
        </ol>
      </section>}
      {guide?.example && <section className="worked-example">
        <h3>代入一组数</h3>
        <p>{guide.example}</p>
      </section>}
      {guide?.code && <section className="formula-code">
        <h3>落到代码就是</h3>
        <code>{guide.code}</code>
      </section>}
      {guide?.caution && <aside className="formula-caution"><b>这里最容易误解</b><p>{guide.caution}</p></aside>}
    </div>
  </article>;
}
