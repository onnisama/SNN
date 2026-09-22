"use client";

import { useMemo, useState } from "react";

function simulateTrace(current: number, beta: number, threshold: number) {
  let membrane = 0;
  return Array.from({ length: 18 }, (_, t) => {
    const input = t < 2 ? 0 : current;
    membrane = beta * membrane + input;
    const beforeReset = membrane;
    const spike = membrane >= threshold;
    if (spike) membrane -= threshold;
    return { t, input, mem: beforeReset, spike };
  });
}

export function HomeMembraneLab() {
  const [current, setCurrent] = useState(0.32);
  const [beta, setBeta] = useState(0.82);
  const threshold = 1;
  const trace = useMemo(() => simulateTrace(current, beta, threshold), [current, beta]);
  const path = trace.map((p, i) => `${i ? "L" : "M"} ${(28 + i * 25.4).toFixed(1)} ${(164 - Math.min(1.25, p.mem) * 100).toFixed(2)}`).join(" ");

  return (
    <div className="home-experiment">
      <div className="home-experiment-top"><span>膜电位实验</span><span>V[t] = βV[t−1] + I[t]</span></div>
      <svg viewBox="0 0 500 200" role="img" aria-label="膜电位随时间积累并在越过阈值时产生脉冲">
        <line x1="28" y1="64" x2="460" y2="64" className="threshold-line" />
        <text x="456" y="55" textAnchor="end">Vth = 1</text>
        <line x1="28" y1="164" x2="460" y2="164" className="axis-line" />
        <path d={path} className="membrane-line" />
        {trace.filter(p => p.spike).map(p => <line key={p.t} x1={28 + p.t * 25.4} y1="174" x2={28 + p.t * 25.4} y2="188" className="spike-mark" />)}
      </svg>
      <div className="home-controls">
        <label><span>输入电流 I</span><b>{current.toFixed(2)}</b><input type="range" min="0.08" max="0.65" step="0.01" value={current} onChange={e => setCurrent(Number(e.target.value))}/></label>
        <label><span>记忆系数 β</span><b>{beta.toFixed(2)}</b><input type="range" min="0.2" max="0.98" step="0.01" value={beta} onChange={e => setBeta(Number(e.target.value))}/></label>
      </div>
      <p>当前产生 <strong>{trace.filter(p => p.spike).length}</strong> 次 spike。先改变 β，再观察过去输入保留了多久。</p>
    </div>
  );
}
