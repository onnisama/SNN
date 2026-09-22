export type FormulaGuide = {
  reading: string;
  symbols: { symbol: string; meaning: string }[];
  steps: string[];
  example: string;
  code?: string;
  caution?: string;
};

const guide = (value: FormulaGuide) => value;

export const formulaGuides: Record<string, FormulaGuide> = {
  "ann-vs-snn:ANN": guide({
    reading: "先把输入按权重加起来，再过激活函数。ANN 神经元在这里做的是一次映射，没有上一时刻的状态参与。",
    symbols: [
      { symbol: "x", meaning: "输入向量，例如两个特征 [0.6, 0.2]" },
      { symbol: "w", meaning: "与输入一一对应的可学习权重" },
      { symbol: "b", meaning: "偏置，让决策边界不必经过原点" },
      { symbol: "φ", meaning: "激活函数，例如 ReLU、GELU 或 sigmoid" },
    ],
    steps: ["做点积 wᵀx，也就是把每个输入乘权重后相加。", "加上偏置 b，得到激活前的 z。", "把 z 交给 φ，得到本层输出 y。"],
    example: "若 x=[0.6,0.2]、w=[0.5,−1]、b=0.1，则 z=0.6×0.5+0.2×(−1)+0.1=0.2；用 ReLU 后 y=0.2。",
    code: "z = x @ w + b\ny = torch.relu(z)",
  }),
  "ann-vs-snn:SNN": guide({
    reading: "膜电位 V 只要越过阈值就记一个 spike；没有越过就记 0。注意：这条式子只负责‘判定’，V 如何积累要看神经元动力学。",
    symbols: [
      { symbol: "S[t]", meaning: "第 t 个时间步的输出事件，通常取 0 或 1" },
      { symbol: "V[t]", meaning: "判定发放前的膜电位" },
      { symbol: "Vth", meaning: "发放阈值" },
      { symbol: "H", meaning: "Heaviside 阶跃函数：输入≥0 输出1，否则输出0" },
    ],
    steps: ["先由历史状态和本步输入算出 V[t]。", "计算 V[t]−Vth。", "结果非负则 S[t]=1，否则 S[t]=0；发放后还要执行 reset。"],
    example: "阈值为 1 时，V[3]=0.94 不发放；V[4]=1.08 发放。1.08 不是输出概率，而是触发 spike 前的内部状态。",
    code: "spike = (mem >= threshold).to(mem.dtype)",
    caution: "不要把 V 当成 0/1。二值的是通信事件 S，膜电位、权重和梯度通常仍是实数。",
  }),
  "ann-vs-snn:发放率": guide({
    reading: "在一段观察时间里数 spike，再除以这段时间有多长；单位是 Hz，而不是‘每步几个’。",
    symbols: [
      { symbol: "T", meaning: "离散时间步数量" },
      { symbol: "Δt", meaning: "一个时间步代表的真实时长，需用秒计算 Hz" },
      { symbol: "ΣS[t]", meaning: "窗口内 spike 总数" },
      { symbol: "r", meaning: "平均发放率，单位 s⁻¹，也就是 Hz" },
    ],
    steps: ["把 T 个 0/1 spike 相加，得到 spike count。", "计算观察窗长度 TΔt。", "用 count 除以窗口长度。"],
    example: "100 个时间步、每步 1 ms，共观察 0.1 s；若出现 4 个 spike，则 r=4/0.1=40 Hz。",
    code: "rate_hz = spikes.sum() / (num_steps * dt_seconds)",
  }),

  "lif-neuron:连续 LIF": guide({
    reading: "膜电位变化由两股力量拉扯：leak 把 V 拉回静息电位，输入电流 RI(t) 把它推高或压低。τm 决定这种变化有多快。",
    symbols: [
      { symbol: "V(t)", meaning: "随连续时间变化的膜电位" },
      { symbol: "Vrest", meaning: "没有输入时膜电位趋向的静息值" },
      { symbol: "I(t)", meaning: "输入电流；R 把电流尺度换成电压尺度" },
      { symbol: "τm", meaning: "膜时间常数；越大表示遗忘越慢" },
    ],
    steps: ["若 V 高于 Vrest，−(V−Vrest) 为负，leak 会把 V 往下拉。", "RI(t) 与 leak 相加，决定此刻净变化方向。", "再除以 τm，得到 dV/dt；τm 越大，同样驱动力造成的变化越慢。"],
    example: "取 Vrest=0、V=0.2、RI=0.6、τm=20 ms，则 dV/dt=(−0.2+0.6)/20=0.02 每毫秒：输入大于泄漏，膜电位正在上升。",
    caution: "这是阈下动力学。达到阈值后的 spike 与 reset 需要另外规定，不能从这行微分方程里自动长出来。",
  }),
  "lif-neuron:离散更新": guide({
    reading: "把连续变化切成一格一格来算：先保留上一时刻的 β 倍，再加本步输入。β 就是这一步留下多少记忆。",
    symbols: [
      { symbol: "V[t−1]", meaning: "上一步 reset 之后留下的膜电位" },
      { symbol: "β", meaning: "离散衰减系数，通常在 0 到 1 之间" },
      { symbol: "I[t]", meaning: "已经按离散时间步缩放后的输入电流" },
      { symbol: "V[t]", meaning: "本步用于阈值判定的膜电位" },
    ],
    steps: ["用 β 乘旧膜电位，得到漏掉一部分后的记忆。", "加上当前输入 I[t]。", "拿更新后的 V[t] 与阈值比较；若发放，再执行 reset。"],
    example: "V[t−1]=0.7、β=0.8、I[t]=0.5 时，V[t]=0.8×0.7+0.5=1.06。阈值若为 1，本步会发放。",
    code: "mem = beta * mem + current",
    caution: "β 与 Δt 绑定。常见精确衰减是 β=exp(−Δt/τm)；改了时间步长度却不改 β，相当于换了神经元。",
  }),
  "lif-neuron:发放与软重置": guide({
    reading: "第一段决定发不发，第二段处理发放后的状态。subtract reset 只减去一个阈值，所以超过阈值的余量会留下。",
    symbols: [
      { symbol: "S[t]", meaning: "本步是否发放" },
      { symbol: "Vth", meaning: "阈值，同时也是 subtract reset 的减量" },
      { symbol: "V[t]←…", meaning: "箭头表示原地更新发放后的状态，不是新方程的等号" },
    ],
    steps: ["先用发放前 V[t] 计算 S[t]。", "若 S[t]=0，减去 0，膜电位不因 reset 改变。", "若 S[t]=1，减去 Vth，保留超过阈值的余量。"],
    example: "V=1.06、Vth=1 时先输出 S=1，再得到 reset 后 V=0.06；hard reset 则会直接得到 0。",
    code: "spike = (mem >= threshold).float()\nmem = mem - spike.detach() * threshold",
    caution: "一定区分‘判定前膜电位’和‘reset 后膜电位’，否则画出的轨迹会看不出何时真正跨过阈值。",
  }),

  "temporal-dynamics:突触电流": guide({
    reading: "在第 t 步，只拿上一层同一时刻的 spike 做一次线性变换。它描述空间/层间传播，还没有处理本层自己的时间记忆。",
    symbols: [
      { symbol: "l", meaning: "当前网络层编号" },
      { symbol: "S(l−1)[t]", meaning: "上一层在当前时间步发出的 spike 向量" },
      { symbol: "W(l)", meaning: "从上一层连到当前层的共享权重" },
      { symbol: "I(l)[t]", meaning: "送入当前层神经元的加权电流" },
    ],
    steps: ["找到本步活跃的输入 spike。", "每个 spike 乘对应突触权重。", "对进入同一神经元的贡献求和，得到 I。"],
    example: "两个输入 spike 为 [1,0]，某神经元权重为 [0.4,−0.7]，则本步电流 I=0.4；第二条突触因为没有 spike，不贡献电流。",
    code: "current = linear(spikes_previous_layer)",
  }),
  "temporal-dynamics:状态更新": guide({
    reading: "这行同时有两条边：βV[t−1] 是时间边，I[t] 是从上一层来的深度边；最后一项把上一步发放造成的 reset 写进递推式。",
    symbols: [
      { symbol: "βV[t−1]", meaning: "从过去保留下来的状态" },
      { symbol: "I[t]", meaning: "当前时间步收到的层间输入" },
      { symbol: "S[t−1]Vth", meaning: "上一时刻发放后应扣除的 reset" },
    ],
    steps: ["沿时间轴衰减旧状态。", "加入本步加权输入。", "按所采用的时间索引约定扣除 reset，再计算本步 spike。"],
    example: "β=0.8、旧 V=0.6、本步 I=0.4、上步未发放时，新 V=0.88；即使本步 I 只有 0.4，历史也把它推到了更高位置。",
    caution: "不同库会把 reset 写在本步判定后，或把 S[t−1] 合并进旧状态。公式外观不同不一定表示模型不同，先核对更新顺序。",
  }),

  "spike-encoding:Poisson rate": guide({
    reading: "把像素强度 x 变成发放率，再乘一个时间格的长度，得到这一格发生 spike 的概率。每个时间格做一次伯努利抽样。",
    symbols: [
      { symbol: "x", meaning: "归一化输入强度，通常在 [0,1]" },
      { symbol: "rmax", meaning: "x=1 时允许的最大发放率，单位 Hz" },
      { symbol: "Δt", meaning: "一个时间格的秒数" },
      { symbol: "p", meaning: "该时间格产生 spike 的概率，必须不超过 1" },
    ],
    steps: ["用 r=rmax·x 把强度换成目标发放率。", "计算 p=rΔt。", "采样 u∼Uniform(0,1)，若 u<p 就令 S[t]=1。"],
    example: "x=0.6、rmax=100 Hz、Δt=1 ms=0.001 s，则 p=100×0.6×0.001=0.06；每步有 6% 概率发放。",
    code: "p = r_max * x * dt_seconds\nspike = (torch.rand_like(x) < p).float()",
    caution: "同一个 x 每次生成的序列可能不同。短窗口里实际 spike count 偏离期望值很正常。",
  }),
  "spike-encoding:Latency": guide({
    reading: "把数值大小映射成第一次发放的时间：x 越大，(1−x) 越小，于是 spike 越早。",
    symbols: [
      { symbol: "x", meaning: "归一化输入，0 表示最弱，1 表示最强" },
      { symbol: "tmin/tmax", meaning: "允许发放的最早/最晚时刻" },
      { symbol: "tspike", meaning: "该神经元的首次发放时间" },
    ],
    steps: ["先算 1−x，把强度反转成等待比例。", "乘可用时间窗长度 tmax−tmin。", "加上 tmin，得到实际发放时刻。"],
    example: "时间窗 2–12 ms，x=0.8，则 tspike=2+(1−0.8)×10=4 ms；x=0.2 时则为 10 ms。",
    caution: "这是最简单的线性 latency 映射。真实系统还要处理 x=0 是否不发放、时间离散化与 jitter。",
  }),

  "surrogate-gradient:真实前向": guide({
    reading: "前向传播只问一个硬问题：膜电位差 u=V−Vth 是否非负。答案仍然是离散的 0/1。",
    symbols: [
      { symbol: "u=V−Vth", meaning: "离阈值还有多远；u=0 正好在阈值上" },
      { symbol: "H(u)", meaning: "硬阶跃函数" },
      { symbol: "S", meaning: "真实参与下一层计算的 spike" },
    ],
    steps: ["计算膜电位与阈值的差 u。", "u<0 输出 0；u≥0 输出 1。", "保存 u，供 backward 估计局部梯度。"],
    example: "Vth=1 时，V=0.97 得到 u=−0.03、S=0；V=1.02 得到 u=0.02、S=1。",
    code: "u = mem - threshold\nspike = (u >= 0).to(u.dtype)",
  }),
  "surrogate-gradient:替代反向": guide({
    reading: "反向时不再使用 H 的真实导数，而是在阈值附近借一个平滑函数的斜率，让损失能告诉 V 应该往哪边移动。",
    symbols: [
      { symbol: "∂S/∂V", meaning: "spike 对膜电位的局部梯度；真实值几乎处处为 0" },
      { symbol: "σ̃′", meaning: "人为选择的替代导数" },
      { symbol: "V−Vth", meaning: "梯度窗口以阈值为中心" },
    ],
    steps: ["上游先给出 ∂L/∂S。", "用 σ̃′(V−Vth) 代替不可用的 ∂S/∂V。", "链式法则相乘，得到 ∂L/∂V，再继续传给权重和旧状态。"],
    example: "上游梯度为 0.4、替代导数在当前 u 处为 0.25，则传给膜电位的梯度是 0.4×0.25=0.1。",
    code: "grad_mem = grad_spike * surrogate_derivative(u)",
    caution: "这是有偏梯度估计。它能训练，不代表它等于阶跃函数的真实经典导数。",
  }),
  "surrogate-gradient:Fast sigmoid": guide({
    reading: "离阈值越远，替代梯度越小；k 决定衰减有多快。它的目的不是拟合前向输出，而是规定 backward 的有效窗口。",
    symbols: [
      { symbol: "u", meaning: "膜电位与阈值的差" },
      { symbol: "k", meaning: "斜率/窗口参数；越大窗口越窄" },
      { symbol: "σ̃′(u)", meaning: "传给膜电位的局部梯度倍率" },
    ],
    steps: ["取距离 |u|。", "计算 1+k|u|。", "平方后取倒数；在 u=0 时梯度最大为 1。"],
    example: "k=10 时，u=0 的值为 1；u=0.1 时为 1/(1+1)²=0.25；u=0.5 时只剩 1/36≈0.028。",
    code: "surrogate = 1 / (1 + k * u.abs()).pow(2)",
  }),

  "bptt:时间递归": guide({
    reading: "V[t] 的梯度有两个来源：本步损失直接责怪它，以及未来状态通过 V[t+1] 回头责怪它。BPTT 就是在反复合并这两笔账。",
    symbols: [
      { symbol: "L", meaning: "整个序列的总损失" },
      { symbol: "Lt", meaning: "第 t 步产生的局部损失" },
      { symbol: "∂V[t+1]/∂V[t]", meaning: "状态从本步传到下一步的局部 Jacobian" },
    ],
    steps: ["计算本步监督产生的直接梯度。", "取下一时刻已经累计好的梯度。", "乘状态转移的局部导数后加回来，再继续向 t−1 传播。"],
    example: "本步直接梯度 0.2，未来累计梯度 0.5，局部状态导数约为 β=0.8，则总梯度约 0.2+0.5×0.8=0.6。",
    caution: "reset 和 surrogate 会让真实 Jacobian 比单纯 β 更复杂；这里先用 β 帮你看清时间链。",
  }),
  "bptt:权重梯度": guide({
    reading: "同一权重 W 在所有时间步反复使用，所以每个时间步都交回一份梯度，最后把这些贡献相加。",
    symbols: [
      { symbol: "∂L/∂S[t]", meaning: "损失对本步 spike 的上游梯度" },
      { symbol: "∂S[t]/∂V[t]", meaning: "由 surrogate 估计的阈值局部梯度" },
      { symbol: "∂V[t]/∂W", meaning: "本步膜电位对共享权重的敏感度" },
      { symbol: "Σt", meaning: "累加所有时间步对同一参数的贡献" },
    ],
    steps: ["从 loss 传到本步 spike。", "穿过 surrogate 到膜电位。", "再传到 W，并对 t=1…T 的贡献求和。"],
    example: "若三个时间步对某权重的梯度分别是 0.03、−0.01、0.05，最终该权重收到 0.07，而不是只取最后一步的 0.05。",
  }),

  "first-snn:分类读出": guide({
    reading: "每个类别对应一个输出神经元；把整个时间窗的 spike 数起来，发放最多的类别作为预测。",
    symbols: [
      { symbol: "Sc[t]", meaning: "类别 c 的输出神经元在第 t 步是否发放" },
      { symbol: "Σt Sc[t]", meaning: "类别 c 的总 spike count" },
      { symbol: "argmaxc", meaning: "在所有类别中选 count 最大者" },
    ],
    steps: ["沿时间维求和，得到每个类别的 count。", "保留每个样本的类别向量。", "推理时对类别维做 argmax。"],
    example: "三类 count 为 [2,7,4]，预测类别 1。训练时把 [2,7,4] 当 logits 算 loss，不要先 argmax。",
    code: "logits = spike_record.sum(dim=0)\nloss = F.cross_entropy(logits, labels)",
  }),
  "first-snn:时间平均损失": guide({
    reading: "不等到序列末尾才监督，而是每一步都用输出膜电位算一次交叉熵，再取平均。这样早期时间步也直接收到学习信号。",
    symbols: [
      { symbol: "Uout[t]", meaning: "第 t 步输出层膜电位或连续读出" },
      { symbol: "y", meaning: "真实类别标签" },
      { symbol: "CE", meaning: "交叉熵损失" },
      { symbol: "1/T", meaning: "取平均，避免仅因增加时间步就放大 loss" },
    ],
    steps: ["每一步保存输出膜电位。", "分别与同一标签计算 CE。", "把 T 个 loss 相加并除以 T。"],
    example: "四步 CE 为 [1.2,0.9,0.7,0.6]，则 L=(1.2+0.9+0.7+0.6)/4=0.85。",
    code: "loss = torch.stack([F.cross_entropy(u, y) for u in volts]).mean()",
  }),

  "conv-snn:张量": guide({
    reading: "这不是一条计算公式，而是一张形状合同：同一批视频/脉冲序列按时间、样本、通道、高、宽五个维度排好。",
    symbols: [
      { symbol: "T", meaning: "序列长度/时间步数" },
      { symbol: "B", meaning: "彼此独立的样本数量" },
      { symbol: "C", meaning: "输入极性通道或卷积特征通道" },
      { symbol: "H×W", meaning: "空间分辨率" },
    ],
    steps: ["先确认框架是 time-major [T,B,…] 还是 batch-major [B,T,…]。", "逐步模式每次取 X[t]，形状为 [B,C,H,W]。", "卷积输出的膜状态通常保持 [B,Cout,H′,W′]。"],
    example: "[8,32,16,28,28] 表示 8 步、32 个样本、16 个通道、28×28。仅 float32 输入就有 8×32×16×28×28≈321 万个数，约 12.3 MiB。",
    caution: "T 和 B 对调后代码往往还能运行，所以要用语义和断言检查，而不能只看有没有 shape error。",
  }),
  "conv-snn:时空更新": guide({
    reading: "卷积负责同一时间步里的空间特征提取，LIF 递推负责同一空间位置跨时间保留状态。两种结构各做一件事。",
    symbols: [
      { symbol: "Conv", meaning: "对 H/W 做局部共享计算" },
      { symbol: "S(l−1)[t]", meaning: "上一层本步的脉冲特征图" },
      { symbol: "V[t−1]", meaning: "当前层上一时间步的膜状态图" },
    ],
    steps: ["对本步 spike map 做卷积，得到电流图 I[t]。", "把旧膜状态图乘 β。", "逐位置相加，再做阈值与 reset。"],
    example: "某像素位置旧 V=0.5、β=0.9，卷积在本步给出 I=0.6，则更新前 V=1.05；阈值为 1 时该位置发放。",
    code: "current = conv(spikes_t)\nmem = beta * mem + current",
  }),

  "event-camera:触发条件": guide({
    reading: "事件相机看的是对数亮度变化量 ΔL，而不是绝对亮度。变化幅度超过阈值 C 才上报；变化方向成为极性 p。",
    symbols: [
      { symbol: "L=log I", meaning: "对数亮度；更接近相对亮度变化" },
      { symbol: "ΔL", meaning: "当前亮度与该像素上次事件参考亮度之差" },
      { symbol: "C", meaning: "对比度阈值" },
      { symbol: "p", meaning: "+1 表示变亮，−1 表示变暗" },
    ],
    steps: ["对当前像素计算对数亮度。", "减去上次事件对应的参考值，得到 ΔL。", "若 |ΔL|≥C 就产生事件，并令 p=sign(ΔL)。"],
    example: "若参考亮度为 100、当前为 125，则 ΔL=log(125/100)≈0.223；C=0.2 时触发正事件。若降到 80，则 log(0.8)≈−0.223，触发负事件。",
    caution: "实际传感器有噪声、阈值不一致和 refractory period；这个式子描述的是理想触发模型。",
  }),
  "event-camera:事件": guide({
    reading: "一次事件不是一张小图片，而是一条带时间戳的记录：哪个像素、何时、向哪个方向发生了足够大的亮度变化。",
    symbols: [
      { symbol: "k", meaning: "事件序号，不是固定时间步" },
      { symbol: "xk, yk", meaning: "触发事件的像素坐标" },
      { symbol: "tk", meaning: "高精度时间戳" },
      { symbol: "pk", meaning: "亮度变化极性 ±1" },
    ],
    steps: ["传感器像素独立监测变化。", "达到阈值的像素立即产生一条记录。", "算法再决定按原始流处理，还是聚合成 frame/voxel。"],
    example: "e=(42,17,3.284 ms,+1) 表示坐标 (42,17) 在 3.284 ms 发生一次变亮事件；它没有携带该像素的 RGB 值。",
  }),

  "ann-to-snn:激活映射": guide({
    reading: "用 T 步内的平均 spike count 近似 ANN 的连续激活；Vth 决定一个 spike 代表多少激活量。",
    symbols: [
      { symbol: "aANN", meaning: "源 ANN 的非负激活" },
      { symbol: "Vth", meaning: "SNN 阈值/每个 spike 对应的量化尺度" },
      { symbol: "ΣS/T", meaning: "有限窗口的平均发放率（按步归一化）" },
    ],
    steps: ["先统计 T 步 spike count。", "除以 T 得到 [0,1] 范围的平均活动率。", "乘 Vth，与源 ANN 激活尺度对齐。"],
    example: "T=8、Vth=2、发放 3 次，则可表示的激活约为 2×3/8=0.75；可表示值的间隔是 Vth/T=0.25。",
    caution: "不同转换论文会把权重、阈值和输入缩放吸收到不同位置，不能只抄这一行而忽略校准规则。",
  }),
  "ann-to-snn:残余误差": guide({
    reading: "有限窗口结束时，膜里还没凑够一个阈值的余量没有变成 spike；把这部分摊到 T 步，形成近似误差。",
    symbols: [
      { symbol: "εT", meaning: "使用 T 步转换得到的残余误差" },
      { symbol: "V[T]−V[0]", meaning: "窗口末尾与开头的未释放膜电位差" },
      { symbol: "1/T", meaning: "时间窗越长，单步平均中的边界余量占比通常越小" },
    ],
    steps: ["累计输入并用 spike 释放整阈值份额。", "窗口结束时读取剩余膜电位。", "用 T 归一化，得到有限窗口造成的边界项。"],
    example: "若末尾比开头多剩 0.6，T=4 时边界项尺度约 0.15；T=20 时约 0.03，但延迟也从 4 步增到 20 步。",
  }),

  "deep-snn:SEW residual": guide({
    reading: "残差块输出与恒等分支不一定直接做普通实数加法，而是用 g 明确规定两路 spike 怎样合并。",
    symbols: [
      { symbol: "Sblock", meaning: "经过残差变换分支后的 spike" },
      { symbol: "Sidentity", meaning: "跳连分支传来的 spike" },
      { symbol: "g", meaning: "逐元素合并规则，例如 ADD、AND 或 IAND" },
    ],
    steps: ["分别计算残差分支和恒等分支。", "选定 g 并逐元素合并。", "检查 g 是否保持期望的恒等映射与输出值域。"],
    example: "若两路分别为 1 和 0：ADD 得到 1，AND 得到 0，IAND（残差×非恒等）还会依定义变化；三者不是可随意互换的装饰。",
    caution: "ADD 可能产生 2，因此‘残差后仍是二值 spike’需要看具体结构，不能从网络名字推断。",
  }),
  "deep-snn:Spiking attention": guide({
    reading: "先把连续的 Q、K、V 投影经过阈值变成 spike-form 表征；这一步只说明通信形式，尚未定义 attention 本身怎样计算。",
    symbols: [
      { symbol: "Q/K/V", meaning: "由输入特征投影得到的 query、key、value" },
      { symbol: "H", meaning: "阈值发放函数" },
      { symbol: "Qs/Ks/Vs", meaning: "脉冲化后的 Q、K、V" },
    ],
    steps: ["对输入做 Q/K/V 投影。", "经神经元动力学和阈值产生 spike。", "再查看论文如何用这些 spike 做相关性与聚合。"],
    example: "即使 Qs/Ks/Vs 都是 0/1，后续若仍计算稠密 QsKsᵀ、softmax 和矩阵乘，整块也不能简单宣称‘只有加法’。",
    caution: "阅读 Spiking Transformer 时一定继续追问：有没有 softmax、乘法、全局同步，以及零 spike 是否真的跳过执行。",
  }),

  "efficiency:粗略操作量": guide({
    reading: "这是一个数量级估算：每个时间步，只有 r_spike 比例的源神经元活跃，于是理想硬件只执行相应比例的突触累加。",
    symbols: [
      { symbol: "T", meaning: "仿真时间步数" },
      { symbol: "rspike", meaning: "平均发放率，这里按每步活跃比例计" },
      { symbol: "Nsyn", meaning: "若全部源神经元活跃时需要访问的突触数" },
      { symbol: "OpsSNN", meaning: "理想稀疏执行下的有效突触累加次数" },
    ],
    steps: ["先算每步满连接需要访问多少突触。", "乘平均活跃比例，估计每步有效事件数。", "再乘 T，得到整个序列的事件累加量。"],
    example: "Nsyn=100 万、T=8、r=5% 时约 40 万次有效累加；r=60% 时约 480 万次，相差 12 倍。",
    caution: "只有执行后端真的跳过零值和无事件路由时，这个估算才接近实际计算；稠密 GPU kernel 往往不会。",
  }),
  "efficiency:系统能量": guide({
    reading: "芯片总能耗不是只看乘加次数：算术、读写权重/状态、跨核传输都要付费，很多模型真正贵的是搬数据。",
    symbols: [
      { symbol: "Ecompute", meaning: "MAC、AC、阈值比较和状态更新的能量" },
      { symbol: "Ememory", meaning: "读取权重、膜状态和写回中间结果的能量" },
      { symbol: "Ecommunication", meaning: "片上/片外传输 spike 与特征的能量" },
    ],
    steps: ["先明确测量边界：单核、芯片还是整块板卡。", "分别统计计算、存储和通信活动。", "在同等精度、batch、延迟条件下相加比较。"],
    example: "一个方案把算术能量降了 50%，但内存和通信占原系统的 80%，总能量最多从 100 降到 90，而不是直接降到 50。",
    caution: "论文中的 pJ/op、芯片功耗和 GPU 训练功耗属于不同测量边界，不能放在一张表里直接除。",
  }),
};

export function getFormulaGuide(slug: string, label: string) {
  return formulaGuides[`${slug}:${label}`];
}
