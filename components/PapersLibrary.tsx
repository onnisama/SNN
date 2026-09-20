"use client";

import { useState } from "react";
import { categories, papers } from "@/data/papers";
import { ExternalLink } from "lucide-react";

export function PapersLibrary() {
  const [category,setCategory]=useState("全部"),[open,setOpen]=useState<string|null>(null);
  const shown=category==="全部"?papers:papers.filter(p=>p.category===category);
  return <section id="library">
    <div className="section-head"><span className="folio">LIB</span><h2>论文索引</h2><p>{shown.length} 篇 · 按问题而不是模型名阅读。</p></div>
    <div className="paper-toolbar">{categories.map(item=><button key={item} className={category===item?"active":""} onClick={()=>setCategory(item)}>{item}</button>)}</div>
    <div className="paper-list">
      {shown.map(p=><article className="paper-card" key={p.id}>
        <div className="paper-meta"><span className="level">{p.level}</span><br/>{p.year}<br/>{p.venue}<br/>CCF {p.ccf}<br/>{p.category}</div>
        <div className="paper-main"><h3>{p.title}</h3><p>{p.authors}</p><b>Problem</b><p>{p.problem}</p></div>
        <div className="paper-why"><b>Core idea</b><p>{p.idea}</p><b>Why it matters</b><p>{p.why}</p><b>Prerequisites</b><p>{p.prerequisites}</p></div>
        <div className="paper-links"><a href={p.paper} target="_blank" rel="noreferrer">Paper <ExternalLink size={12}/></a>{p.code&&<a href={p.code} target="_blank" rel="noreferrer">Code <ExternalLink size={12}/></a>}{p.guide&&<button className="guide-toggle" onClick={()=>setOpen(open===p.id?null:p.id)}>{open===p.id?"收起导读":"深度导读"}</button>}</div>
        {p.guide&&open===p.id&&<div className="reading-guide"><h3>Reading Guide</h3><div className="guide-grid"><div><b>1–2 · 问题与前人限制</b><p>{p.problem} {p.guide.prior}</p></div><div><b>3–4 · 核心 idea 与架构</b><p>{p.idea} {p.guide.architecture}</p></div><div><b>5 · 最重要的公式</b><p>{p.guide.formula}</p></div><div><b>6 · 实验证据</b><p>{p.guide.evidence}</p></div><div><b>7 · Limitations</b><p>{p.guide.limitation}</p></div><div><b>8 · 记住三点</b><ol>{p.guide.remember.map(x=><li key={x}>{x}</li>)}</ol></div></div></div>}
      </article>)}
    </div>
  </section>
}
