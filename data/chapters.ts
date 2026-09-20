export type Quiz = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type Chapter = {
  slug: string;
  number: number;
  title: string;
  subtitle: string;
  minutes: number;
  intuition: string[];
  why: string;
  math: { label: string; latex: string; explain: string }[];
  concepts: { title: string; body: string }[];
  code?: string;
  experiment: string;
  mistake: string;
  research: string;
  quiz: Quiz;
};

export const chapters: Chapter[] = [
  {
    slug: "ann-vs-snn", number: 1, title: "ANN vs SNN", subtitle: "从一次映射到状态随时间演化", minutes: 24,
    intuition: [
      "ANN 神经元通常对一批输入做一次加权求和，再通过连续激活函数输出一个数。SNN 神经元则保留内部状态：同一输入在不同时间到达，会得到不同结果。",
      "Spike 是某个时间步是否发放的事件，单个 spike 本身只含“发生/未发生”，信息来自一串 spike 的计数、精确时刻、群体模式以及它们与状态的关系。",
      "SNN 不是把 ReLU 粗暴替换为 0/1。关键变化是网络获得了状态、时间和事件触发的计算语义。"
    ],
    why: "如果输入本身带有时间结构，或硬件能跳过无事件的计算，那么“何时发生”与“是否发生”都可以成为有效信息。",
    math: [
      { label: "ANN", latex: "y = \phi(\mathbf{w}^{\top}\mathbf{x}+b)", explain: "输入被一次性映射成连续激活。" },
      { label: "SNN", latex: "S[t] = H(V[t]-V_{th})", explain: "输出取决于当前膜电位，而膜电位又依赖历史。" },
      { label: "发放率", latex: "r = \frac{1}{T\Delta t}\sum_{t=1}^{T}S[t]", explain: "观察窗口内 spike 数量除以总时长。" }
    ],
    concepts: [
      { title: "Spike train", body: "沿离散时间轴排列的 0/1 序列；也可表示成一组发放时刻。" },
      { title: "Event-driven", body: "理想事件驱动硬件只在事件到达时更新相关状态；GPU 上按稠密时间步模拟并不自动具备这一优势。" }
    ],
    experiment: "到 ANN vs SNN 实验，把相同强度输入同时送入连续激活与 LIF。比较单值输出和跨时间 spike 序列。",
    mistake: "把“二值通信”误认为“二值权重”。SNN 的 spike 常为二值，但权重、膜电位和梯度通常仍是实数。",
    research: "现代深层 SNN 的工作重点通常不是证明 spike 是 0/1，而是让深层状态传播、稀疏计算与任务精度同时成立。",
    quiz: { question: "下面哪一项最能说明 SNN 不只是二值 ANN？", options: ["权重只能取 0/1", "神经元保留跨时间步状态", "每层都必须是卷积", "只能处理事件相机"], answer: 1, explanation: "膜电位等状态把历史输入带到后续时间步，这是 SNN 的核心时序语义。" }
  },
  {
    slug: "lif-neuron", number: 2, title: "IF / LIF 神经元", subtitle: "积分、泄漏、阈值、发放与重置", minutes: 38,
    intuition: [
      "把膜电位想成一只有漏孔的杯子：输入电流向杯中加水，leak 持续排水；水位越过阈值就产生 spike，随后水位被重置。",
      "IF 没有漏孔，过去输入会永久积累；LIF 用泄漏让较早输入的影响指数衰减，因此具有有限时间尺度。"
    ],
    why: "LIF 是复杂生物神经元的可计算近似：它保留最关键的积分、记忆与发放机制，同时容易离散化和批量训练。",
    math: [
      { label: "连续 LIF", latex: "\tau_m\frac{dV}{dt}=-(V-V_{rest})+RI(t)", explain: "时间常数 τₘ 决定状态遗忘速度。" },
      { label: "离散更新", latex: "V[t]=\beta V[t-1]+I[t]", explain: "β 常取 exp(-Δt/τₘ)，Δt 越大，每步泄漏越强。" },
      { label: "发放与软重置", latex: "S[t]=H(V[t]-V_{th}),\quad V[t]\leftarrow V[t]-S[t]V_{th}", explain: "软重置保留超过阈值的余量；硬重置则直接回到指定电位。" }
    ],
    concepts: [
      { title: "Membrane potential", body: "神经元的隐藏状态，不是输出概率。它积累输入，也随时间泄漏。" },
      { title: "Reset", body: "hard reset 设回固定值；subtract reset 减去阈值。两者在高输入下会产生不同 spike 时序。" }
    ],
    code: `class LIF(torch.nn.Module):
    def __init__(self, beta=0.9, threshold=1.0):
        super().__init__()
        self.beta, self.threshold = beta, threshold

    def forward(self, current, mem):
        mem = self.beta * mem + current
        spike = (mem >= self.threshold).to(mem.dtype)
        mem = mem - spike.detach() * self.threshold
        return spike, mem`,
    experiment: "在 LIF 实验中固定电流，分别增大 β、阈值和 Δt。先预测发放间隔如何变化，再观察曲线。",
    mistake: "忽略 Δt 与 β 的关系。换了仿真时间步却保持 β 不变，相当于偷偷改变了神经元的物理时间常数。",
    research: "可学习时间常数、可学习阈值与多室神经元都建立在这个状态方程上；现代模型常把神经元动力学本身也作为可学习结构。",
    quiz: { question: "V[t-1]=0.7，β=0.8，I[t]=0.5，阈值 1。更新后会怎样？", options: ["V=0.56，不发放", "V=1.06，发放", "V=1.20，发放", "V=0.90，不发放"], answer: 1, explanation: "V[t]=0.8×0.7+0.5=1.06，超过阈值，因此产生 spike；之后再按选定 reset 规则更新膜电位。" }
  },
  {
    slug: "temporal-dynamics", number: 3, title: "Temporal Dynamics", subtitle: "沿时间步执行一次真正的前向传播", minutes: 30,
    intuition: ["SNN 的一次 forward 不是只穿过网络深度，还要沿时间轴重复更新。每一步都读取本步输入与上一步状态。", "即使 t=2 没有输入 spike，t=1 留下的膜电位仍可能影响输出；这就是状态记忆。"],
    why: "没有时间展开，就看不到膜电位如何连接相邻时间步，也无法理解 BPTT 为什么需要保存中间状态。",
    math: [
      { label: "突触电流", latex: "I^{(l)}[t]=W^{(l)}S^{(l-1)}[t]", explain: "当前层接收前一层当前时刻的 spike。" },
      { label: "状态更新", latex: "V^{(l)}[t]=\beta V^{(l)}[t-1]+I^{(l)}[t]-S^{(l)}[t-1]V_{th}", explain: "深度依赖与时间依赖同时存在。" }
    ],
    concepts: [
      { title: "Time-major tensor", body: "[T, B, …] 把时间放在首维；也有库使用 [B, T, …]，进入模型前必须确认。" },
      { title: "State lifecycle", body: "序列开始时初始化，序列内持续更新，独立样本之间必须重置或显式传递。" }
    ],
    experiment: "在 BPTT 实验切换 Forward，逐步观察 input → current → membrane → spike；不要一次跳到最后。",
    mistake: "训练不同 batch 时忘记清空膜电位，会把上一批样本的信息泄漏到下一批。",
    research: "并行脉冲神经元与状态空间化方法试图减少严格逐步执行造成的训练瓶颈。",
    quiz: { question: "本步输入为 0 时，LIF 是否一定无法发放？", options: ["一定无法", "不一定，历史膜电位可能仍足够高", "只有第一层可以", "只在 rate coding 中可以"], answer: 1, explanation: "膜电位携带历史；取决于泄漏、上一步状态、reset 规则和阈值。" }
  },
  {
    slug: "spike-encoding", number: 4, title: "Spike Encoding", subtitle: "数值怎样进入时间域", minutes: 32,
    intuition: ["Rate coding 用观察窗内 spike 数量表达强度；temporal coding 用发放时刻表达信息。前者冗余而稳健，后者稀疏且低延迟但对时序噪声更敏感。"],
    why: "静态图像本来没有时间轴。编码方案决定了信息复制次数、延迟、稀疏度和网络能否利用精确时序。",
    math: [
      { label: "Poisson rate", latex: "S[t]\sim\mathrm{Bernoulli}(p=x\Delta t)", explain: "归一化强度控制每步发放概率。" },
      { label: "Latency", latex: "t_{spike}=t_{min}+(1-x)(t_{max}-t_{min})", explain: "强输入更早发放，通常每个神经元只发一次。" }
    ],
    concepts: [
      { title: "Population coding", body: "由一组具有不同感受野的神经元共同编码一个变量，提高分辨率与鲁棒性。" },
      { title: "Direct encoding", body: "把连续值直接作为每步电流输入，避免显式生成第一层 spike；这仍可用于 SNN。" }
    ],
    experiment: "在编码实验输入 0.2、0.5、0.8。比较 rate 编码的随机性与 latency 编码的单次、确定性发放。",
    mistake: "以为编码越“生物真实”越好。任务、延迟预算与部署硬件通常比标签更重要。",
    research: "低时间步 SNN 越来越依赖直接编码、可学习编码或膜电位输入，以减少重复采样造成的成本。",
    quiz: { question: "需要极低 spike 数且能容忍时间抖动较小的传感链路，优先考虑？", options: ["Rate coding", "Latency/temporal coding", "无限时间步", "随机重置"], answer: 1, explanation: "单次或少量 spike 的时刻可携带信息，稀疏且低延迟；代价是对时序噪声更敏感。" }
  },
  {
    slug: "surrogate-gradient", number: 5, title: "Surrogate Gradient", subtitle: "前向是真 spike，反向借一座可导的桥", minutes: 40,
    intuition: ["Heaviside 在阈值外导数为 0，在阈值处不可导。直接交给梯度下降，权重几乎收不到有用信号。", "Surrogate gradient 不改变前向的 0/1 spike，只在 backward 把不存在或无用的导数替换为阈值附近的平滑斜率。"],
    why: "它让误差信号能够从 spike 穿回膜电位，再穿回突触权重，同时保留真实的离散前向行为。",
    math: [
      { label: "真实前向", latex: "S=H(V-V_{th})", explain: "推理与训练前向仍输出 0/1。" },
      { label: "替代反向", latex: "\frac{\partial S}{\partial V}\approx \tilde{\sigma}'(V-V_{th})", explain: "只替换局部导数，不把整网前向改成 sigmoid。" },
      { label: "Fast sigmoid", latex: "\tilde{\sigma}'(u)=\frac{1}{(1+k|u|)^2}", explain: "k 控制有效梯度窗口的宽窄。" }
    ],
    concepts: [
      { title: "Shape choice", body: "Sigmoid、fast sigmoid、arctan、triangular 都可用；尺度与宽度会改变梯度流。" },
      { title: "Detach reset", body: "常见实现阻断 reset 路径的梯度，避免额外递归项；这是一项建模选择，不是固定真理。" }
    ],
    code: `class Spike(torch.autograd.Function):
    @staticmethod
    def forward(ctx, u):
        ctx.save_for_backward(u)
        return (u >= 0).to(u.dtype)

    @staticmethod
    def backward(ctx, grad_output):
        (u,) = ctx.saved_tensors
        surrogate = 1 / (1 + 10 * u.abs()).pow(2)
        return grad_output * surrogate`,
    experiment: "切换三种 surrogate，改变 slope，观察梯度有效区如何围绕阈值收缩或展开。",
    mistake: "说“训练时前向用 sigmoid”。标准 surrogate-gradient 训练的关键正相反：前向仍用硬 spike。",
    research: "近年的工作研究 surrogate 形状、梯度消失、在线训练和不保存完整时间图的近似反向。",
    quiz: { question: "Surrogate gradient 主要替换哪一部分？", options: ["前向 spike 值", "反向的局部导数", "输入编码", "损失函数标签"], answer: 1, explanation: "前向保持硬阈值；反向使用可导近似提供梯度估计。" }
  },
  {
    slug: "bptt", number: 6, title: "BPTT", subtitle: "把状态沿时间展开，再反向穿越", minutes: 42,
    intuition: ["把同一个 LIF 单元在 t₀、t₁、t₂、t₃ 复制展开，复制体共享权重，状态边把它们串起来。Loss 可以从最后或所有时间步产生。"],
    why: "当前 spike 依赖当前膜电位，而当前膜电位依赖上一步。梯度必须跨越这条递归状态链才能把延迟误差归因到早期输入和共享权重。",
    math: [
      { label: "时间递归", latex: "\frac{\partial L}{\partial V[t]}=\frac{\partial L_t}{\partial V[t]}+\frac{\partial L}{\partial V[t+1]}\frac{\partial V[t+1]}{\partial V[t]}", explain: "梯度包含当前损失与未来状态两部分。" },
      { label: "权重梯度", latex: "\frac{\partial L}{\partial W}=\sum_t\frac{\partial L}{\partial S[t]}\frac{\partial S[t]}{\partial V[t]}\frac{\partial V[t]}{\partial W}", explain: "中间项由 surrogate derivative 估计。" }
    ],
    concepts: [
      { title: "Memory cost", body: "朴素 BPTT 需要保存 T 个时间步的中间激活，显存与计算通常随 T 增长。" },
      { title: "Truncated BPTT", body: "按窗口截断状态图可降成本，但会舍弃更远的梯度依赖。" }
    ],
    experiment: "在 BPTT 可视化中先完成所有 forward，再执行 backward；跟随高亮边从 Loss 回到早期状态。",
    mistake: "只在最后一步调用 loss 却期待每个时间步得到同样强的监督。读出策略会明显影响梯度分配。",
    research: "Event-driven backprop、rate-based backprop 与在线近似都在尝试减少完整 BPTT 的内存和时间成本。",
    quiz: { question: "BPTT 中为什么同一权重会收到多个时间步的梯度？", options: ["每步权重不同", "展开节点共享参数，梯度贡献需在时间上求和", "因为 spike 是随机的", "因为必须使用 CNN"], answer: 1, explanation: "时间展开复制的是计算节点，不是参数；共享权重在各时间步参与计算，所以梯度相加。" }
  },
  {
    slug: "first-snn", number: 7, title: "实现第一个 SNN", subtitle: "从手写 LIF 到可训练分类器", minutes: 55,
    intuition: ["训练循环的骨架与普通 PyTorch 类似：数据、前向、损失、backward、optimizer。差异集中在时间循环、状态初始化、spike 读出和 surrogate backward。"],
    why: "只有亲手管理状态与时间维，才能辨认框架 API 隐藏了哪些假设。",
    math: [
      { label: "分类读出", latex: "\hat{y}=\arg\max_c\sum_{t=1}^{T}S_c[t]", explain: "常见做法是累计输出层 spike count。" },
      { label: "时间平均损失", latex: "L=\frac{1}{T}\sum_t\mathrm{CE}(U_{out}[t],y)", explain: "也可对每步膜电位施加监督，梯度更直接。" }
    ],
    concepts: [
      { title: "State reset", body: "每个 batch 开始创建零状态，或明确处理跨片段的 stateful 训练。" },
      { title: "Readout", body: "可用 spike count、末步膜电位、时间平均膜电位；选择必须与损失对应。" }
    ],
    code: `for images, labels in train_loader:
    images, labels = images.to(device), labels.to(device)
    mem1 = torch.zeros(images.size(0), 256, device=device)
    mem2 = torch.zeros(images.size(0), 10, device=device)
    spk_out = []
    for _ in range(num_steps):
        cur1 = fc1(images.flatten(1))
        spk1, mem1 = lif1(cur1, mem1)
        spk2, mem2 = lif2(fc2(spk1), mem2)
        spk_out.append(spk2)
    logits = torch.stack(spk_out).sum(0)
    loss = F.cross_entropy(logits, labels)
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()`,
    experiment: "在 Code Lab 按数据→编码→网络→前向→损失→更新逐段阅读；先把 num_steps 改为 1，再解释行为变化。",
    mistake: "对 spike 做 argmax 后再算 loss。argmax 会截断梯度；应对 spike count 或膜电位 logits 计算可导损失。",
    research: "snnTorch 与 SpikingJelly 提供神经元、surrogate、multi-step 模式和数据集工具；先掌握手写版本再使用。",
    quiz: { question: "哪个操作应该在 loss.backward() 之前？", options: ["对类别结果 argmax", "构造可导 logits 并计算 loss", "把所有状态转成 NumPy", "detach 全部 spike"], answer: 1, explanation: "训练需要从可导读出保留计算图；argmax 与 NumPy 都会中断梯度。" }
  },
  {
    slug: "conv-snn", number: 8, title: "Convolutional SNN", subtitle: "空间卷积与时间状态同时存在", minutes: 30,
    intuition: ["Conv 提取每个时间步的空间局部特征，LIF 在同一空间位置上沿时间积累。典型模块是 Conv → Norm → LIF。"],
    why: "事件帧和图像有二维结构。只用全连接会丢掉平移共享与局部感受野。",
    math: [
      { label: "张量", latex: "\mathbf{X}\in\mathbb{R}^{T\times B\times C\times H\times W}", explain: "T 是时间，B 是 batch，C/H/W 是空间特征维。" },
      { label: "时空更新", latex: "I[t]=\mathrm{Conv}(S^{l-1}[t]),\quad V[t]=\beta V[t-1]+I[t]", explain: "卷积在空间上共享，状态在时间上延续。" }
    ],
    concepts: [
      { title: "Step mode", body: "逐步模式输入 [B,C,H,W]；多步模式一次接收 [T,B,C,H,W]。库的约定不同。" },
      { title: "Normalization", body: "BatchNorm 的统计量如何处理时间维会影响训练；常见方案包括共享 BN 或时间相关 BN。" }
    ],
    experiment: "画出一个 [8,32,16,28,28] 张量并逐维解释。再估算保存所有膜电位需要多少元素。",
    mistake: "把 T 与 B 混淆。代码可能仍运行，却把不同样本当成时间序列，结果没有意义。",
    research: "SEW-ResNet 与后续深层 SNN 重新设计 residual path，避免仅把 ReLU 换成 LIF 导致的优化退化。",
    quiz: { question: "[T,B,C,H,W] 中哪一维承载同一神经元跨步状态？", options: ["T", "B", "C", "W"], answer: 0, explanation: "时间维 T 排列同一序列的多个状态；B 表示彼此独立的样本。" }
  },
  {
    slug: "event-camera", number: 9, title: "Event Camera × SNN", subtitle: "异步亮度变化与脉冲计算的契合边界", minutes: 42,
    intuition: ["事件相机不定时输出整张图，而是像素在对数亮度变化越过阈值时产生事件 e=(x,y,t,p)。p 表示变亮或变暗。", "事件流稀疏、异步、时间精度高，与 SNN 的状态和事件通信很契合；但 CNN、Transformer 同样可以处理事件表示。"],
    why: "事件相机在高速运动、高动态范围与低冗余场景很有价值。算法选择取决于任务、表示、硬件和延迟，不由传感器名称决定。",
    math: [
      { label: "触发条件", latex: "\log I(x,y,t)-\log I(x,y,t-\Delta t)\ge pC", explain: "累计亮度变化超过对比度阈值 C 时触发。" },
      { label: "事件", latex: "e_k=(x_k,y_k,t_k,p_k)", explain: "每个事件携带位置、时间与极性。" }
    ],
    concepts: [
      { title: "Event frame", body: "在时间窗内把事件计数到二维网格；简单但压缩了精确时序。" },
      { title: "Voxel grid", body: "把事件按时间分桶并插值到多个通道，便于 CNN/Transformer 使用。" },
      { title: "Raw stream", body: "直接处理异步事件保留最多时间信息，但批处理和加速更困难。" }
    ],
    experiment: "在事件相机实验移动方块：新出现的边缘产生正事件，离开的边缘产生负事件。调速度观察事件密度。",
    mistake: "把 Event Camera 与 SNN 画等号。事件表示可以进入 CNN、Transformer、状态空间模型或混合 ANN–SNN。",
    research: "SpikeSlicer 把 SNN 用作自适应事件切片器，展示了 SNN 作为前端与 ANN 下游协作的另一种路径。",
    quiz: { question: "下列哪项是正确的？", options: ["事件相机只能输出二值图", "事件相机必须搭配 SNN", "事件流可转成 frame/voxel 后交给 ANN", "极性表示物体类别"], answer: 2, explanation: "事件是异步数据；表示与下游架构是可独立选择的设计决策。" }
  },
  {
    slug: "ann-to-snn", number: 10, title: "ANN-to-SNN Conversion", subtitle: "把连续激活映射为发放率", minutes: 34,
    intuition: ["先训练 ANN，再让 SNN 在一段时间内用 spike count 逼近 ReLU 激活。时间越长，rate 近似通常越细，但延迟也越大。"],
    why: "Conversion 借用成熟 ANN 训练配方，避免直接训练深层 SNN 的梯度困难；代价是转换误差、阈值校准与时间步需求。",
    math: [
      { label: "激活映射", latex: "a^{ANN}\approx V_{th}\frac{1}{T}\sum_{t=1}^{T}S[t]", explain: "平均发放率近似 ANN 的连续激活。" },
      { label: "残余误差", latex: "\epsilon_T\propto\frac{V[T]-V[0]}{T}", explain: "有限 T 下剩余膜电位造成量化式误差。" }
    ],
    concepts: [
      { title: "Threshold balancing", body: "逐层校准阈值或权重，防止某层几乎不发放或过度饱和。" },
      { title: "Direct training", body: "直接在脉冲动力学上优化，常能在少时间步工作，但训练成本与稳定性更具挑战。" }
    ],
    experiment: "把 T 从 4 增至 32，观察 firing-rate 分辨率 1/T 如何变化；同时记录延迟线性增加。",
    mistake: "只比较精度，不报告时间步与脉冲率。转换模型的实用性高度依赖延迟与活动量。",
    research: "QCFS 等方法在源 ANN 训练中引入更接近有限时间步 SNN 的量化激活，以降低超低延迟转换误差。",
    quiz: { question: "为什么增加 T 往往能降低 rate-based conversion 误差？", options: ["权重自动变大", "spike count 的分辨率从 1/T 变细", "阈值消失", "不再需要 reset"], answer: 1, explanation: "有限窗口把连续值量化为整数 spike 数；T 越大，可表示的平均率级别越密。" }
  },
  {
    slug: "deep-snn", number: 11, title: "Modern Deep SNN", subtitle: "ResNet 与 Transformer 如何获得脉冲语义", minutes: 38,
    intuition: ["现代 SNN 借鉴 ANN 的宏观骨架，但必须重新考虑 spike 激活的位置、残差相加后的值域、时序状态和 attention 中的乘法。"],
    why: "简单替换 ReLU 会破坏 identity mapping 或产生非二值残差。架构设计要同时维护优化路径与事件驱动可部署性。",
    math: [
      { label: "SEW residual", latex: "S_{out}=g(S_{block},S_{identity})", explain: "用逐 spike 的 ADD/AND/IAND 等操作构造易优化的残差。" },
      { label: "Spiking attention", latex: "Q_s=H(Q),\ K_s=H(K),\ V_s=H(V)", explain: "Q/K/V 以 spike 形式通信，但具体 attention 仍需检查是否包含乘法、softmax 与同步操作。" }
    ],
    concepts: [
      { title: "Spiking ResNet", body: "核心不是名字，而是残差路径能否传递恒等映射和稳定梯度。" },
      { title: "Spiking Transformer", body: "常用 spike-form Q/K/V、无 softmax attention 或 token mixer；“spiking”不保证整网全程事件驱动。" }
    ],
    experiment: "在论文地图中比较 Spikformer、Spike-driven Transformer 与 STMixer：关注 attention 算子是否适合异步硬件。",
    mistake: "仅凭模型名估计能耗。需要逐算子检查稀疏性、数据移动、同步、时间步和目标硬件。",
    research: "2023–2025 的热点从“把 Transformer 脉冲化”转向更少乘法、更低时间步、更长序列与视频任务。",
    quiz: { question: "判断 Spiking Transformer 是否真正事件驱动，最关键的检查是？", options: ["名字是否含 Spike", "逐算子查看零输入是否能跳过计算及是否仍有稠密乘法", "参数是否超过 1M", "是否使用 ImageNet"], answer: 1, explanation: "事件驱动是执行语义，不是命名；需要检查算子和硬件映射。" }
  },
  {
    slug: "efficiency", number: 12, title: "Efficiency & Neuromorphic", subtitle: "能效优势成立需要哪些条件", minutes: 36,
    intuition: ["SNN 的潜力来自稀疏事件、加法式突触累加和局部状态。但在普通 GPU 上，时间循环、稠密张量和 BPTT 可能让它比 ANN 更慢、更耗显存。"],
    why: "“理论操作更少”不等于“整机能量更低”。算法、实现、内存访问、芯片数据流与任务精度必须共同评估。",
    math: [
      { label: "粗略操作量", latex: "Ops_{SNN}\approx T\cdot r_{spike}\cdot ACs", explain: "时间步 T 与发放率 r 同时决定有效突触累加量。" },
      { label: "系统能量", latex: "E=E_{compute}+E_{memory}+E_{communication}", explain: "数据移动常常不可忽略。" }
    ],
    concepts: [
      { title: "Loihi", body: "异步多核神经形态处理器，支持片上学习规则与局部状态。" },
      { title: "TrueNorth", body: "大规模数字神经突触核心，强调低功耗事件通信与可配置神经元。" },
      { title: "SpiNNaker", body: "由大量 ARM 核组成，以实时模拟大规模脉冲网络和灵活通信为目标。" }
    ],
    experiment: "设 T=8，把 spike rate 从 5% 调到 60%，计算有效 AC 数量如何变化；再思考 GPU 是否真的跳过这些零值。",
    mistake: "把芯片论文的能耗数字直接外推到自己的 GPU 训练。比较必须说明硬件、精度、batch、时间步和测量边界。",
    research: "研究正逐步把“估算能耗”推进到真实芯片测量、算子约束与端到端数据移动分析。",
    quiz: { question: "为什么 SNN 在 GPU 上不一定更高效？", options: ["GPU 不能表示 0/1", "稠密时间步模拟和 BPTT 可能无法利用事件稀疏性", "LIF 没有状态", "SNN 必须使用 CPU"], answer: 1, explanation: "普通张量内核常按稠密数据执行，额外时间维和状态保存会抵消理论上的稀疏加法优势。" }
  }
];

export const totalMinutes = chapters.reduce((sum, chapter) => sum + chapter.minutes, 0);
