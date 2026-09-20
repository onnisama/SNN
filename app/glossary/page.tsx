import Link from "next/link";

const terms = [
  ["SNN","以离散 spike 通信、以内部状态随时间演化的神经网络。","ann-vs-snn"],
  ["Spike","神经元在某一时刻是否发放的事件；通常表示为 0/1。","ann-vs-snn"],
  ["Spike Train","同一神经元沿时间排列的 spike 序列，或一组发放时刻。","ann-vs-snn"],
  ["Firing Rate","观察窗内 spike 数除以总时长；是一种统计编码。","spike-encoding"],
  ["IF","只积分输入、不包含泄漏项的 integrate-and-fire 神经元。","lif-neuron"],
  ["LIF","包含泄漏、积分、阈值、发放和重置的简化神经元。","lif-neuron"],
  ["Membrane Potential","神经元积累输入并跨时间保存的隐藏状态。","lif-neuron"],
  ["Leak","让历史膜电位随时间衰减的机制。","lif-neuron"],
  ["Threshold","膜电位触发 spike 的判定边界。","lif-neuron"],
  ["Reset","发放后更新膜电位的规则，可减阈值或硬置零。","lif-neuron"],
  ["Time Step","离散仿真中一次状态更新代表的时间间隔。","temporal-dynamics"],
  ["Surrogate Gradient","在反向传播中替代硬阈值局部导数的平滑估计。","surrogate-gradient"],
  ["BPTT","把递归状态沿时间展开后执行反向传播。","bptt"],
  ["Rate Coding","用一段时间内 spike 数量或频率表示信息。","spike-encoding"],
  ["Temporal Coding","用首次发放或 spike 精确时刻表示信息。","spike-encoding"],
  ["ANN-to-SNN","把 ANN 连续激活映射为 SNN 发放率或时序响应。","ann-to-snn"],
  ["Neuromorphic Computing","围绕神经状态、事件通信和局部存储设计的计算范式与硬件。","efficiency"],
  ["Event Camera","像素在亮度变化越过阈值时异步产生事件的传感器。","event-camera"],
  ["Polarity","事件亮度变化方向：正事件表示变亮，负事件表示变暗。","event-camera"],
  ["Spike Rate","给定时间窗内的活动比例；过高会削弱稀疏优势。","efficiency"],
  ["Latency","从输入到足够可靠输出所需的时间或时间步。","ann-to-snn"]
];

export default function GlossaryPage(){
  const myths = [
    ["SNN 是二值神经网络吗？","不是。spike 常为二值，但权重、膜电位、时间常数和训练梯度通常是实数。"],
    ["0/1 spike 怎么表示复杂信息？","信息分布在数量、精确时刻、神经元群体模式及其与内部状态的关系中。"],
    ["SNN 一定比 ANN 省电吗？","不一定。优势依赖稀疏活动、可跳过零值的执行后端和较少的数据移动。"],
    ["Event Camera 必须配 SNN 吗？","不必。事件可转为 frame/voxel，交给 CNN、Transformer 或混合网络。"],
    ["Spike 不可导为什么还能训练？","forward 保持硬 spike，backward 用 surrogate derivative 估计局部梯度。"],
    ["SNN 就是 RNN 吗？","计算图上都可有递归状态，但 SNN 还具有阈值发放、reset 与 spike 通信语义。"],
    ["Time Step 越多越好吗？","更多步可能提高 rate 分辨率，也会增加延迟、显存和计算；收益可能饱和。"],
    ["Spike Rate 越高越好吗？","更高活动有时改善信号，却会削弱稀疏性并增加能耗；应和精度共同报告。"]
  ];
  return <div className="page-shell"><header className="content-header"><span className="big-number">{terms.length}</span><div><h1>Glossary</h1><p>一句话建立索引，再回到对应章节理解上下文。</p></div><div className="meta-stack">A–Z<br/>COURSE LINKS</div></header><div className="glossary-grid">{terms.map(([name,desc,slug])=><article className="term" key={name}><h2>{name}</h2><p>{desc}</p><Link href={`/course/${slug}/`}>对应章节 →</Link></article>)}</div><div className="section-head"><span className="folio">×8</span><h2>Common Misconceptions</h2><p>把常见口号拆成可检验的条件。</p></div><div className="glossary-grid">{myths.map(([q,a])=><article className="term" key={q}><h2>{q}</h2><p>{a}</p></article>)}</div></div>
}
