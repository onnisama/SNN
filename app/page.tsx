"use client";

import Link from "next/link";
import { ArrowRight, FlaskConical, Library } from "lucide-react";
import { chapters, totalMinutes } from "@/data/chapters";
import { useCourseProgress } from "@/components/CourseProgress";

const labNames = ["Spike Train", "LIF Simulator", "Spike Encoding", "Surrogate", "BPTT", "ANN vs SNN", "Event Camera"];

export default function Home() {
  const { isComplete } = useCourseProgress();
  return (
    <div className="page-shell">
      <section className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">Interactive course · 中文</div>
          <h1>SNN<span>Foundations</span></h1>
          <p className="hero-lead">从“神经元为什么要有状态”开始，沿时间轴理解 LIF、Surrogate Gradient、BPTT、事件视觉与现代 Spiking Transformer。</p>
          <div className="hero-actions">
            <Link className="button" href="/course/ann-vs-snn/">开始第一章 <ArrowRight size={17} /></Link>
            <Link className="button secondary" href="/labs/"><FlaskConical size={17} /> 进入实验室</Link>
          </div>
        </div>
        <div className="hero-panel">
          <div className="hero-stat">
            <strong>12</strong>
            <span>章 · {totalMinutes} 分钟核心学习路径</span>
          </div>
          <div className="signal-panel" aria-label="脉冲序列示意">
            {[0,1,2,3,4].map((row) => (
              <div className="signal-row" key={row}>
                <span>n{row+1}</span>
                <div className="spike-track">
                  {Array.from({ length: 18 }, (_, i) => <i key={i} style={{ height: ((i * 7 + row * 5) % (6 + row) === 0) ? `${14 + row * 3}px` : "0px" }} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
        <Link className="button" href="/papers/"><Library size={17}/> 浏览已核验论文库</Link>
        <Link className="button secondary" href="/code-lab/">进入完整代码实验</Link>
      </div>
    </div>
  );
}
