"""Minimal, runnable Fashion-MNIST Spiking CNN with a hand-written LIF neuron.

Install:
    pip install torch torchvision
Run:
    python train_mnist_snn.py --epochs 5 --steps 12 --beta 0.9
"""
from __future__ import annotations

import argparse
import random
import time
from pathlib import Path

import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import DataLoader
from torchvision import datasets, transforms


class SpikeFn(torch.autograd.Function):
    @staticmethod
    def forward(ctx, u: torch.Tensor) -> torch.Tensor:
        ctx.save_for_backward(u)
        return (u >= 0).to(u.dtype)

    @staticmethod
    def backward(ctx, grad_output: torch.Tensor) -> torch.Tensor:
        (u,) = ctx.saved_tensors
        surrogate = 1.0 / (1.0 + 10.0 * u.abs()).pow(2)
        return grad_output * surrogate


spike_fn = SpikeFn.apply


class LIF(nn.Module):
    def __init__(self, beta: float = 0.9, threshold: float = 1.0):
        super().__init__()
        self.beta = beta
        self.threshold = threshold

    def forward(self, current: torch.Tensor, mem: torch.Tensor):
        mem = self.beta * mem + current
        spike = spike_fn(mem - self.threshold)
        mem = mem - spike.detach() * self.threshold
        return spike, mem


class SpikingCNN(nn.Module):
    def __init__(self, steps: int, beta: float, threshold: float):
        super().__init__()
        self.steps = steps
        self.conv1 = nn.Conv2d(1, 16, 3, padding=1)
        self.conv2 = nn.Conv2d(16, 32, 3, padding=1)
        self.fc = nn.Linear(32 * 7 * 7, 10)
        self.lif1 = LIF(beta, threshold)
        self.lif2 = LIF(beta, threshold)
        self.readout = LIF(beta, threshold)

    def forward(self, x: torch.Tensor):
        batch = x.size(0)
        mem1 = x.new_zeros(batch, 16, 14, 14)
        mem2 = x.new_zeros(batch, 32, 7, 7)
        mem_out = x.new_zeros(batch, 10)
        spike_sum = x.new_zeros(batch, 10)
        hidden_spikes = x.new_tensor(0.0)
        hidden_neurons = 0

        for _ in range(self.steps):
            cur1 = F.avg_pool2d(self.conv1(x), 2)
            spk1, mem1 = self.lif1(cur1, mem1)
            cur2 = F.avg_pool2d(self.conv2(spk1), 2)
            spk2, mem2 = self.lif2(cur2, mem2)
            spk_out, mem_out = self.readout(self.fc(spk2.flatten(1)), mem_out)
            spike_sum += spk_out
            hidden_spikes += spk1.sum() + spk2.sum()
            hidden_neurons += spk1.numel() + spk2.numel()

        hidden_rate = hidden_spikes / hidden_neurons
        return spike_sum, hidden_rate


def seed_everything(seed: int) -> None:
    random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)


def run_epoch(model, loader, device, optimizer=None):
    training = optimizer is not None
    model.train(training)
    total_loss = total_correct = total_samples = 0
    rate_sum = 0.0
    start = time.perf_counter()

    for images, labels in loader:
        images, labels = images.to(device), labels.to(device)
        with torch.set_grad_enabled(training):
            logits, spike_rate = model(images)
            loss = F.cross_entropy(logits, labels)
            if training:
                optimizer.zero_grad(set_to_none=True)
                loss.backward()
                optimizer.step()
        total_loss += loss.item() * labels.size(0)
        total_correct += (logits.argmax(1) == labels).sum().item()
        total_samples += labels.size(0)
        rate_sum += spike_rate.item() * labels.size(0)

    if device.type == "cuda":
        torch.cuda.synchronize()
    elapsed = time.perf_counter() - start
    return {
        "loss": total_loss / total_samples,
        "accuracy": total_correct / total_samples,
        "hidden_spike_rate": rate_sum / total_samples,
        "seconds": elapsed,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", default="./data")
    parser.add_argument("--epochs", type=int, default=5)
    parser.add_argument("--batch-size", type=int, default=128)
    parser.add_argument("--steps", type=int, default=12)
    parser.add_argument("--beta", type=float, default=0.9)
    parser.add_argument("--threshold", type=float, default=1.0)
    parser.add_argument("--lr", type=float, default=1e-3)
    parser.add_argument("--seed", type=int, default=7)
    parser.add_argument("--workers", type=int, default=2)
    args = parser.parse_args()

    seed_everything(args.seed)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    transform = transforms.ToTensor()
    train_set = datasets.FashionMNIST(args.data, train=True, download=True, transform=transform)
    test_set = datasets.FashionMNIST(args.data, train=False, download=True, transform=transform)
    train_loader = DataLoader(train_set, args.batch_size, shuffle=True, num_workers=args.workers, pin_memory=device.type == "cuda")
    test_loader = DataLoader(test_set, args.batch_size, shuffle=False, num_workers=args.workers, pin_memory=device.type == "cuda")

    model = SpikingCNN(args.steps, args.beta, args.threshold).to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=args.lr)
    print(f"device={device} steps={args.steps} beta={args.beta} threshold={args.threshold}")

    for epoch in range(1, args.epochs + 1):
        train = run_epoch(model, train_loader, device, optimizer)
        test = run_epoch(model, test_loader, device)
        print(
            f"epoch={epoch:02d} "
            f"train_loss={train['loss']:.4f} "
            f"test_acc={test['accuracy']:.4%} "
            f"spike_rate={test['hidden_spike_rate']:.4f} "
            f"test_seconds={test['seconds']:.2f}"
        )

    output = Path("fashion_mnist_snn.pt")
    torch.save({"model": model.state_dict(), "args": vars(args)}, output)
    print(f"saved={output.resolve()}")


if __name__ == "__main__":
    main()
