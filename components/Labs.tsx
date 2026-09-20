"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const names = ["Spike Train Generator","LIF Simulator","Spike Encoding","Surrogate Gradient","BPTT Visualization","ANN vs SNN","Event Camera Simulator"];
const blue = "#145d67", red = "#db7f28", ink = "#14201f", grid = "#d8d6cd", green = "#5f7d68";

function seeded(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

function Slider({ label, value, min, max, step, onChange }: {label:string;value:number;min:number;max:number;step:number;onChange:(v:number)=>void}) {
  return <div className="control"><label><span>{label}</span><b>{value}</b></label><input aria-label={label} type="range" value={value} min={min} max={max} step={step} onChange={e=>onChange(Number(e.target.value))}/></div>;
}

function SpikeTrainLab() {
  const [rate,setRate]=useState(35), [duration,setDuration]=useState(1000), [seed,setSeed]=useState(7);
  const spikes=useMemo(()=>{const rand=seeded(seed); const dt=10; return Array.from({length:duration/dt},(_,i)=>rand()<rate*dt/1000?i*dt:null).filter(v=>v!==null) as number[]},[rate,duration,seed]);
  const meanIsi=spikes.length>1?Math.round(spikes.slice(1).reduce((sum,t,i)=>sum+t-spikes[i],0)/(spikes.length-1)):null;
  return <Lab title="Spike Train Generator" intro="Poisson rate coding：每个 10 ms 时间格以 p = rate × Δt 发放。固定 seed 后，只改变 rate，便于可重复比较。">
    <div className="controls"><Slider label="firing rate / Hz" value={rate} min={0} max={100} step={1} onChange={setRate}/><Slider label="duration / ms" value={duration} min={200} max={2000} step={100} onChange={setDuration}/><Slider label="random seed" value={seed} min={1} max={50} step={1} onChange={setSeed}/><div className="callout"><b>{spikes.length}</b> spikes · 实测 {Math.round(spikes.length/(duration/1000))} Hz<br/>平均 ISI：{meanIsi===null?"不足两个 spike":`${meanIsi} ms`}</div></div>
    <div className="viz"><svg viewBox="0 0 760 280" role="img" aria-label="生成的 spike train"><line x1="50" y1="220" x2="730" y2="220" stroke={ink}/>{[0,.25,.5,.75,1].map(v=><g key={v}><line x1={50+680*v} y1="215" x2={50+680*v} y2="225" stroke={ink}/><text x={50+680*v} y="248" textAnchor="middle" fontSize="12">{Math.round(duration*v)} ms</text></g>)}{spikes.map(t=><line key={t} x1={50+680*t/duration} y1="65" x2={50+680*t/duration} y2="220" stroke={blue} strokeWidth="2"/>)}<text x="50" y="36" fontSize="14" fill={blue}>spike train · 固定 seed 可重放</text></svg></div>
  </Lab>
}

function simulateLif(current:number,beta:number,threshold:number,reset:number,steps:number,pattern:"steady"|"burst"="steady") {
  let mem=0; const data=[]; for(let t=0;t<steps;t++){const input=t<3?0:pattern==="burst"?(t%12<4?current:.04):current*(.82+.18*Math.sin(t*.55)); mem=beta*mem+input; const spike=mem>=threshold?1:0; const before=mem; if(spike) mem=reset===0?mem-threshold:0; data.push({t,input,mem:before,spike,after:mem});} return data;
}
function linePath(vals:number[], max:number, w=650,h=220){return vals.map((v,i)=>`${i?"L":"M"} ${(55+i*w/Math.max(1,vals.length-1)).toFixed(2)} ${(35+h-(v/max)*h).toFixed(2)}`).join(" ")}
function LIFLab() {
  const [current,setCurrent]=useState(.34),[beta,setBeta]=useState(.85),[threshold,setThreshold]=useState(1),[reset,setReset]=useState(0),[steps,setSteps]=useState(30),[pattern,setPattern]=useState<"steady"|"burst">("steady");
  const data=useMemo(()=>simulateLif(current,beta,threshold,reset,steps,pattern),[current,beta,threshold,reset,steps,pattern]);
  const max=Math.max(threshold*1.3,...data.map(d=>d.mem));
  const preset=(name:string)=>{setPattern("steady"); if(name==="Weak"){setCurrent(.18);setBeta(.82);setThreshold(1)} if(name==="Strong"){setCurrent(.55);setBeta(.82);setThreshold(1)} if(name==="Slow"){setCurrent(.28);setBeta(.96);setThreshold(1)} if(name==="Fast"){setCurrent(.38);setBeta(.45);setThreshold(1)} if(name==="Burst"){setCurrent(.58);setBeta(.88);setThreshold(1);setPattern("burst")}};
  return <Lab title="LIF Simulator" intro="膜电位先泄漏并接收电流；越过阈值后产生 spike，再执行 subtract reset 或 hard reset。">
    <div className="controls"><div className="preset-row">{["Weak","Strong","Slow","Fast","Burst"].map(name=><button key={name} onClick={()=>preset(name)}>{name}</button>)}</div><Slider label="input current" value={current} min={0} max={.8} step={.01} onChange={setCurrent}/><Slider label="beta / decay" value={beta} min={0} max={.99} step={.01} onChange={setBeta}/><Slider label="threshold" value={threshold} min={.3} max={2} step={.05} onChange={setThreshold}/><Slider label="time steps" value={steps} min={10} max={60} step={1} onChange={setSteps}/><div className="control"><label>reset rule</label><select value={reset} onChange={e=>setReset(Number(e.target.value))}><option value={0}>subtract threshold</option><option value={1}>hard reset to zero</option></select></div></div>
    <div className="viz"><div className="legend"><span><i style={{background:blue}}/>membrane</span><span><i style={{background:red}}/>threshold</span><span><i style={{background:green}}/>input</span></div><svg viewBox="0 0 760 310"><path d={linePath(data.map(d=>d.mem),max)} fill="none" stroke={blue} strokeWidth="3"/><path d={linePath(data.map(d=>d.input),max)} fill="none" stroke={green} strokeWidth="2"/><line x1="55" y1={255-threshold/max*220} x2="705" y2={255-threshold/max*220} stroke={red} strokeDasharray="6 5"/>{data.filter(d=>d.spike).map(d=><line key={d.t} x1={55+d.t*650/(steps-1)} y1="275" x2={55+d.t*650/(steps-1)} y2="260" stroke={ink} strokeWidth="3"/>)}<line x1="55" y1="255" x2="705" y2="255" stroke={grid}/><text x="55" y="292" fontSize="12">spikes 显示为底部短线 · 共 {data.filter(d=>d.spike).length} 次</text></svg></div>
  </Lab>
}

function EncodingLab(){
  const [value,setValue]=useState(.65),[steps,setSteps]=useState(20),[seed,setSeed]=useState(9);
  const rate: number[]=useMemo(()=>{const r=seeded(seed);return Array.from({length:steps},()=>r()<value?1:0)},[value,steps,seed]);
  const latency=Math.min(steps-1,Math.round((1-value)*(steps-1)));
  return <Lab title="Spike Encoding" intro="同一标量可以编码为一段随机 spike rate，也可以编码成第一次发放的时刻。">
    <div className="controls"><Slider label="input value" value={value} min={0} max={1} step={.01} onChange={setValue}/><Slider label="time steps" value={steps} min={8} max={40} step={1} onChange={setSteps}/><Slider label="seed" value={seed} min={1} max={30} step={1} onChange={setSeed}/><div className="callout">Rate：{rate.reduce((a,b)=>a+b,0)}/{steps} spikes<br/>Latency：t = {latency}</div></div>
    <div className="viz"><svg viewBox="0 0 760 330"><text x="35" y="70" fontSize="14">Rate coding</text><text x="35" y="220" fontSize="14">Latency coding</text>{Array.from({length:steps},(_,i)=>{const x=155+i*550/(steps-1);return <g key={i}><line x1={x} y1="82" x2={x} y2="142" stroke={rate[i]?blue:grid} strokeWidth={rate[i]?4:1}/><line x1={x} y1="230" x2={x} y2="290" stroke={i===latency?red:grid} strokeWidth={i===latency?4:1}/></g>})}<text x="155" y="170" fontSize="12" fill={blue}>更多强度 → 更高期望发放率，但单次采样仍有随机性</text><text x="155" y="317" fontSize="12" fill={red}>更多强度 → 更早发放；这里只发放一次</text></svg></div>
  </Lab>
}

function SurrogateLab(){
  const [kind,setKind]=useState("Fast sigmoid"),[slope,setSlope]=useState(5);
  const pts=Array.from({length:121},(_,i)=>-2+i/30);
  const surrogate=(x:number)=>{
    if(kind==="Sigmoid") return 1/(1+Math.exp(-slope*x));
    if(kind==="Arctan") return Math.atan(slope*x)/Math.PI+.5;
    if(kind==="Triangular"){
      if(x<=-1/slope) return 0;
      if(x<0) return .5*Math.pow(1+slope*x,2);
      if(x<1/slope) return 1-.5*Math.pow(1-slope*x,2);
      return 1;
    }
    return .5*(slope*x/(1+Math.abs(slope*x))+1);
  };
  const deriv=(x:number)=>{
    if(kind==="Sigmoid") return slope*Math.exp(-slope*x)/Math.pow(1+Math.exp(-slope*x),2);
    if(kind==="Arctan") return slope/(Math.PI*(1+slope*slope*x*x));
    if(kind==="Triangular") return slope*Math.max(0,1-slope*Math.abs(x));
    return slope/(2*Math.pow(1+slope*Math.abs(x),2));
  };
  const path=(f:(x:number)=>number,offset:number,scale:number)=>pts.map((x,i)=>`${i?"L":"M"} ${70+i*620/(pts.length-1)} ${offset-f(x)*scale}`).join(" ");
  return <Lab title="Surrogate Gradient" intro="蓝线是 forward 使用的 Heaviside；红线只帮助理解平滑近似；绿线才是 backward 实际使用的局部梯度。">
    <div className="controls"><div className="control"><label>surrogate family</label><select value={kind} onChange={e=>setKind(e.target.value)}><option>Sigmoid</option><option>Fast sigmoid</option><option>Arctan</option><option>Triangular</option></select></div><Slider label="slope" value={slope} min={1} max={20} step={1} onChange={setSlope}/><div className="callout warning"><b>关键：</b>训练前向输出仍是 H(u) 的 0/1。平滑曲线不替代实际 spike。</div></div>
    <div className="viz"><div className="legend"><span><i style={{background:blue}}/>Heaviside forward</span><span><i style={{background:red}}/>surrogate function</span><span><i style={{background:green}}/>surrogate derivative</span></div><svg viewBox="0 0 760 340"><line x1="70" y1="270" x2="690" y2="270" stroke={grid}/><line x1="380" y1="30" x2="380" y2="290" stroke={grid}/><path d="M 70 270 L 379 270 L 381 70 L 690 70" fill="none" stroke={blue} strokeWidth="3"/><path d={path(surrogate,270,200)} fill="none" stroke={red} strokeWidth="2"/><path d={path(deriv,270,Math.min(80,180/slope))} fill="none" stroke={green} strokeWidth="3"/><text x="380" y="318" textAnchor="middle" fontSize="12">u = V − Vth</text></svg></div>
  </Lab>
}

function BPTTLab(){
  const [phase,setPhase]=useState<"forward"|"backward">("forward"),[step,setStep]=useState(0);
  const total=4; const advance=()=>setStep(s=>Math.min(total,s+1)); const reset=()=>{setStep(0);setPhase("forward")};
  return <Lab title="BPTT Visualization" intro="先把共享权重 W 在时间上展开完成 forward，再让 Loss 的梯度逆向穿过 spike、膜电位和上一时间步。">
    <div className="controls"><div className="callout"><b>阶段：{phase==="forward"?"Forward":"Backward"}</b><br/>已推进 {step}/{total} 个时间步</div><div className="step-controls"><button className="primary" onClick={advance}>Next step</button><button onClick={()=>{setPhase("backward");setStep(0)}}>切换 Backward</button><button onClick={reset}>Reset</button></div></div>
    <div className="viz"><svg viewBox="0 0 820 380"><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill={phase==="forward"?blue:red}/></marker></defs>{Array.from({length:4},(_,i)=>{const x=110+i*185;const active=i<step;return <g key={i}><rect x={x} y="120" width="110" height="110" fill={active?(phase==="forward"?"#e8efff":"#fff0f1"):"white"} stroke={active?(phase==="forward"?blue:red):grid} strokeWidth="2"/><text x={x+55} y="151" textAnchor="middle" fontWeight="700">t{i}</text><text x={x+55} y="178" textAnchor="middle" fontSize="12">V[{i}]</text><text x={x+55} y="200" textAnchor="middle" fontSize="12">S[{i}]</text>{i<3&&<line x1={x+110} y1="175" x2={x+170} y2="175" stroke={active?(phase==="forward"?blue:red):grid} strokeWidth="2" markerEnd="url(#arrow)"/>}</g>})}<rect x="330" y="285" width="160" height="55" fill={phase==="backward"?"#fff0f1":"white"} stroke={phase==="backward"?red:ink}/><text x="410" y="319" textAnchor="middle" fontWeight="700">Loss</text><text x="410" y="50" textAnchor="middle" fontSize="14" fill={phase==="forward"?blue:red}>{phase==="forward"?"input → current → membrane → spike":"Loss → spike → surrogate → membrane → previous state → W"}</text></svg></div>
  </Lab>
}

function AnnSnnLab(){
  const [input,setInput]=useState(.62),[weight,setWeight]=useState(1.4),[steps,setSteps]=useState(16);
  const ann=Math.max(0,input*weight); const snn=simulateLif(input*weight/3,.8,1,0,steps);
  return <Lab title="ANN vs SNN" intro="同一个输入强度：ANN 一次给出连续 activation；SNN 在多个时间步里积累状态并输出序列。">
    <div className="controls"><Slider label="input" value={input} min={0} max={1} step={.01} onChange={setInput}/><Slider label="weight" value={weight} min={0} max={2} step={.05} onChange={setWeight}/><Slider label="SNN time steps" value={steps} min={4} max={32} step={1} onChange={setSteps}/><div className="callout">ANN ReLU：{ann.toFixed(2)}<br/>SNN spikes：{snn.filter(d=>d.spike).length}/{steps}</div></div>
    <div className="viz"><svg viewBox="0 0 760 330"><text x="45" y="55" fontWeight="700">ANN</text><rect x="150" y="28" width={Math.min(500,ann/2*500)} height="45" fill={blue}/><text x="150" y="98" fontSize="12">一次连续激活</text><text x="45" y="195" fontWeight="700">SNN</text>{snn.map((d,i)=><line key={i} x1={150+i*530/(steps-1)} y1={d.spike?130:190} x2={150+i*530/(steps-1)} y2="235" stroke={d.spike?red:grid} strokeWidth={d.spike?4:1}/>)}<text x="150" y="265" fontSize="12">同一神经元的时间序列；状态跨步保留</text></svg></div>
  </Lab>
}

function EventCameraLab(){
  const [position,setPosition]=useState(5),[speed,setSpeed]=useState(2),[threshold,setThreshold]=useState(.25);
  const prev=Math.max(0,position-speed); const size=24; const cells=14;
  const events=[] as {x:number;y:number;p:number}[]; for(let y=4;y<10;y++)for(let x=0;x<cells;x++){const was=x>=prev&&x<prev+4;const now=x>=position&&x<position+4;if(was!==now&&Math.abs(1-0)>=threshold)events.push({x,y,p:now?1:-1});}
  return <Lab title="Event Camera Simulator" intro="移动亮块不会让所有像素重复输出帧；只有亮度变化越过阈值的位置产生正/负事件。">
    <div className="controls"><Slider label="object position" value={position} min={0} max={10} step={1} onChange={setPosition}/><Slider label="speed / step" value={speed} min={1} max={5} step={1} onChange={setSpeed}/><Slider label="contrast threshold" value={threshold} min={.1} max={1} step={.05} onChange={setThreshold}/><div className="callout">事件 e = (x, y, t, p)<br/><b style={{color:blue}}>正事件 {events.filter(e=>e.p>0).length}</b> · <b style={{color:red}}>负事件 {events.filter(e=>e.p<0).length}</b></div></div>
    <div className="viz"><svg viewBox="0 0 800 390"><text x="100" y="35" fontWeight="700">RGB frame</text><text x="520" y="35" fontWeight="700">Event stream</text><rect x="40" y="55" width="336" height="336" fill="#101217"/><rect x={40+position*size} y={55+4*size} width={4*size} height={6*size} fill="white"/><rect x="440" y="55" width="336" height="336" fill="#f7f7f8" stroke={grid}/>{events.map((e,i)=><circle key={i} cx={452+e.x*size} cy={67+e.y*size} r="6" fill={e.p>0?blue:red}/>) }<text x="440" y="382" fontSize="12" fill={blue}>蓝：变亮 (+)</text><text x="620" y="382" fontSize="12" fill={red}>红：变暗 (−)</text></svg></div>
  </Lab>
}

function Lab({title,intro,children}:{title:string;intro:string;children:React.ReactNode}){return <><div className="eyebrow">Interactive Lab</div><h1>{title}</h1><p className="hero-lead">{intro}</p><div className="lab-card">{children}</div></>}

export function Labs(){
  const search=useSearchParams(); const initial=Math.max(0,Math.min(6,Number(search.get("lab")||1)-1)); const [active,setActive]=useState(initial);
  const labs=[<SpikeTrainLab key="1"/>,<LIFLab key="2"/>,<EncodingLab key="3"/>,<SurrogateLab key="4"/>,<BPTTLab key="5"/>,<AnnSnnLab key="6"/>,<EventCameraLab key="7"/>];
  return <div className="lab-grid"><aside className="lab-nav" aria-label="实验列表">{names.map((name,i)=><button key={name} className={active===i?"active":""} onClick={()=>setActive(i)}>{String(i+1).padStart(2,"0")} {name}</button>)}</aside><section className="lab-workspace">{labs[active]}</section></div>
}
