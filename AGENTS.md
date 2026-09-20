你现在是一名同时具备以下能力的专家：

1. 脉冲神经网络（Spiking Neural Networks, SNN）研究者；
2. 深度学习 / 神经形态计算（Neuromorphic Computing）教师；
3. 前端交互与科学可视化设计师；
4. AI/机器学习论文调研人员；
5. 优秀的技术课程设计者。

请直接为我完整构建一个高质量的中文 **Interactive SNN Foundations Course** 网站。

这不是一个介绍 SNN 的展示型网页，而是一套真正可以完成 **Spiking Neural Networks（SNN，脉冲神经网络）入门** 的交互式课程。

最终目标：

> 一个已经学过基础深度学习、PyTorch、CNN、Transformer，但没有系统学习过 SNN 的计算机专业本科生，认真学完整个网站后，应当能够理解 SNN 的核心理论、看懂基础与现代 SNN 论文，并能够自己实现和训练基础 SNN。

优先级必须是：

**教学质量 > 理论准确性 > 可视化效果 > UI 美观度。**

不要为了做漂亮页面而牺牲内容深度。

你可以适当在要求内容上做一些拓展，但目的一定是让用户可以更深入地学习 SNN。

------

# 1. 目标用户

默认学习者已经掌握：

- Python
- PyTorch
- 基本神经网络
- Backpropagation
- CNN
- Transformer 基础
- 基本线性代数

但对 SNN 基本零基础。

因此不要花大量篇幅解释“什么是神经网络”。

重点完成：

ANN
→ Spike
→ Neuron Dynamics
→ LIF
→ Temporal Dynamics
→ Spike Encoding
→ SNN Forward
→ Training Difficulty
→ Surrogate Gradient
→ BPTT
→ Deep SNN
→ Event Camera
→ Modern SNN Research

------

# 2. 网站形式

做成一个真正的：

**交互式电子教材 / Mini Course**

而不是普通长页面。

建议包含：

- Home / Learning Roadmap
- Course Chapters
- Interactive Lab
- Code Lab
- Paper Library
- Quiz / Checkpoint
- Glossary
- Learning Progress

使用现代科研教学网站风格。

参考：

- Distill
- TensorFlow Playground
- Interactive scientific textbook
- 现代技术文档站

UI 要克制、专业、清晰。

不要大量无意义：

- 渐变
- 粒子动画
- Landing Page 营销文案
- 重复圆角卡片

动画和交互必须服务于理解。

------

# 3. 核心课程内容

至少覆盖以下内容。

## Chapter 1：ANN vs SNN

解释：

- 普通 ANN 神经元如何计算
- SNN 为什么引入时间
- spike 是什么
- spike train 是什么
- firing rate
- event-driven computation

重点让学习者建立：

> SNN 不只是把 ReLU 换成 0/1，而是网络状态随时间演化。

------

## Chapter 2：IF / LIF Neuron

这是整个课程的核心章节之一。

必须深入解释：

- membrane potential
- input current
- leak
- threshold
- fire
- reset

从连续模型：

τ dV/dt

逐步讲到离散形式：

V[t] = βV[t-1] + I[t]

以及：

V[t] ≥ Vth → spike

不要只给公式。

必须同时解释：

**直觉 → 数学 → 离散化 → PyTorch 实现。**

------

## Chapter 3：Temporal Dynamics

解释：

- time step
- state
- membrane memory
- spike sequence

通过逐时间步动画展示：

t = 0

t = 1

t = 2

...

每一步的：

input spike

weighted current

membrane potential

output spike

必须让学习者真正理解为什么 SNN 是时序模型。

------

## Chapter 4：Spike Encoding

至少介绍：

- Rate Coding
- Temporal Coding
- Latency Coding
- Population Coding

重点比较：

Rate Coding vs Temporal Coding。

不要只介绍定义，要解释：

- 信息如何编码
- latency
- robustness
- spike sparsity
- computational cost

------

## Chapter 5：为什么 SNN 难训练？

解释 spike function：

S = H(V - Vth)

以及为什么：

dS/dV

导致普通 backpropagation 出问题。

然后引入：

**Surrogate Gradient**

必须强调：

> Forward 仍然使用真正的 spike function，
> surrogate function 主要用于 backward gradient estimation。

介绍常见 surrogate：

- Sigmoid
- Fast Sigmoid
- Arctan
- Triangular

------

## Chapter 6：BPTT

解释：

Backpropagation Through Time。

展示 SNN 在时间维度展开后的 computational graph：

t0 → t1 → t2 → t3

说明：

membrane potential

为什么形成时间依赖。

解释梯度如何经过：

Loss
→ Spike
→ Surrogate Gradient
→ Membrane Potential
→ Previous Time Step
→ Weight

这一章结束以后，应当能理解 SNN 基本训练机制。

------

## Chapter 7：实现第一个 SNN

用真实代码完整实现一个简单网络。

优先：

MNIST / Fashion-MNIST。

至少包含：

Dataset
→ Encoding
→ Network
→ LIF
→ Forward
→ Loss
→ Backward
→ Training
→ Evaluation

先手写一个简化 LIF neuron。

然后再使用：

- snnTorch
  或
- SpikingJelly

不要让框架 API 掩盖原理。

------

## Chapter 8：Convolutional SNN

解释：

Conv → LIF

以及典型 Tensor：

[T, B, C, H, W]

每个维度是什么意思。

解释：

Spatial Information

和

Temporal Information

如何同时存在。

------

## Chapter 9：Event Camera × SNN

这是重点章节。

解释 Event Camera 输出：

e = (x, y, t, p)

并和 RGB Frame 对比。

解释：

Event Stream

为什么天然适合 temporal / event-driven processing。

但是必须明确：

> Event Camera 并不等于必须使用 SNN。

同时介绍现代事件视觉中常见：

- Event Frame
- Voxel Grid
- CNN
- Transformer
- SNN

让学习者理解它们的关系。

------

## Chapter 10：ANN-to-SNN Conversion

介绍：

ANN → SNN Conversion

包括：

- activation → firing rate
- threshold
- conversion error
- latency

并比较：

Conversion-based Training

vs

Direct Training。

------

## Chapter 11：Modern Deep SNN

介绍现代架构：

- Deep SNN
- Residual SNN
- Spiking ResNet
- Spiking Transformer
- Spiking Vision Transformer
- Attention in SNN

重点不是罗列名字，而是解释：

> 传统 ANN architecture 如何被改造成具有 spike / temporal dynamics 的网络。

------

## Chapter 12：Efficiency & Neuromorphic Computing

解释：

为什么 SNN 被认为可能更加节能。

涉及：

- sparse spikes
- event-driven computation
- MAC
- accumulate operation
- neuromorphic hardware

介绍：

- Intel Loihi
- IBM TrueNorth
- SpiNNaker

必须强调：

> SNN 在普通 GPU 上训练时并不一定比 ANN 更省计算或更省电。

不要夸大 SNN 优势。

------

# 4. 统一教学模板

核心章节尽量遵循统一结构：

1. **Intuition**
   用直觉解释它是什么。
2. **Why**
   为什么需要这个机制。
3. **Math**
   给出必要数学表达。
4. **Visualization**
   用交互图展示机制。
5. **Code**
   给出对应 PyTorch 实现。
6. **Experiment**
   改参数观察结果。
7. **Common Mistakes**
   解释常见误区。
8. **Research Connection**
   告诉学习者现代论文如何使用这一机制。

避免纯文本堆砌。

------

# 5. Interactive Lab

至少实现以下真正可交互实验。

## Lab 1：Spike Train Generator

调节：

- firing rate
- duration
- random seed

显示 spike train。

------

## Lab 2：LIF Simulator

调节：

- input current
- beta / decay
- threshold
- reset
- time step

绘制：

- Input
- Membrane Potential
- Threshold
- Spike

改变参数后必须实时更新。

------

## Lab 3：Spike Encoding

输入 0～1 数值。

动态展示：

- Rate Coding
- Temporal Coding

对应 spike train。

------

## Lab 4：Surrogate Gradient

同时显示：

- Heaviside
- surrogate function
- surrogate derivative

可切换：

Sigmoid / Fast Sigmoid / Arctan 等。

------

## Lab 5：BPTT Visualization

通过：

Next Step

观察：

Forward

和

Backward

如何经过多个 time step。

------

## Lab 6：ANN vs SNN

同一输入下比较：

ANN activation

与

SNN spike sequence。

------

## Lab 7：Event Camera Simulator

使用简单移动物体。

左侧：

RGB Frames

右侧：

Event Stream。

让用户看到：

brightness change

如何触发 positive / negative events。

------

# 6. 数学与代码

所有数学使用：

KaTeX 或 MathJax。

对于重要公式，坚持：

直觉
→ 数学
→ 离散化
→ 代码

例如：

LIF：

物理/直觉解释

↓

连续公式

↓

离散公式

↓

```python
mem = beta * mem + current
```

↓

threshold / spike / reset。

代码必须是真实合理、尽量可以运行。

至少包含：

- 手写 LIF
- 简单 PyTorch SNN
- snnTorch 或 SpikingJelly 示例
- 完整训练示例

------

# 7. 论文调研

网站必须包含一个真正有价值的：

**SNN Paper Library**

不要只根据模型记忆生成。

在制作论文部分之前，先进行真实联网调研。

重点调研最近约 3～5 年，同时保留少量重要经典论文。

重点方向：

- Surrogate Gradient
- Directly-trained SNN
- ANN-to-SNN Conversion
- Deep SNN
- Spiking ResNet
- Spiking Transformer
- Spiking Vision Transformer
- Event-based Vision + SNN
- Temporal Coding
- Neuromorphic Vision
- Energy Efficiency
- Self-supervised SNN
- Large-scale SNN

优先检索：

- NeurIPS
- ICML
- ICLR
- CVPR
- ICCV
- ECCV
- AAAI
- IJCAI
- IEEE 重要期刊
- Nature / Science 系列相关重要论文

但不要为了“顶会”强行加入不重要的工作。

------

# 8. 论文真实性要求

论文信息禁止 hallucination。

至少通过以下来源核实：

- CVF Open Access
- OpenReview
- NeurIPS Proceedings
- PMLR
- IEEE Xplore
- ACM Digital Library
- arXiv
- 官方项目主页
- 作者 GitHub

每篇至少核对：

- Title
- Authors
- Year
- Venue
- Paper URL
- Code URL（若存在）

如果展示 CCF 等级：

必须查询当前有效 CCF 推荐目录。

无法确认时明确写：

**非 CCF / 暂无 CCF 等级**

绝对不要猜。

------

# 9. Paper Library

精选大约：

**20～30 篇**

即可。

不要为了数量堆论文。

分类建议：

Foundations

Training

Architecture

Vision

Event-based Vision

Transformer

Efficiency

Neuromorphic Hardware

每篇显示：

- Title
- Year
- Venue
- CCF Level
- Problem
- Core Idea
- Why It Matters
- Prerequisites
- Paper Link
- Code Link

并设置：

Essential

Recommended

Optional

这里仅表示：

**作为学习材料的推荐程度**

不代表论文质量排名。

------

# 10. 深度论文导读

从 Paper Library 中选择约：

5～8 篇最值得入门者仔细阅读的论文。

制作详细 Reading Guide。

每篇回答：

1. 论文解决了什么问题？
2. 为什么之前的方法存在问题？
3. 核心 idea 是什么？
4. Architecture 怎么工作？
5. 最重要的公式是什么？
6. Experiment 证明了什么？
7. 有哪些 limitation？
8. 学完这篇论文应该记住哪 3 个点？

不要简单复制 abstract。

------

# 11. Research Landscape

制作一个交互式：

**SNN Research Map**

例如：

SNN
├── Neuron Models
├── Encoding
├── Training
│ ├── Surrogate Gradient
│ └── ANN-SNN Conversion
├── Architecture
│ ├── CNN
│ ├── ResNet
│ └── Transformer
├── Event Vision
├── Efficiency
└── Neuromorphic Hardware

点击节点：

跳转到对应课程和论文。

------

# 12. Quiz / Checkpoint

每章结束加入少量高质量问题。

不要只考名词。

包括：

- 概念题
- 简单计算题
- 代码理解题
- 判断题
- 论文理解题

例如：

V[t-1] = 0.7

β = 0.8

Input = 0.5

Threshold = 1

计算：

V[t]

并判断是否产生 spike。

回答后立即显示：

正确答案 + 详细解析。

------

# 13. 常见误区

专门设置 Common Misconceptions。

至少回答：

- SNN 是二值神经网络吗？
- Spike 只有 0/1，为什么可以表示复杂信息？
- SNN 一定比 ANN 省电吗？
- Event Camera 必须配 SNN 吗？
- Spike 不可导为什么还能训练？
- SNN 就是 RNN 吗？
- Time Step 越多越好吗？
- Spike Rate 越高越好吗？

------

# 14. Final Mini Project

课程最后加入一个完整小项目。

可以提供两条路线：

### Track A

MNIST / Fashion-MNIST

Spiking CNN

### Track B

N-MNIST / DVS Gesture 等 Neuromorphic Dataset

项目应包含：

- Environment
- Dataset
- Model
- Training
- Evaluation
- Visualization

允许修改：

- beta
- threshold
- time steps
- network depth

观察：

- accuracy
- spike rate
- latency
- computation

的变化。

------

# 15. Glossary

加入术语表。

至少包括：

SNN

Spike

Spike Train

Firing Rate

IF

LIF

Membrane Potential

Leak

Threshold

Reset

Time Step

Surrogate Gradient

BPTT

Rate Coding

Temporal Coding

ANN-to-SNN

Neuromorphic Computing

Event Camera

Polarity

每个术语：

一句话解释 + 对应章节链接。

------

# 16. 技术实现

优先使用：

- Next.js
- TypeScript
- React
- Tailwind CSS
- KaTeX
- D3.js 或适合的 visualization library

可以使用：

Framer Motion

但只用于有意义的教学动画。

要求：

```bash
npm install
npm run dev
```

即可运行。

尽量不依赖后端。

学习进度可以使用：

localStorage。

课程、论文数据建议模块化维护：

/content

/data

/components

/labs

等。

不要把整个课程硬编码在一个巨大组件里。

------

# 17. 内容质量要求

禁止：

- 大量 AI 套话
- 空泛定义
- 为了显得高级堆公式
- 只做漂亮 UI
- 编造论文
- 编造实验数字
- 编造 CCF
- “SNN 非常强大、前景广阔”之类没有信息量的话

核心概念至少回答：

What

Why

How

Math

Code

Experiment

Research Connection

------

# 18. 最终学习目标

学完整个站点以后，用户应该能够独立回答：

1. SNN 和 ANN 的本质区别是什么？
2. Spike 和 Spike Train 是什么？
3. LIF 如何工作？
4. Leak 有什么作用？
5. Threshold 和 Reset 是什么？
6. Time Step 为什么重要？
7. Spike 如何编码信息？
8. 为什么 Spike Function 难以直接求导？
9. Surrogate Gradient 如何工作？
10. BPTT 如何训练 SNN？
11. SNN 如何形成深层网络？
12. Event Camera 为什么和 SNN 很契合？
13. Event Camera 是否必须使用 SNN？
14. SNN 的能效优势来自哪里？
15. 为什么普通 GPU 上的 SNN 不一定更加高效？
16. ANN-to-SNN Conversion 是什么？
17. 现代 Spiking Transformer 大致在解决什么问题？
18. 如何用 PyTorch 实现并训练一个基础 SNN？

如果网站无法帮助学习者回答这些问题，说明课程还没有完成。

------

# 19. 执行方式

不要只输出：

- 项目规划
- README
- 页面草图
- 示例代码片段

请直接完整构建网站。

由你自己完成：

论文调研

→

课程结构设计

→

内容编写

→

UI 实现

→

交互实验实现

→

代码示例

→

Paper Library

→

Quiz

→

Citation

→

运行项目

→

浏览器检查

→

修复报错与布局问题。

在完成前自行检查：

- 所有主要页面是否能正常打开；
- 交互实验是否真正工作；
- 移动端和桌面端是否正常；
- 公式是否渲染；
- 代码是否正确展示；
- Paper Link 是否有效；
- 是否存在明显 hallucination；
- 是否存在空页面或 placeholder；
- console 是否有明显错误。

最终成品应该像：

> **一套真正可以把本科生从“只听说过 SNN”带到“可以开始读和复现 SNN 论文”的交互式基础课程。**

现在请直接开始构建，而不是继续向我输出规划。

