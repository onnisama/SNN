const lif = `import torch
import torch.nn as nn
import torch.nn.functional as F

class SpikeFn(torch.autograd.Function):
    @staticmethod
    def forward(ctx, u):
        ctx.save_for_backward(u)
        return (u >= 0).to(u.dtype)

    @staticmethod
    def backward(ctx, grad):
        (u,) = ctx.saved_tensors
        return grad / (1 + 10 * u.abs()).pow(2)

spike_fn = SpikeFn.apply

class LIF(nn.Module):
    def __init__(self, beta=0.9, threshold=1.0):
        super().__init__()
        self.beta, self.threshold = beta, threshold

    def forward(self, current, mem):
        mem = self.beta * mem + current
        spk = spike_fn(mem - self.threshold)
        mem = mem - spk.detach() * self.threshold
        return spk, mem`;

const network = `class SimpleSNN(nn.Module):
    def __init__(self, steps=20):
        super().__init__()
        self.steps = steps
        self.fc1 = nn.Linear(28 * 28, 256)
        self.fc2 = nn.Linear(256, 10)
        self.lif1, self.lif2 = LIF(), LIF()

    def forward(self, x):
        x = x.flatten(1)
        mem1 = x.new_zeros(x.size(0), 256)
        mem2 = x.new_zeros(x.size(0), 10)
        outputs = []
        for _ in range(self.steps):
            spk1, mem1 = self.lif1(self.fc1(x), mem1)
            spk2, mem2 = self.lif2(self.fc2(spk1), mem2)
            outputs.append(spk2)
        return torch.stack(outputs).sum(0)

model = SimpleSNN().to(device)
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
for images, labels in train_loader:
    images, labels = images.to(device), labels.to(device)
    loss = F.cross_entropy(model(images), labels)
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()`;

const snntorch = `import snntorch as snn
from snntorch import surrogate

spike_grad = surrogate.fast_sigmoid(slope=25)
lif = snn.Leaky(beta=0.9, spike_grad=spike_grad)

# forward 返回 spike 与 membrane state
spk, mem = lif(current, mem)

# 多步训练时仍要明确初始化、时间循环与读出：
# logits = torch.stack(spk_rec).sum(0)`;

export default function CodeLab(){
  return <div className="page-shell"><header className="content-header"><span className="big-number">⌘</span><div><h1>Code Lab</h1><p>先手写状态与 surrogate，再使用框架。代码以可运行的 PyTorch 训练路径组织。</p></div><div className="meta-stack">PYTORCH<br/>MNIST</div></header>
  <div className="code-pipeline">{["Dataset","Encoding","Network","LIF state","Loss + BPTT","Evaluation"].map(x=><span key={x}>{x}</span>)}</div>
  <article className="chapter-article" style={{maxWidth:900}}>
    <section><h2>1. 手写 LIF 与真实 surrogate backward</h2><p>前向用硬阈值；backward 只替换局部导数。reset 路径用 detach，避免把 reset 当作连续可导过程。</p><pre><code>{lif}</code></pre></section>
    <section><h2>2. 完整的时间展开与训练</h2><p>示例使用直接编码：静态图像在每一步作为电流输入。输出层 spike count 作为分类 logits。</p><pre><code>{network}</code></pre><div className="callout warning">真实实验还应加入 DataLoader、验证集、随机种子、checkpoint，以及 accuracy / spike rate / latency 四项记录。不要只报告准确率。</div></section>
    <section><h2>3. 再使用 snnTorch</h2><p>框架减少样板代码，但不会替你决定状态何时清零、时间维放在哪里、用什么读出和损失。</p><pre><code>{snntorch}</code></pre></section>
    <section><h2>4. 评估协议</h2><div className="concept-grid"><div className="concept"><h3>Accuracy</h3><p>固定时间步和读出规则后，在测试集统计 top-1。</p></div><div className="concept"><h3>Spike rate</h3><p>各层 spike 数除以神经元数与时间步，分层报告。</p></div><div className="concept"><h3>Latency</h3><p>同时报告算法时间步与真实墙钟时间，两者不是一回事。</p></div><div className="concept"><h3>Compute</h3><p>区分理论 AC/MAC 估算、GPU 实测与神经形态芯片实测。</p></div></div></section>
  </article>
  <div className="section-head"><span className="folio">FIN</span><h2>Final Mini Project</h2><p>两条路线共用同一份实验表，避免只追一个 accuracy 数字。</p></div>
  <div className="project-tracks"><div className="track"><h2>Track A</h2><h3>Fashion-MNIST Spiking CNN</h3><ol><li>Conv → LIF → Pool × 2，输出 spike count。</li><li>扫描 beta ∈ 0.7 / 0.85 / 0.95 与 T ∈ 4 / 8 / 16。</li><li>记录 accuracy、平均 spike rate、墙钟 latency 与峰值显存。</li><li>解释为什么更高 T 不一定带来更好成本—精度比。</li></ol></div><div className="track"><h2>Track B</h2><h3>N-MNIST / DVS Gesture</h3><ol><li>比较 event frame、voxel grid 与直接 time bins。</li><li>固定网络，改变切片宽度与极性通道。</li><li>可视化输入事件、隐藏层 spike 与混淆矩阵。</li><li>明确说明数据表示，而不是把“event-based”当成模型描述。</li></ol></div></div>
  </div>
}
