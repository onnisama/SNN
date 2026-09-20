import type { Quiz } from "./chapters";

export const extraQuizzes: Record<string, Quiz[]> = {
  "ann-vs-snn": [
    { question:"两个 spike train 的 firing rate 相同，它们携带的信息一定相同吗？", options:["一定相同","不一定，精确时刻和 ISI 可能不同","只有 ANN 中不同","只取决于权重"], answer:1, explanation:"Rate 只保留计数统计；temporal code 还可能利用首次发放时间、同步关系与 ISI。" },
    { question:"下列哪项最可能真正实现 event-driven 节能？", options:["GPU 上稠密展开 100 步","硬件只在 spike 到达时调度相关突触累加","把权重改成 float16","增加 batch size"], answer:1, explanation:"事件驱动要求执行后端跳过无事件计算；仅有 0/1 数据并不保证跳过。" }
  ],
  "lif-neuron": [
    { question:"保持 τₘ 不变但增大 Δt，β=exp(−Δt/τₘ) 会怎样？", options:["增大","减小","不变","变成阈值"], answer:1, explanation:"Δt/τₘ 增大，指数衰减系数变小，每一步遗忘更多。" },
    { question:"持续强输入下，subtract reset 相比 hard reset 通常会？", options:["保留超过阈值的余量","删除所有历史","让阈值不可导","取消 leak"], answer:0, explanation:"Subtract reset 只减去阈值，超过部分仍留在膜电位中。" }
  ],
  "temporal-dynamics": [
    { question:"独立图片的两个 batch 之间保留同一膜电位，主要风险是？", options:["梯度更准确","样本间状态泄漏","卷积核变大","spike 变连续"], answer:1, explanation:"上一批样本的历史会污染下一批，破坏样本独立性。" },
    { question:"长序列分段训练时对传递状态执行 detach 的作用是？", options:["清零状态值","截断旧计算图但保留数值","改变阈值","增加时间步"], answer:1, explanation:"detach 保留当前状态数值，同时不再向更早片段传播梯度。" }
  ],
  "spike-encoding": [
    { question:"哪种编码通常用更长观察窗换取统计鲁棒性？", options:["Rate coding","Latency coding","单次 temporal coding","Hard reset"], answer:0, explanation:"Rate coding 依靠多次发放统计，通常更稳健但延迟和事件数量更高。" },
    { question:"直接把像素强度作为每步第一层电流，意味着？", options:["不再是 SNN","第一层避免显式输入 spike，但后续仍可为 SNN","所有层都变 ANN","不需要时间维"], answer:1, explanation:"Direct encoding 是常见输入方式；应如实说明第一层接收连续电流。" }
  ],
  "surrogate-gradient": [
    { question:"Surrogate slope 极大可能导致什么？", options:["所有位置都有梯度","有效梯度只集中在很窄阈值邻域","forward 变成 ReLU","不再需要 BPTT"], answer:1, explanation:"窗口太窄时，大多数膜电位取不到有用梯度，可能加剧优化困难。" },
    { question:"自定义 autograd backward 返回的是什么？", options:["新的 spike","上游梯度乘以替代局部导数","新的输入编码","测试集标签"], answer:1, explanation:"链式法则仍然成立，只是 spike 节点的局部导数由 surrogate 提供。" }
  ],
  "bptt": [
    { question:"完整 BPTT 的显存为何通常随 T 增长？", options:["每步都复制权重","需要保存各时间步中间状态用于反向","阈值越来越大","数据集被复制"], answer:1, explanation:"参数共享，但时间展开节点的激活和状态需要为反向保存。" },
    { question:"Truncated BPTT 的主要代价是？", options:["不能使用 GPU","舍弃超过截断窗口的梯度依赖","权重变二值","必须使用 rate coding"], answer:1, explanation:"它减少图长度和显存，同时无法把误差传到更早时间。" }
  ],
  "first-snn": [
    { question:"训练前最有价值的快速正确性检查是？", options:["直接跑 100 epoch","在小样本上过拟合并查看单样本时间 trace","只看模型参数量","先做论文投稿"], answer:1, explanation:"小样本过拟合与时间 trace 能迅速暴露梯度断裂、状态未清零和饱和问题。" },
    { question:"为什么只报告 accuracy 不足以比较 SNN？", options:["accuracy 不可计算","还需对齐 T、spike rate、延迟和硬件条件","SNN 没有输出","必须只报告能耗"], answer:1, explanation:"更高精度可能来自更长仿真和更高活动量，成本—精度必须一起看。" }
  ],
  "conv-snn": [
    { question:"将 [T,B,C,H,W] 误 reshape 为 [B,T,C,H,W] 可能怎样？", options:["必然立即报错","可能运行但混淆时间与样本语义","只影响颜色","自动修正"], answer:1, explanation:"维度大小若刚好兼容，代码可能继续运行，但状态沿错误轴传播。" },
    { question:"卷积后 LIF 的膜电位通常是什么形状？", options:["只有一个标量","与该层卷积输出的 [B,C,H,W] 对应","只有 [T]","与标签相同"], answer:1, explanation:"每个样本、通道和空间位置都有自己的神经元状态。" }
  ],
  "event-camera": [
    { question:"Voxel grid 相比单张 event frame 主要多保留什么？", options:["类别标签","粗粒度时间分桶","RGB 颜色","相机内参"], answer:1, explanation:"多个 temporal bins 保留了窗口内部的时间结构。" },
    { question:"事件极性 p=−1 表示？", options:["负类别","像素对数亮度下降越过阈值","没有事件","时间戳无效"], answer:1, explanation:"极性描述亮度变化方向，不是像素颜色或语义标签。" }
  ],
  "ann-to-snn": [
    { question:"低 T conversion 的核心困难之一是？", options:["spike count 量化分辨率粗","ANN 没有权重","SNN 不需要阈值","无法使用图像"], answer:0, explanation:"有限时间窗只能产生整数 spike count，平均率的分辨率约为 1/T。" },
    { question:"Direct training 的典型优势与代价是？", options:["无需时间维但只能 CPU","可直接优化短时动力学，但训练需 surrogate/BPTT","精度永远更高","无需数据"], answer:1, explanation:"Direct training 能针对低时间步优化，但训练计算与稳定性更具挑战。" }
  ],
  "deep-snn": [
    { question:"Spiking Transformer 名称本身能证明全网事件驱动吗？", options:["能","不能，需逐算子检查乘法、softmax、通信值域和后端","只看参数量即可","只看论文年份"], answer:1, explanation:"不同论文对 spike-driven 的边界不同，执行语义必须逐算子核对。" },
    { question:"读 residual SNN 时首先检查什么？", options:["颜色","spike neuron 与残差相加的相对位置","作者数量","数据集名称"], answer:1, explanation:"位置决定 identity path 是否易优化，以及层间传递是否仍保持二值。" }
  ],
  "efficiency": [
    { question:"一个公平的 SNN/ANN 能耗比较首先要对齐？", options:["论文页数","任务精度、延迟目标和硬件边界","标题长度","作者机构"], answer:1, explanation:"不同精度、T、batch 和硬件下的能耗数字不能直接横向比较。" },
    { question:"理论 AC 数量很低但 GPU 延迟没下降，最可能因为？", options:["GPU 稠密内核没有跳过零事件","spike 不是 0/1","LIF 没阈值","数据集太小"], answer:0, explanation:"算法稀疏不等于执行稀疏；后端 kernel 与数据布局决定是否兑现。" }
  ]
};
