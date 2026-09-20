import { notFound } from "next/navigation";
import Link from "next/link";
import { chapters } from "@/data/chapters";
import { MathBlock } from "@/components/MathBlock";
import { ChapterQuiz } from "@/components/ChapterQuiz";
import { CompleteChapter } from "@/components/CompleteChapter";
import { ChapterDeepDive } from "@/components/ChapterDeepDive";
import { deepDives } from "@/data/deepDives";
import { extraQuizzes } from "@/data/extraQuizzes";

export function generateStaticParams() {
  return chapters.map(chapter => ({ slug: chapter.slug }));
}

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = chapters.find(item => item.slug === slug);
  if (!chapter) notFound();
  const next = chapters[chapter.number] ?? null;
  const previous = chapters[chapter.number - 2] ?? null;
  const sections = ["intuitive","why","math","visualization","walkthrough","code","experiment","mistakes","research","quiz"];
  return (
    <div className="page-shell">
      <header className="content-header">
        <span className="big-number">{String(chapter.number).padStart(2,"0")}</span>
        <div><h1>{chapter.title}</h1><p>{chapter.subtitle}</p></div>
        <div className="meta-stack"><div>{chapter.minutes} MIN</div><div>CHAPTER {chapter.number}/12</div></div>
      </header>
      <div className="chapter-layout">
        <nav className="chapter-toc" aria-label="本章目录">
          {["直觉","为什么","数学","关键概念","机制推演","代码","实验","常见误区","研究连接","Checkpoint"].map((label,i)=><a key={label} href={`#${sections[i]}`}>{String(i+1).padStart(2,"0")} {label}</a>)}
        </nav>
        <article className="chapter-article">
          <section id="intuitive"><h2>Intuition · 直觉</h2><div className="intuition-block">{chapter.intuition.map(p=><p key={p}>{p}</p>)}</div></section>
          <section id="why"><h2>Why · 为什么需要它</h2><p>{chapter.why}</p></section>
          <section id="math"><h2>Math · 从公式读机制</h2>{chapter.math.map(item=><div className="math-card" key={item.label}><header>{item.label}</header><MathBlock latex={item.latex}/><p>{item.explain}</p></div>)}</section>
          <section id="visualization"><h2>Visualization · 关键概念</h2><div className="concept-grid">{chapter.concepts.map(item=><div className="concept" key={item.title}><h3>{item.title}</h3><p>{item.body}</p></div>)}</div></section>
          <section id="walkthrough"><h2>Mechanism Walkthrough · 把机制走一遍</h2><ChapterDeepDive items={deepDives[chapter.slug] ?? []}/></section>
          <section id="code"><h2>Code · 对应实现</h2>{chapter.code ? <pre><code>{chapter.code}</code></pre> : <div className="callout">本章的可运行机制已放入对应交互实验；代码实验页提供完整训练程序。</div>}</section>
          <section id="experiment"><h2>Experiment · 动手验证</h2><div className="callout">{chapter.experiment}<p style={{marginBottom:0,marginTop:12}}><Link href="/labs/" style={{textDecoration:"underline"}}>打开交互实验室 →</Link></p></div></section>
          <section id="mistakes"><h2>Common Mistakes · 常见误区</h2><div className="callout warning">{chapter.mistake}</div></section>
          <section id="research"><h2>Research Connection</h2><div className="callout research">{chapter.research}<p style={{marginBottom:0,marginTop:12}}><Link href="/papers/" style={{textDecoration:"underline"}}>进入论文库 →</Link></p></div></section>
          <section id="quiz"><h2>Checkpoint</h2><ChapterQuiz quizzes={[chapter.quiz, ...(extraQuizzes[chapter.slug] ?? [])]}/></section>
          <nav className="chapter-navigation" aria-label="章节翻页">
            {previous ? <Link className="button secondary" href={`/course/${previous.slug}/`}>← 上一章：{previous.title}</Link> : <Link className="button secondary" href="/">← 返回学习路线</Link>}
            {next ? <Link className="button" href={`/course/${next.slug}/`}>下一章：{next.title} →</Link> : <Link className="button" href="/finish/">完成课程，选择研究方向 →</Link>}
          </nav>
        </article>
        <aside className="aside-note"><b>学习提示</b>先在移动参数前写下预测。SNN 的理解来自逐时间步追踪状态，而不是记住术语。<CompleteChapter slug={chapter.slug}/></aside>
      </div>
    </div>
  );
}
