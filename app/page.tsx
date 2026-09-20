"use client";

import Link from "next/link";
import { ArrowRight, FlaskConical, Library } from "lucide-react";
import { chapters, totalMinutes } from "@/data/chapters";
import { useCourseProgress } from "@/components/CourseProgress";
import { HomeMembraneLab } from "@/components/HomeMembraneLab";
import { papers } from "@/data/papers";

const labNames = ["Spike Train", "LIF Simulator", "Spike Encoding", "Surrogate", "BPTT", "ANN vs SNN", "Event Camera"];

export default function Home() {
  const { isComplete, completed } = useCourseProgress();
  const nextChapter = chapters.find(chapter => !completed.includes(chapter.slug));
  const primaryHref = nextChapter ? `/course/${nextChapter.slug}/` : "/finish/";
  const primaryLabel = completed.length === 0 ? "按顺序开始" : nextChapter ? `继续：${nextChapter.title}` : "查看完成页";
  return (
    <div className="page-shell">
      <section className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">从一个问题开始</div>
          <h1>一个神经元，<br/>为什么要<span>记住过去？</span></h1>
          <p className="hero-lead">普通神经网络把输入映射成输出；脉冲神经元还要携带上一时刻的状态。先观察膜电位怎样积累、泄漏与发放，再进入公式。</p>
          <div className="hero-actions">
            <Link className="button" href={primaryHref}>{primaryLabel} <ArrowRight size={17} aria-hidden="true" /></Link>
            <Link className="button secondary" href="/labs/"><FlaskConical size={17} aria-hidden="true" /> 自由实验</Link>
          </div>
        </div>
        <div className="hero-panel"><HomeMembraneLab /></div>
      </section>

      <div className="course-facts"><span><b>{chapters.length}</b> 个递进章节</span><span><b>7</b> 个可操作实验</span><span><b>{totalMinutes}</b> 分钟核心路径</span><span><b>{papers.length}</b> 篇核验论文</span></div>

      <div className="section-head">
        <span className="folio">01</span>
        <h2>学习路径</h2>
        <p>每章都从直觉进入数学，再落到代码、实验、误区与研究连接。</p>
      </div>
      <section className="roadmap">
        {chapters.map(chapter => (
          <Link className="chapter-row" href={`/course/${chapter.slug}/`} key={chapter.slug}>
            <span className="chapter-number">{String(chapter.number).padStart(2,"0")}</span>
            <div className="chapter-title">
              <h3>{chapter.title}</h3>
              <span>{chapter.subtitle}</span>
            </div>
            <span className="chapter-goal">{chapter.intuition[0]}</span>
            <span className="chapter-meta">
              <i className={`done-dot ${isComplete(chapter.slug) ? "complete" : ""}`} />
              {chapter.minutes} min
            </span>
          </Link>
        ))}
      </section>

      <div className="section-head">
        <span className="folio">02</span>
        <h2>实验室</h2>
        <p>参数变化立即反馈。先做预测，再移动滑块，而不是把图表当装饰。</p>
      </div>
      <section className="home-labs">
        {labNames.map((name, i) => (
          <Link className="lab-chip" href={`/labs/?lab=${i+1}`} key={name}>
            <b>{String(i+1).padStart(2,"0")}</b><span>{name}</span>
          </Link>
        ))}
      </section>

      <div className="section-head">
        <span className="folio">03</span>
        <h2>读论文之前</h2>
        <p>课程把“理论正确”“训练可行”“硬件高效”拆开讨论。</p>
      </div>
      <section className="principles">
        <div className="principle"><h3>Forward ≠ Backward</h3><p>Surrogate gradient 的核心是前向仍发放真实 spike，反向才使用局部替代导数。</p></div>
        <div className="principle"><h3>Event Camera ≠ SNN</h3><p>事件流可进入 SNN，也可聚合成 event frame、voxel grid 后交给 CNN 或 Transformer。</p></div>
        <div className="principle"><h3>Ops ≠ Energy</h3><p>稀疏 AC 的理论优势只有在实际执行跳过零值、减少数据移动时才可能兑现。</p></div>
      </section>
      <div className="hero-actions" style={{ padding: "34px 0 80px" }}>
        <Link className="button" href="/papers/"><Library size={17} aria-hidden="true"/> 浏览已核验论文库</Link>
        <Link className="button secondary" href="/code-lab/">进入完整代码实验</Link>
      </div>
    </div>
  );
}
