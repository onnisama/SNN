# SNN Foundations

一套面向已掌握深度学习基础的本科生与初学研究者的中文交互式 SNN 课程。

## 本地运行

```bash
npm install
npm run dev
```

打开开发服务器给出的本地地址。课程进度保存在浏览器 `localStorage`，不需要后端。

## 内容

- 12 章：从 ANN vs SNN、LIF、时间动力学、编码、Surrogate Gradient 与 BPTT，到事件视觉、ANN-to-SNN、Spiking Transformer 与神经形态硬件
- 7 个可交互实验
- 手写 PyTorch LIF、surrogate backward、完整训练循环与 snnTorch 对照
- 经会议 proceedings、OpenReview、CVF、IEEE 等来源核验的论文库与 6 篇深度导读
- 每章 Checkpoint、常见误区、术语表与两个 Final Mini Project

## 验证

```bash
npm run build
```

项目采用 Next.js 静态导出，生成目录为 `out/`。
