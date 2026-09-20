export type Paper = {
  id: string;
  title: string;
  authors: string;
  year: number;
  venue: string;
  ccf: string;
  category: string;
  level: "Essential" | "Recommended" | "Optional";
  problem: string;
  idea: string;
  why: string;
  prerequisites: string;
  paper: string;
  code?: string;
  guide?: {
    prior: string;
    architecture: string;
    formula: string;
    evidence: string;
    limitation: string;
    remember: string[];
  };
};

export const papers: Paper[] = [
  {
    id: "surrogate", title: "Surrogate Gradient Learning in Spiking Neural Networks", authors: "Emre O. Neftci, Hesham Mostafa, Friedemann Zenke", year: 2019, venue: "IEEE Signal Processing Magazine", ccf: "暂无 CCF 等级", category: "Foundations", level: "Essential",
    problem: "硬阈值不可导，使传统梯度下降无法直接穿过 spike。", idea: "系统化解释用平滑替代导数训练离散前向 SNN 的方法族。", why: "建立“forward 硬、backward 软”的核心心智模型。", prerequisites: "反向传播、LIF、BPTT",
    paper: "https://ieeexplore.ieee.org/document/8891809",
    guide: { prior: "早期训练方法常依赖局部规则、精确 spike time 导数或 ANN 转换，难以直接复用深度学习工具链。", architecture: "任意由可微状态更新与硬 spike 组成的计算图；只在 spike 节点替换局部导数。", formula: "∂S/∂V ≈ σ̃′(V−Vth)", evidence: "综述并归纳多种任务与实现，重点是方法框架而非单一榜单结果。", limitation: "替代导数带来偏差；形状、尺度、reset 梯度都会影响优化。", remember: ["前向仍是真 spike", "替代的是局部导数", "BPTT 成本不会因 surrogate 自动消失"] }
  },
  {
    id: "superspike", title: "SuperSpike: Supervised Learning in Multilayer Spiking Neural Networks", authors: "Friedemann Zenke, Surya Ganguli", year: 2018, venue: "Neural Computation", ccf: "暂无 CCF 等级", category: "Foundations", level: "Recommended",
    problem: "多层 SNN 如何从全局误差信号学习精确 spike pattern。", idea: "使用 fast-sigmoid 形 surrogate derivative 与 eligibility traces 构造三因子学习规则。", why: "今天常用 fast-sigmoid surrogate 的重要来源。", prerequisites: "链式法则、突触迹",
    paper: "https://direct.mit.edu/neco/article/30/6/1514/8379/SuperSpike-Supervised-Learning-in-Multilayer"
  },
  {
    id: "stbp", title: "Spatio-Temporal Backpropagation for Training High-Performance Spiking Neural Networks", authors: "Yujie Wu, Lei Deng, Guoqi Li, Jun Zhu, Luping Shi", year: 2018, venue: "Frontiers in Neuroscience", ccf: "暂无 CCF 等级", category: "Training", level: "Essential",
    problem: "深层 SNN 的空间层级与时间递归需统一求导。", idea: "在同一计算图中沿空间与时间传播误差，并用近似导数跨过 spike。", why: "把 SNN 训练清楚地放进 BPTT 框架。", prerequisites: "BPTT、surrogate gradient",
    paper: "https://www.frontiersin.org/journals/neuroscience/articles/10.3389/fnins.2018.00331/full"
  },
  {
    id: "differentiable-spike", title: "Differentiable Spike: Rethinking Gradient-Descent for Training Spiking Neural Networks", authors: "Yuhang Li, Yufei Guo, Shikuang Deng, Yongqing Hai, Shi Gu", year: 2021, venue: "NeurIPS 2021", ccf: "A", category: "Training", level: "Recommended",
    problem: "固定 surrogate 与真实脉冲过程的优化偏差。", idea: "把脉冲过程重写为可微形式，并分析梯度下降的训练行为。", why: "帮助理解 surrogate 并非唯一的梯度构造方式。", prerequisites: "surrogate gradient、概率建模",
    paper: "https://proceedings.neurips.cc/paper/2021/hash/c4ca4238a0b923820dcc509a6f75849b-Abstract.html"
  },
  {
    id: "event-backprop", title: "Training Spiking Neural Networks with Event-driven Backpropagation", authors: "Yaoyu Zhu, Zhaofei Yu, Wei Fang, Xiaodong Xie, Tiejun Huang, Timothée Masquelier", year: 2022, venue: "NeurIPS 2022", ccf: "A", category: "Training", level: "Recommended",
    problem: "标准 BPTT 在无 spike 的时间步仍进行大量计算并保存状态。", idea: "围绕 spike time 构造事件驱动反向传播，降低计算与内存占用。", why: "直接回应 SNN 训练阶段不够事件驱动的问题。", prerequisites: "spike-time gradient、BPTT",
    paper: "https://proceedings.neurips.cc/paper_files/paper/2022/hash/c4e5f4de1b3cfc838eec6484d0b85378-Abstract-Conference.html"
  },
  {
    id: "shortcut-back", title: "Take A Shortcut Back: Mitigating the Gradient Vanishing for Training Spiking Neural Networks", authors: "Yufei Guo, Yuanpei Chen, Zecheng Hao, Weihang Peng, Zhou Jie, Yuhan Zhang, Xiaode Liu, Zhe Ma", year: 2024, venue: "NeurIPS 2024", ccf: "A", category: "Training", level: "Recommended",
    problem: "深层 SNN 的 surrogate 梯度仍可能在层间消失。", idea: "从损失向浅层增加直接梯度捷径，并用演化式训练平衡主目标。", why: "说明“有 surrogate”不等于“深层梯度健康”。", prerequisites: "深层网络、梯度消失",
    paper: "https://proceedings.neurips.cc/paper_files/paper/2024/hash/2c37c5bcef24b9541550261dcd63261b-Abstract-Conference.html"
  },
  {
    id: "rate-backprop", title: "Advancing Training Efficiency of Deep Spiking Neural Networks through Rate-based Backpropagation", authors: "Chengting Yu, Lei Liu, Gaoang Wang, Erping Li, Aili Wang", year: 2024, venue: "NeurIPS 2024", ccf: "A", category: "Training", level: "Recommended",
    problem: "完整 BPTT 的时间图带来显存和计算开销。", idea: "利用 rate 表征近似时间细粒度导数，简化反向图。", why: "连接“训练到底学到了何种时间信息”与效率问题。", prerequisites: "BPTT、rate coding",
    paper: "https://proceedings.neurips.cc/paper_files/paper/2024/hash/d1bdc488ec18f64177b2275a03984683-Abstract-Conference.html", code: "https://github.com/Tab-ct/rate-based-backpropagation"
  },
  {
    id: "sew-resnet", title: "Deep Residual Learning in Spiking Neural Networks", authors: "Wei Fang, Zhaofei Yu, Yanqi Chen, Tiejun Huang, Timothée Masquelier, Yonghong Tian", year: 2021, venue: "NeurIPS 2021", ccf: "A", category: "Architecture", level: "Essential",
    problem: "直接把 ANN ResNet 的 ReLU 换成 spike 会破坏恒等映射并产生退化。", idea: "SEW-ResNet 用 spike-element-wise 操作重新定义 residual 合并。", why: "解释深层 SNN 需要改造残差语义，而不是机械替换激活。", prerequisites: "ResNet、LIF、残差学习",
    paper: "https://proceedings.neurips.cc/paper/2021/hash/afe434653a898da20044041262b3ac74-Abstract.html", code: "https://github.com/fangwei123456/Spike-Element-Wise-ResNet",
    guide: { prior: "早期 Spiking ResNet 直接复制 ANN block，深度增加时精度反而下降，identity mapping 也不再自然成立。", architecture: "卷积分支产生 spike，再与 identity spike 通过 ADD/AND/IAND 等逐元素函数合并。", formula: "Sout = g(Sblock, Sidentity)", evidence: "在 ImageNet、DVS Gesture、CIFAR10-DVS 上展示了更深网络可训练，并覆盖百层规模。", limitation: "能效多基于操作估算；具体合并操作的硬件代价与活动率仍需实测。", remember: ["残差位置决定可优化性", "深度不是简单堆 LIF", "报告时间步与 spike rate"] }
  },
  {
    id: "psn", title: "Parallel Spiking Neurons with High Efficiency and Ability to Learn Long-term Dependencies", authors: "Wei Fang, Zhaofei Yu, Zhaokun Zhou, Ding Chen, Yanqi Chen, Zhengyu Ma, Timothée Masquelier, Yonghong Tian", year: 2023, venue: "NeurIPS 2023", ccf: "A", category: "Architecture", level: "Recommended",
    problem: "严格时间递归限制并行训练，也难学习长依赖。", idea: "把神经元时间动力学改写为可并行形式。", why: "展示神经元模型也能作为架构层面的并行化对象。", prerequisites: "LIF、并行前缀计算",
    paper: "https://proceedings.neurips.cc/paper_files/paper/2023/hash/a834ac3dfdb90da54292c2c932c997cc-Abstract-Conference.html", code: "https://github.com/fangwei123456/Parallel-Spiking-Neuron"
  },
  {
    id: "spikformer", title: "Spikformer: When Spiking Neural Network Meets Transformer", authors: "Zhaokun Zhou, Yuesheng Zhu, Chao He, Yaowei Wang, Shuicheng Yan, Yonghong Tian, Li Yuan", year: 2023, venue: "ICLR 2023", ccf: "暂无 CCF 等级", category: "Transformer", level: "Essential",
    problem: "标准 self-attention 的 softmax 与稠密乘法不符合 spike 稀疏通信。", idea: "使用 spike-form Q/K/V 与无 softmax 的 Spiking Self Attention。", why: "是理解 Spiking Transformer 设计空间的代表起点。", prerequisites: "Transformer、QKV、SNN",
    paper: "https://openreview.net/forum?id=frE4fUwz_h", code: "https://github.com/ZK-Zhou/spikformer",
    guide: { prior: "早期混合模型常在 attention 中保留大量连续计算，或只在外围加入 spiking neuron。", architecture: "卷积式 patch embedding 后进入带 SSA 的 spiking transformer block；Q/K/V 经 spike neuron 二值化。", formula: "SSA(Qs,Ks,Vs)=SN(scale·QsKsᵀVs)", evidence: "论文在静态与神经形态分类数据上比较直接训练 SNN，并给出 ImageNet 结果。", limitation: "操作能耗基于假定硬件单元估算；矩阵运算的稀疏执行依赖实际后端。", remember: ["无 softmax 不代表零成本", "Q/K/V 的 spike 语义是核心", "精度、时间步、硬件映射要一起看"] }
  },
  {
    id: "spike-driven-transformer", title: "Spike-driven Transformer", authors: "Man Yao, Jiakui Hu, Zhaokun Zhou, Li Yuan, Yonghong Tian, Bo Xu, Guoqi Li", year: 2023, venue: "NeurIPS 2023", ccf: "A", category: "Transformer", level: "Essential",
    problem: "已有 spiking attention 仍包含与 spike 矩阵相关的乘法和较高复杂度。", idea: "SDSA 用 mask 与加法构造线性复杂度的 spike-driven attention，并调整残差位置保持二值通信。", why: "把“脉冲化”推进到逐算子事件驱动约束。", prerequisites: "Spikformer、attention 复杂度",
    paper: "https://proceedings.neurips.cc/paper_files/paper/2023/hash/ca0f5358dbadda74b3049711887e9ead-Abstract-Conference.html", code: "https://github.com/BICLab/Spike-Driven-Transformer",
    guide: { prior: "Spiking Transformer 虽使用 spike Q/K/V，但 attention 与残差中仍可能出现乘法或连续值通信。", architecture: "SDSA 将 Q/K/V 交互改成 mask 与累加；pre-spike residual 保持层间传递为二值事件。", formula: "SDSA(Q,K,V)=SN(Q ⊙ f(K,V))", evidence: "论文报告 ImageNet 与神经形态数据集结果，并基于常用 45nm 操作能耗模型估算注意力能耗。", limitation: "估算能耗不是芯片端到端实测；稀疏 kernel 和数据移动决定真实收益。", remember: ["事件驱动要看每个算子", "残差位置会改变通信值域", "线性复杂度不等于固定实际延迟"] }
  },
  {
    id: "spike-mixer", title: "Spiking Token Mixer: An Event-driven Friendly Former Structure for Spiking Neural Networks", authors: "Shikuang Deng, Yuhang Wu, Kangrui Du, Shi Gu", year: 2024, venue: "NeurIPS 2024", ccf: "A", category: "Transformer", level: "Recommended",
    problem: "异步神经形态硬件不支持许多 Transformer 算子。", idea: "只用卷积、全连接与残差等异步场景可支持算子构造 token mixer。", why: "把模型设计从理论 spike 操作约束到目标硬件支持集。", prerequisites: "卷积、token mixer、神经形态硬件",
    paper: "https://proceedings.neurips.cc/paper_files/paper/2024/hash/e8c20cafe841cba3e31a17488dc9c3f1-Abstract-Conference.html", code: "https://github.com/brain-intelligence-lab/STMixer_demo"
  },
  {
    id: "spikedattention", title: "SpikedAttention: Training-Free and Fully Spike-Driven Transformer-to-SNN Conversion", authors: "Sangwoo Hwang, Seunghyun Lee, Dahoon Park, Donghun Lee, Jaeha Kung", year: 2024, venue: "NeurIPS 2024", ccf: "A", category: "Conversion", level: "Recommended",
    problem: "Transformer 的 softmax 难以直接转换为全脉冲计算。", idea: "通过 winner-oriented spike shift 处理 softmax，进行无需再训练的 Transformer-to-SNN conversion。", why: "把 conversion 从 CNN 扩展到视觉与语言 Transformer。", prerequisites: "ANN-SNN conversion、softmax",
    paper: "https://proceedings.neurips.cc/paper_files/paper/2024/hash/7c9341ad0263428b5057d92f4d88dfa0-Abstract-Conference.html", code: "https://github.com/sangwoohwang/SpikedAttention"
  },
  {
    id: "optimal-conversion", title: "Optimal ANN-SNN Conversion for High-accuracy and Ultra-low-latency Spiking Neural Networks", authors: "Tong Bu, Wei Fang, Jianhao Ding, PengLin Dai, Zhaofei Yu, Tiejun Huang", year: 2022, venue: "ICLR 2022", ccf: "暂无 CCF 等级", category: "Conversion", level: "Essential",
    problem: "rate matching 在低时间步产生明显转换误差。", idea: "用 QCFS 激活在 ANN 训练阶段逼近有限时间步 SNN 的量化行为。", why: "把 conversion error 拆成可分析、可优化的有限时间问题。", prerequisites: "ReLU、rate coding、量化",
    paper: "https://openreview.net/forum?id=7B3IJMM1k_M", code: "https://github.com/putshua/ANN_SNN_QCFS",
    guide: { prior: "传统转换依赖很长时间窗，让平均发放率逼近连续激活；低 T 下残余膜电位与量化误差主导性能下降。", architecture: "先用 QCFS 替换 ReLU 训练源 ANN，再映射权重与阈值到同构 SNN。", formula: "ϕ(T)=Wϕprev(T)−(V(T)−V(0))/T", evidence: "在 CIFAR 与 ImageNet 上比较精度—时间步曲线，重点展示极低 T 的转换表现。", limitation: "源 ANN 需要 conversion-aware 训练；结论依赖 rate readout 与同构映射。", remember: ["有限 T 是量化问题", "初始/残余膜电位都重要", "比较转换方法必须画 accuracy–latency 曲线"] }
  },
  {
    id: "membrane-rethink", title: "Rethinking the Membrane Dynamics and Optimization Objectives of Spiking Neural Networks", authors: "Hangchi Shen, Qian Zheng, Huamin Wang, Gang Pan", year: 2024, venue: "NeurIPS 2024", ccf: "A", category: "Neuron Dynamics", level: "Recommended",
    problem: "零初始膜电位限制短时间步内可表达的 spike pattern。", idea: "学习初始膜电位，并用 last-time-step 目标改善短时动态。", why: "提醒我们初始状态也是模型参数与归纳偏置。", prerequisites: "LIF、读出策略",
    paper: "https://proceedings.neurips.cc/paper_files/paper/2024/hash/a867a94a427bacbe3f4de16c7ac10ba8-Abstract-Conference.html"
  },
  {
    id: "sfod", title: "SFOD: Spiking Fusion Object Detector", authors: "Yimeng Fan, Wei Zhang, Changsong Liu, Mingyang Li, Wenrui Lu", year: 2024, venue: "CVPR 2024", ccf: "A", category: "Event Vision", level: "Recommended",
    problem: "事件相机上的 SNN 检测器难以融合多尺度特征。", idea: "设计 spiking fusion module，并系统研究解码与损失。", why: "从分类走向事件目标检测的具体工程案例。", prerequisites: "object detection、event frame、FPN",
    paper: "https://openaccess.thecvf.com/content/CVPR2024/html/Fan_SFOD_Spiking_Fusion_Object_Detector_CVPR_2024_paper.html", code: "https://github.com/yimeng-fan/SFOD"
  },
  {
    id: "spikeslicer", title: "Spiking Neural Network as Adaptive Event Stream Slicer", authors: "Jiahang Cao, Mingyuan Sun, Ziqing Wang, Hao Cheng, Qiang Zhang, Shibo Zhou, Renjing Xu", year: 2024, venue: "NeurIPS 2024", ccf: "A", category: "Event Vision", level: "Essential",
    problem: "固定事件窗口在速度变化时会丢信息或引入冗余。", idea: "让 SNN 学习何时触发切片，再用 ANN 下游反馈训练切片策略。", why: "清楚展示 Event Camera 不等于端到端全 SNN，而可形成混合系统。", prerequisites: "事件流、切片、SNN-ANN 混合",
    paper: "https://proceedings.neurips.cc/paper_files/paper/2024/hash/893a5db6100028ec814cfd99fe92c31b-Abstract-Conference.html",
    guide: { prior: "固定数量或固定时长切片无法同时适配快慢运动，且精确切片通常缺少下游任务反馈。", architecture: "轻量 SNN 读取事件并输出切片触发 spike；下游 ANN 任务损失通过 feedback-update 影响切片器。", formula: "τk = first t where Sslice[t]=1", evidence: "在事件跟踪与识别任务上比较固定切片与自适应切片。", limitation: "系统仍包含 ANN，端到端能耗取决于两部分与切片带来的负载变化。", remember: ["SNN 可作为事件前端", "切片本身是可学习决策", "传感器与网络架构不是绑定关系"] }
  },
  {
    id: "spikevideoformer", title: "SpikeVideoFormer: An Efficient Spike-Driven Video Transformer with Hamming Attention and O(T) Complexity", authors: "Shihao Zou, Qingfeng Li, Wei Ji, Jingjing Li, Yongkui Yang, Guoqi Li, Chao Dong", year: 2025, venue: "ICML 2025", ccf: "A", category: "Transformer", level: "Recommended",
    problem: "视频 Transformer 的时空 attention 复杂度高，脉冲模型也难保持长视频效率。", idea: "用 Hamming attention 与线性时间复杂度构建 spike-driven 视频模型。", why: "代表 SNN 向视频与长序列建模的扩展。", prerequisites: "视频 Transformer、Hamming distance",
    paper: "https://openreview.net/forum?id=zvzCdHbDBP", code: "https://github.com/JimmyZou/SpikeVideoFormer"
  },
  {
    id: "sfod-2025", title: "Brain-Inspired Spiking Neural Networks for Energy-Efficient Object Detection", authors: "Ziqi Li, Tao Gao, Yisheng An, Ting Chen, Jing Zhang, Yuanbo Wen, Mengkun Liu, Qianxi Zhang", year: 2025, venue: "CVPR 2025", ccf: "A", category: "Vision", level: "Optional",
    problem: "SNN 检测在特征表达与能效之间存在明显差距。", idea: "引入受神经异质性启发的机制改进检测网络。", why: "观察 2025 年 SNN 检测如何从分类组件走向任务专用设计。", prerequisites: "object detection、深层 SNN",
    paper: "https://openaccess.thecvf.com/content/CVPR2025/html/Li_Brain-Inspired_Spiking_Neural_Networks_for_Energy-Efficient_Object_Detection_CVPR_2025_paper.html"
  },
  {
    id: "loihi", title: "Loihi: A Neuromorphic Manycore Processor with On-Chip Learning", authors: "Mike Davies et al.", year: 2018, venue: "IEEE Micro", ccf: "暂无 CCF 等级", category: "Hardware", level: "Essential",
    problem: "如何在芯片上高效执行带局部状态、异步 spike 与可编程学习规则的网络。", idea: "多核异步架构、层次通信、神经元 compartment 与片上学习引擎。", why: "让“事件驱动能效”落到具体硬件约束。", prerequisites: "计算机体系结构、LIF",
    paper: "https://ieeexplore.ieee.org/document/8259423",
    guide: { prior: "CPU/GPU 为稠密数值计算优化，神经状态更新与稀疏异步通信会产生映射开销。", architecture: "神经形态核保存局部神经元/突触状态，通过异步消息路由 spike，并用微码学习引擎更新状态。", formula: "系统收益取决于 compute + memory + communication，而非仅比较 MAC 与 AC。", evidence: "论文以片上优化任务与 CPU 基线展示特定问题上的能量—延迟积优势。", limitation: "特定任务与芯片测量不能外推为所有 SNN 都优于 GPU；编程模型和精度受硬件限制。", remember: ["能效来自系统协同", "片上局部状态减少搬运", "硬件结果必须按任务与测量边界阅读"] }
  },
  {
    id: "truenorth", title: "A Million Spiking-Neuron Integrated Circuit with a Scalable Communication Network and Interface", authors: "Paul A. Merolla et al.", year: 2014, venue: "Science", ccf: "暂无 CCF 等级", category: "Hardware", level: "Recommended",
    problem: "大规模数字神经形态系统的低功耗集成与通信。", idea: "TrueNorth 集成大量可配置神经元与突触，并使用事件路由网络。", why: "是理解现代神经形态硬件规模化的重要经典。", prerequisites: "数字电路、NoC",
    paper: "https://www.science.org/doi/10.1126/science.1254642"
  },
  {
    id: "spinnaker", title: "The SpiNNaker Project", authors: "Steve B. Furber et al.", year: 2014, venue: "Proceedings of the IEEE", ccf: "暂无 CCF 等级", category: "Hardware", level: "Recommended",
    problem: "如何实时模拟超大规模脉冲网络并支持灵活神经模型。", idea: "用大量通用 ARM 核与专用组播网络实现事件通信。", why: "与专用神经元电路形成另一条硬件设计路线。", prerequisites: "多核、消息路由",
    paper: "https://ieeexplore.ieee.org/document/6750072"
  },
  {
    id: "event-survey", title: "Event-based Vision: A Survey", authors: "Guillermo Gallego et al.", year: 2022, venue: "IEEE TPAMI", ccf: "A", category: "Event Vision", level: "Essential",
    problem: "事件相机的传感模型、表示、算法与应用分散。", idea: "系统梳理事件生成、几何、滤波、光流、重建与识别。", why: "避免把事件视觉误读成 SNN 的同义词。", prerequisites: "计算机视觉、概率与优化",
    paper: "https://ieeexplore.ieee.org/document/9138762", code: "https://github.com/uzh-rpg/event-based_vision_resources"
  }
];

export const categories = ["全部", ...Array.from(new Set(papers.map(p => p.category)))];
