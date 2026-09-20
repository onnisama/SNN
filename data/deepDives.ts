export type DeepDive = {
  title: string;
  body: string;
  bullets?: string[];
  takeaway?: string;
};

export const deepDives: Record<string, DeepDive[]> = {
  "ann-vs-snn": [
    {
      title: "不要把生物类比当作一一对应",
      body: "树突、胞体、轴突帮助我们理解“接收—积累—发放”，但工程 SNN 是数学模型，不是完整脑组织模拟。膜电位是状态变量，spike 是通信事件，突触权重仍是可学习参数。",
      bullets: ["ANN：一次前向通常只保留层间激活。", "SNN：每层神经元还保存跨时间步状态。", "事件驱动：只有后端真的跳过无事件计算时才成立。"],
      takeaway: "真正的分界线不是 0/1，而是状态、时间与事件通信。"
    },
    {
      title: "一列 spike train 可以测什么？",
      body: "除了 firing rate，还应观察 spike count、首次发放时间和 inter-spike interval（ISI）。两个序列可能发放率相同，却有完全不同的精确时序。",
      bullets: ["Spike count：窗口内事件数量。", "Firing rate：count / observation time。", "ISI：相邻 spike 时间差，可描述节律与 burst。"]
    }
  ],
  "lif-neuron": [
    {
      title: "从连续方程到 β：离散化没有消失",
      body: "对 τₘ dV/dt = −(V−Vrest)+RI(t) 使用前向 Euler，可得到 V[t+1]≈V[t]+Δt/τₘ·(−(V[t]−Vrest)+RI[t])。整理后，上一时刻状态的系数就是近似的 β。",
      bullets: ["Δt 变大而 τₘ 不变：每一步遗忘更强。", "常见精确衰减写法是 β=exp(−Δt/τₘ)。", "代码里只写 beta，不代表物理时间尺度可以忽略。"],
      takeaway: "换时间分辨率时，应一起重新检查 β、输入尺度与阈值。"
    },
    {
      title: "Hard reset 与 subtract reset 会改变什么？",
      body: "Hard reset 发放后把膜电位设到固定值；subtract reset 只减去阈值，保留超出的余量。持续强输入下，后者更接近积分守恒，也可能产生更密集的 spike。",
      bullets: ["比较 reset 前膜电位，而不是只看 spike count。", "训练与推理必须使用同一 reset 规则。", "reset 路径是否参与梯度是另一项独立选择。"]
    }
  ],
  "temporal-dynamics": [
    {
      title: "手算四个时间步",
      body: "设 β=0.8、阈值 1、subtract reset，输入依次为 [0.4, 0.4, 0.4, 0]。膜电位依次更新为 0.4、0.72、0.976、0.7808，因此四步都不发放。若第三步输入改为 0.5，则第三步越阈值并触发 reset。",
      bullets: ["每一步先读取旧状态，再加入当前输入。", "无输入不等于无状态。", "输出 spike 与 reset 后状态必须分开记录。"],
      takeaway: "调试 SNN 时，打印单个样本的逐步 trace 往往比看最终 accuracy 更有效。"
    },
    {
      title: "状态什么时候清零？",
      body: "独立图片 batch 之间通常清零；长视频被切成连续片段时可以传递，但需要 detach 截断旧计算图。验证阶段也必须使用与训练一致的状态边界。"
    }
  ],
  "spike-encoding": [
    {
      title: "Rate 与 temporal 不是二选一",
      body: "Rate coding 用冗余换鲁棒性；latency coding 用更少事件换更高时间敏感性。实际系统还常用 direct current encoding、population coding，或在不同层采用不同表征。",
      bullets: ["Rate：实现简单，通常需要更长观察窗。", "Latency：信息密度高，但对 jitter 和漏事件敏感。", "Population：多个神经元覆盖不同响应中心，提高分辨率。"],
      takeaway: "编码方法应由任务噪声、延迟预算和部署后端共同决定。"
    },
    {
      title: "编码本身也是计算成本",
      body: "把一张静态图像重复 T 次不是免费的。若第一层直接接收连续电流，可避免显式生成输入 spike；但此时第一层并非纯 spike-driven，需要如实说明。"
    }
  ],
  "surrogate-gradient": [
    {
      title: "替代导数的宽度与尺度",
      body: "斜率太大时，只有极少膜电位落在有效梯度区；斜率太小时，梯度分布很宽，但与硬阈值局部行为偏差更大。最佳选择常与学习率、阈值分布和网络深度耦合。",
      bullets: ["Sigmoid：平滑、两侧指数衰减。", "Fast sigmoid：重尾更明显，计算简单。", "Arctan：平滑且尾部衰减较慢。", "Triangular：有限支持集，窗口外梯度严格为零。"]
    },
    {
      title: "Autograd Function 在做什么？",
      body: "forward 保存膜电位差 u=V−Vth 并返回硬阈值；backward 接收上游梯度，再乘 surrogate derivative。权重梯度仍由 PyTorch 链式法则自动累积。",
      takeaway: "Surrogate gradient 是 biased gradient estimator，不是 spike 的真实经典导数。"
    }
  ],
  "bptt": [
    {
      title: "梯度有两条方向",
      body: "空间方向穿过层：output → hidden → input；时间方向穿过状态：V[t] → V[t−1]。SNN 的 BPTT 同时叠加这两条路径，因此深度和时间长度都会影响梯度稳定性。",
      bullets: ["输出损失可以只放在末步，也可对所有步监督。", "共享权重的梯度在所有时间步求和。", "完整 BPTT 的激活存储通常与 T 近似线性增长。"]
    },
    {
      title: "截断、detach 与 online training",
      body: "Truncated BPTT 每隔 K 步 detach 状态，减少显存但舍弃更远依赖。Online 方法尝试边前向边近似梯度，换取更低内存；它们不是免费的等价替代。"
    }
  ],
  "first-snn": [
    {
      title: "一个可复现训练实验至少记录什么？",
      body: "除了 test accuracy，还要保存随机种子、T、β、阈值、reset、编码、输出读出、每层 spike rate、训练耗时和峰值显存。否则很难判断提升来自网络还是更高的仿真成本。",
      bullets: ["先在很小数据子集上过拟合，验证梯度真的工作。", "再跑单 batch trace，检查膜电位与 spike 是否饱和。", "最后才进行完整训练与超参数扫描。"]
    },
    {
      title: "输出层一定要发 spike 吗？",
      body: "不一定。可用 spike count，也可使用输出膜电位作为 logits。前者保持脉冲读出，后者常带来更直接的监督；需要在报告中说明。"
    }
  ],
  "conv-snn": [
    {
      title: "同时追踪空间与时间",
      body: "在 [T,B,C,H,W] 中，卷积核沿 H/W 共享，神经元状态沿 T 延续，B 中不同样本彼此独立。一次 reshape 错位就可能把 batch 当成 time，却不一定立刻报错。",
      bullets: ["逐步模式：循环 T 次，每次输入 [B,C,H,W]。", "多步模式：模块直接接收 [T,B,C,H,W]。", "状态张量形状通常与卷积输出 [B,C,H,W] 相同。"]
    },
    {
      title: "Normalization 也有时间语义",
      body: "共享 BatchNorm 把不同时间步混在同一统计量中；时间相关 BN 为每个 t 保存独立参数。前者简单，后者表达更细但参数和实现复杂度更高。"
    }
  ],
  "event-camera": [
    {
      title: "从事件流到网络输入",
      body: "Raw events 保留最高时间分辨率；event frame 在时间窗内计数；voxel grid 再加入多个时间 bin。表示越规则，越容易使用成熟 CNN/Transformer，但越可能压缩精确时序。",
      bullets: ["Event frame：二维、便于复用图像网络。", "Voxel grid：保留粗粒度时间结构。", "Raw event：信息最完整，批处理最困难。", "SNN：可直接或分 bin 处理，取决于实现与硬件。"]
    },
    {
      title: "极性不是颜色",
      body: "p=+1 表示对数亮度增加越过阈值，p=−1 表示减少。它描述变化方向，不表示物体类别，也不等同于黑白像素。"
    }
  ],
  "ann-to-snn": [
    {
      title: "转换误差从哪里来？",
      body: "有限时间窗把连续激活量化为整数 spike count；阈值不匹配会造成饱和或沉默；reset 后的残余膜电位还会形成层层累积的偏差。",
      bullets: ["更长 T：rate 分辨率更细，但延迟更高。", "阈值校准：平衡动态范围与 spike rate。", "源 ANN 激活：需要与目标神经元动力学相容。"]
    },
    {
      title: "Conversion 与 direct training 的选择",
      body: "Conversion 借助成熟 ANN 配方，适合复用高性能模型；direct training 直接优化时间动力学，常能使用更少时间步，但需要 surrogate/BPTT 并承担训练开销。"
    }
  ],
  "deep-snn": [
    {
      title: "哪些是成熟骨架，哪些仍在探索？",
      body: "Spiking CNN/ResNet 已有较稳定的训练范式；Spiking Transformer 正快速演进，但“全脉冲”“无乘法”“真实低能耗”在不同论文中定义并不一致；长序列、SSM 与大规模预训练仍更偏探索。",
      bullets: ["成熟：卷积、残差、surrogate direct training。", "活跃：低时间步 attention、token mixer、视频。", "探索：大模型规模、SSM 混合、跨模态与自监督。"]
    },
    {
      title: "读架构图时检查四件事",
      body: "spike neuron 放在哪里；残差合并前后是否仍为二值；attention 是否保留 softmax/乘法；时间状态是否真的参与任务，而不只是重复静态输入。"
    }
  ],
  "efficiency": [
    {
      title: "一个可信的能效比较需要什么？",
      body: "至少对齐任务精度、模型规模、batch、T、spike rate、数值精度和硬件。只用“MAC 比 AC 贵”乘以操作数，是分析起点，不是端到端结论。",
      bullets: ["理论计数：MAC、AC、有效突触事件。", "运行测量：延迟、吞吐、峰值显存。", "硬件测量：芯片功耗、板级功耗、数据传输边界。", "任务约束：达到同等精度或同等延迟。"]
    },
    {
      title: "为什么 GPU 训练常不省？",
      body: "稠密卷积内核不会因为输入是 0 就自动跳过；T 次前向与 BPTT 还会保存大量激活。神经形态芯片通过局部状态和异步事件路由减少这些开销，但也受算子支持与精度限制。"
    }
  ]
};
