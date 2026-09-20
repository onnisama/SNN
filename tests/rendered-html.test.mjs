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
  }
});
