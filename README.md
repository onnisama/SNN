# SNN Foundations

> 一套从神经元动力学出发，带学习者真正理解、实现并训练脉冲神经网络的中文交互式课程。

![MIT License](https://img.shields.io/badge/license-MIT-315149)
![Node.js 24](https://img.shields.io/badge/Node.js-24.x-315149)
![Next.js 16](https://img.shields.io/badge/Next.js-16-111111)

SNN Foundations 面向已经学过 PyTorch、CNN 与反向传播，但还没有系统学习 Spiking Neural Networks（SNN）的读者。它不是概念陈列页：每章都把直觉、公式、离散化、代码、实验和论文联系放在同一条学习路径中。

## 你能学到什么

- 从 ANN 与 SNN 的差异开始，理解 spike、状态与时间维度
- 推导 IF/LIF 神经元，并把连续模型写成可运行的 PyTorch 代码
- 理解 surrogate gradient 与 BPTT 为什么能够训练不可导的脉冲函数
- 学习卷积 SNN、事件相机、ANN-to-SNN、Spiking Transformer 与神经形态硬件
- 通过 7 个交互实验、章节测验、论文导读和两个期末项目完成知识闭环

## 课程组成

| 模块 | 内容 |
| --- | --- |
| 课程 | 12 章，从 LIF 到现代深层 SNN |
| 实验 | Spike Train、LIF、编码、Surrogate、BPTT、ANN vs SNN、事件相机 |
| 代码 | 手写 LIF、自定义反向传播、训练循环与 snnTorch 对照 |
| 论文 | 经 proceedings、OpenReview、CVF、IEEE 等来源核验的论文库和 6 篇导读 |
| 学习支持 | Checkpoint、常见误区、术语表、进度记录与 Final Mini Project |

课程进度只保存在浏览器 `localStorage`，项目不需要数据库、账号系统或服务端密钥。

## 快速开始

### 环境要求

- Node.js 24.x
- npm 11 或兼容版本

使用 nvm 时：

```bash
nvm install
nvm use
npm ci
npm run dev
```

打开终端显示的本地地址即可。没有使用 nvm 时，请先确认 `node --version` 为 24.x。

## 可用命令

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动本地开发服务器 |
| `npm run lint` | 检查 TypeScript、React 与 Next.js 代码规范 |
| `npm run build` | 生成生产静态站点到 `out/` |
| `npm test` | 构建并检查主要页面、公式和课程内容 |
| `npm run check` | 执行提交前的完整检查 |

## 项目结构

```text
app/          页面、路由与全局样式
components/   课程、实验、测验和导航组件
data/         章节、公式讲解、论文与题目数据
public/       可下载代码示例与静态资源
tests/        静态构建结果测试
.github/      CI、Issue 与 Pull Request 模板
```

添加内容时，优先修改 `data/` 中的结构化数据；不要把整章课程直接写进页面组件。

## 发布到 Vercel

最简单的发布流程是：

1. 在 GitHub 创建空仓库并推送本项目。
2. 在 Vercel 选择 **Add New → Project**，导入该 GitHub 仓库。
3. Framework Preset 保持 **Next.js**，Root Directory 保持仓库根目录。
4. 点击 **Deploy**。本项目不需要配置环境变量。

仓库中的 `vercel.json` 会让 Vercel 使用 `npm ci` 和 `npm run build`。连接 Git 后，推送到默认分支会更新生产站点，Pull Request 和其他分支会得到独立的 Preview Deployment。

也可以通过 CLI 手动创建预览或生产部署：

```bash
npx vercel
npx vercel --prod
```

## 参与贡献

欢迎修正文献资料、教学表述、公式推导、可访问性问题和交互实验。开始前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)；提交问题时尽量给出具体章节、公式或论文链接。

涉及理论结论或论文信息的修改必须附可核验来源。教学内容应说明“为什么”，避免只替换术语或堆砌公式。

## 内容边界

- 推荐等级表示学习顺序，不代表论文质量排名。
- 能效相关内容区分理论操作量、芯片实测能耗与普通 GPU 训练成本。
- 课程用于教学与研究入门，不把未经复现的实验数字写成确定结论。

## License

代码与原创课程内容采用 [MIT License](LICENSE)。引用论文、库和外部资料仍遵循其各自许可与署名要求。
