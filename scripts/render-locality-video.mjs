import { spawn } from "node:child_process";
import { mkdir, rm, writeFile, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const FPS = 30;
const DURATION_SECONDS = 28;
const FRAME_COUNT = FPS * DURATION_SECONDS;
const PORT = 9333;
const framesDir = path.join(ROOT, ".locality-render-frames");
const profileDir = path.join(ROOT, ".locality-render-profile");
const outputDir = path.join(ROOT, "renders");
const outputPath = path.join(outputDir, "locality-promo.mp4");
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

if (!existsSync(chromePath)) throw new Error(`Chrome not found at ${chromePath}`);

await rm(framesDir, { recursive: true, force: true });
await rm(profileDir, { recursive: true, force: true });
await mkdir(framesDir, { recursive: true });
await mkdir(outputDir, { recursive: true });

const chrome = spawn(chromePath, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--no-first-run",
  "--no-default-browser-check",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${profileDir}`,
  "--window-size=1920,1080",
  "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let endpoint;
for (let attempt = 0; attempt < 50; attempt += 1) {
  try {
    const pages = await fetch(`http://127.0.0.1:${PORT}/json/list`).then((response) => response.json());
    endpoint = pages.find((page) => page.type === "page")?.webSocketDebuggerUrl;
    if (endpoint) break;
  } catch {}
  await sleep(100);
}
if (!endpoint) throw new Error("Could not connect to Chrome DevTools.");

const socket = new WebSocket(endpoint);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let commandId = 0;
const pending = new Map();
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++commandId;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});

let acceptingFrames = false;
let firstTimestamp;
let lastIndex = -1;
let lastFramePath;
let writeQueue = Promise.resolve();

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id) {
    const waiter = pending.get(message.id);
    if (!waiter) return;
    pending.delete(message.id);
    if (message.error) waiter.reject(new Error(message.error.message));
    else waiter.resolve(message.result);
    return;
  }
  if (message.method !== "Page.screencastFrame") return;
  socket.send(JSON.stringify({ id: ++commandId, method: "Page.screencastFrameAck", params: { sessionId: message.params.sessionId } }));
  if (!acceptingFrames) return;

  const timestamp = message.params.metadata.timestamp;
  if (firstTimestamp === undefined) firstTimestamp = timestamp;
  const targetIndex = Math.min(FRAME_COUNT - 1, Math.round((timestamp - firstTimestamp) * FPS));
  if (targetIndex <= lastIndex) return;
  const bytes = Buffer.from(message.params.data, "base64");

  writeQueue = writeQueue.then(async () => {
    for (let index = lastIndex + 1; index < targetIndex; index += 1) {
      const gapPath = path.join(framesDir, `${String(index).padStart(6, "0")}.jpg`);
      if (lastFramePath) await copyFile(lastFramePath, gapPath);
      else await writeFile(gapPath, bytes);
    }
    const framePath = path.join(framesDir, `${String(targetIndex).padStart(6, "0")}.jpg`);
    await writeFile(framePath, bytes);
    lastFramePath = framePath;
    lastIndex = targetIndex;
  });
});

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url: "http://localhost:3000/locality-video?clean=true" });
await sleep(1800);
await send("Page.startScreencast", { format: "jpeg", quality: 92, maxWidth: 1920, maxHeight: 1080, everyNthFrame: 1 });
await send("Runtime.evaluate", { expression: "window.dispatchEvent(new KeyboardEvent('keydown', {key: 'r'}))" });
acceptingFrames = true;
await sleep((DURATION_SECONDS + 0.25) * 1000);
acceptingFrames = false;
await send("Page.stopScreencast");
await writeQueue;

if (!lastFramePath) throw new Error("Chrome did not emit any video frames.");
for (let index = lastIndex + 1; index < FRAME_COUNT; index += 1) {
  await copyFile(lastFramePath, path.join(framesDir, `${String(index).padStart(6, "0")}.jpg`));
}

const ffmpeg = spawn("ffmpeg", [
  "-y",
  "-framerate", String(FPS),
  "-i", path.join(framesDir, "%06d.jpg"),
  "-c:v", "libx264",
  "-preset", "slow",
  "-crf", "18",
  "-pix_fmt", "yuv420p",
  "-movflags", "+faststart",
  outputPath,
], { stdio: "inherit" });

const exitCode = await new Promise((resolve) => ffmpeg.on("exit", resolve));
socket.close();
chrome.kill();
await rm(framesDir, { recursive: true, force: true });
await rm(profileDir, { recursive: true, force: true });
if (exitCode !== 0) throw new Error(`FFmpeg exited with code ${exitCode}`);

console.log(`Rendered ${outputPath}`);
