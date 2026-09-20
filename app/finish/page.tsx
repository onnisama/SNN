import Link from "next/link";

const abilities = [
  "解释 SNN 与 ANN 的本质差别，而不是只说“输出是 0/1”",
  "从连续方程推到离散 LIF，并说明 β、阈值与 reset",
  "比较 rate、latency、temporal 与 population coding",
  "解释 surrogate gradient 与 BPTT 的完整梯度路径",
  "读懂 [T,B,C,H,W] 和基础 Spiking CNN 前向传播",
  "区分事件流、event frame、voxel grid 与下游网络",
  "比较 direct training 与 ANN-to-SNN conversion",
  "审慎判断 SNN 能效结论是否真的被硬件证据支持"
];

const tracks = [
  { title:"Event-based Vision", text:"继续研究事件表示、检测、光流与 SNN–ANN 混合系统。", href:"/papers/?category=Event%20Vision#library", start:"先读 Event-based Vision: A Survey 与 SpikeSlicer" },
  { title:"Spiking Transformer", text:"比较 Spikformer、Spike-driven Transformer 与硬件友好 token mixer。", href:"/papers/?category=Transformer#library", start:"先画出三篇方法的算子级差异表" },
  { title:"SNN Training", text:"深入 surrogate、online learning、rate-based backprop 与梯度稳定性。", href:"/papers/?category=Training#library", start:"先复现不同 surrogate slope 的消融" },
  { title:"Neuromorphic Hardware", text:"从 Loihi、TrueNorth、SpiNNaker 理解算法约束如何映射到芯片。", href:"/papers/?category=Hardware#library", start:"先区分芯片内核、通信网络与测量边界" }
];

export default function FinishPage() {
  return <div className="page-shell finish-page">
    <header className="content-header">
      <span className="big-number">FIN</span>
      <div><h1>You Finished<br/>SNN Foundations</h1><p>完成不等于记住全部术语，而是已经拥有继续读论文、做实验和判断证据的基础框架。</p></div>
      <div className="meta-stack">12 CHAPTERS<br/>NEXT: RESEARCH</div>
    </header>
    <section className="finish-abilities">
      <div><span className="eyebrow">现在你应该能够</span><h2>用自己的话解释，<br/>用代码验证。</h2></div>
      <ol>{abilities.map((ability,index)=><li key={ability}><span>{String(index+1).padStart(2,"0")}</span><p>{ability}</p></li>)}</ol>
    </section>
    <div className="section-head"><span className="folio">NEXT</span><h2>选择一条研究支线</h2><p>不要同时追四条线。先选一条，读两篇代表论文，复现一个最小实验。</p></div>
    <section className="research-tracks">{tracks.map((track,index)=><Link key={track.title} href={track.href} className="research-track"><span>TRACK {String.fromCharCode(65+index)}</span><h3>{track.title}</h3><p>{track.text}</p><b>{track.start}</b></Link>)}</section>
    <div className="finish-actions"><Link className="button" href="/code-lab/">开始 Final Mini Project →</Link><Link className="button secondary" href="/">返回学习路线</Link></div>
  </div>;
}
