import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry => {
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(filename) : entry.name.endsWith(".html") ? [filename] : [];
  }));
  return nested.flat();
}

test("LaTeX commands that contain backslashes use raw template strings", async () => {
  const source = await readFile(path.join(root, "data", "chapters.ts"), "utf8");
  const unsafe = source.split(/\r?\n/).filter(line => line.includes("latex:") && line.includes("\\") && !line.includes("String.raw"));
  assert.deepEqual(unsafe, [], `unsafe formula strings:\n${unsafe.join("\n")}`);
});

test("all rendered course chapters contain valid KaTeX without error nodes", async () => {
  const files = await htmlFiles(path.join(root, "out", "course"));
  assert.equal(files.length, 12);
  for (const filename of files) {
    const html = await readFile(filename, "utf8");
    assert.match(html, /class="katex"/, filename);
    assert.doesNotMatch(html, /katex-error/, filename);
    assert.equal((html.match(/class="deep-dive"/g) ?? []).length, 2, filename);
    assert.equal((html.match(/class="quiz-item"/g) ?? []).length, 3, filename);
    const formulas = (html.match(/class="math-card"/g) ?? []).length;
    assert.ok(formulas >= 2, `${filename}: expected at least two formulas`);
    assert.equal((html.match(/class="formula-reading"/g) ?? []).length, formulas, `${filename}: every formula needs a plain-language reading`);
    assert.equal((html.match(/class="worked-example"/g) ?? []).length, formulas, `${filename}: every formula needs a worked example`);
  }
});

test("completion page and runnable training script are included in the export", async () => {
  const finish = await readFile(path.join(root, "out", "finish", "index.html"), "utf8");
  const script = await readFile(path.join(root, "out", "train_mnist_snn.py"), "utf8");
  assert.match(finish, /You Finished/);
  assert.match(script, /class SpikingCNN/);
  assert.match(script, /hidden_spike_rate/);
});
