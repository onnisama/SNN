"use client";

import { useEffect, useState } from "react";
import { categories, papers } from "@/data/papers";
import { ExternalLink } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

function difficulty(category: string, level: string) {
  if (category === "Hardware" || category === "Transformer") return "进阶";
  return level === "Essential" ? "入门—中等" : level === "Recommended" ? "中等" : "进阶选读";
}

function readingOrder(category: string) {
  const order: Record<string,string> = {
    Foundations:"先读 LIF、Surrogate Gradient 章节",
    Training:"先读 Surrogate Gradient 与 BPTT",
    Architecture:"先读 Convolutional SNN 与残差网络",
    Transformer:"先读 Modern Deep SNN，再按 Spikformer → Spike-driven Transformer",
    Conversion:"先读 ANN-to-SNN Conversion",
    "Neuron Dynamics":"先读 LIF 与 Temporal Dynamics",
    "Event Vision":"先读 Event Camera × SNN",
    Vision:"先读 Convolutional SNN 与 Event Camera",
    Hardware:"最后阅读，先完成 Efficiency 章节"
  };
  return order[category] ?? "完成基础章节后阅读";
}

export function PapersLibrary() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const requested = searchParams.get("category");
  const [category,setCategory]=useState(categories.includes(requested ?? "") ? requested! : "全部"),[open,setOpen]=useState<string|null>(null);
  useEffect(() => {
    setCategory(categories.includes(requested ?? "") ? requested! : "全部");
  }, [requested]);
  const shown=category==="全部"?papers:papers.filter(p=>p.category===category);
  return <section id="library">
    <div className="section-head"><span className="folio">LIB</span><h2>论文索引</h2><p>{shown.length} 篇 · 按问题而不是模型名阅读。</p></div>
    <div className="paper-toolbar">{categories.map(item=><button key={item} aria-pressed={category===item} className={category===item?"active":""} onClick={()=>{setCategory(item);router.replace(item==="全部"?"/papers/#library":`/papers/?category=${encodeURIComponent(item)}#library`,{scroll:false})}}>{item}</button>)}</div>
    <div className="paper-list">
      {shown.map(p=><article className="paper-card" key={p.id}>
        <div className="paper-meta"><span className="level">{p.level}</span><br/>{p.year}<br/>{p.venue}<br/>CCF {p.ccf}<br/>{p.category}</div>
        <div className="paper-main"><h3>{p.title}</h3><p>{p.authors}</p><b>Problem</b><p>{p.problem}</p></div>
        <div className="paper-why"><b>Core idea</b><p>{p.idea}</p><b>Why it matters</b><p>{p.why}</p><b>Prerequisites</b><p>{p.prerequisites}</p><div className="paper-study-meta"><span>难度：{difficulty(p.category,p.level)}</span><span>顺序：{readingOrder(p.category)}</span></div></div>
        <div className="paper-links"><a href={p.paper} target="_blank" rel="noreferrer">Paper <ExternalLink size={12} aria-hidden="true"/></a>{p.code&&<a href={p.code} target="_blank" rel="noreferrer">Code <ExternalLink size={12} aria-hidden="true"/></a>}{p.guide&&<button aria-expanded={open===p.id} className="guide-toggle" onClick={()=>setOpen(open===p.id?null:p.id)}>{open===p.id?"收起导读":"深度导读"}</button>}</div>
        {p.guide&&open===p.id&&<div className="reading-guide"><h3>Reading Guide</h3><div className="guide-grid"><div><b>1–2 · 问题与前人限制</b><p>{p.problem} {p.guide.prior}</p></div><div><b>3–4 · 核心 idea 与架构</b><p>{p.idea} {p.guide.architecture}</p></div><div><b>5 · 最重要的公式</b><p>{p.guide.formula}</p></div><div><b>6 · 实验证据</b><p>{p.guide.evidence}</p></div><div><b>7 · Limitations</b><p>{p.guide.limitation}</p></div><div><b>8 · 记住三点</b><ol>{p.guide.remember.map(x=><li key={x}>{x}</li>)}</ol></div></div></div>}
      </article>)}
    </div>
  </section>
}
