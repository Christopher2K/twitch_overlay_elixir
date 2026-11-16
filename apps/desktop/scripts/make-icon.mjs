// Generates build/icon.icns without any image dependencies: renders a
// 1024px PNG with signed-distance fields, then uses sips + iconutil.
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const buildDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "build");
const SIZE = 1024;
const SS = 2; // supersampling factor

function crc32(buf) {
  let c;
  let crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, "ascii");
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}

function encodePNG(width, height, rgba) {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function sdRoundRect(x, y, cx, cy, hw, hh, r) {
  const qx = Math.abs(x - cx) - (hw - r);
  const qy = Math.abs(y - cy) - (hh - r);
  return (
    Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) +
    Math.min(Math.max(qx, qy), 0) -
    r
  );
}

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const coverage = (sd) => clamp01(0.5 - sd);
const lerp = (a, b, t) => a + (b - a) * t;

// Indigo gradient background with two white caption lines.
const TOP = [99, 102, 241];
const BOTTOM = [67, 56, 202];
const bars = [
  { cx: 512, cy: 420, hw: 264, hh: 58 },
  { cx: 448, cy: 608, hw: 200, hh: 58 },
];

const rgba = Buffer.alloc(SIZE * SIZE * 4);
for (let py = 0; py < SIZE; py++) {
  for (let px = 0; px < SIZE; px++) {
    let bgCov = 0;
    let barCov = 0;
    let gradT = 0;
    for (let sy = 0; sy < SS; sy++) {
      for (let sx = 0; sx < SS; sx++) {
        const x = px + (sx + 0.5) / SS;
        const y = py + (sy + 0.5) / SS;
        bgCov += coverage(sdRoundRect(x, y, 512, 512, 460, 460, 208));
        for (const bar of bars) {
          barCov += coverage(sdRoundRect(x, y, bar.cx, bar.cy, bar.hw, bar.hh, bar.hh));
        }
        gradT += y / SIZE;
      }
    }
    const samples = SS * SS;
    bgCov /= samples;
    barCov = Math.min(1, barCov / samples);
    gradT /= samples;

    const r = lerp(lerp(TOP[0], BOTTOM[0], gradT), 255, barCov);
    const g = lerp(lerp(TOP[1], BOTTOM[1], gradT), 255, barCov);
    const b = lerp(lerp(TOP[2], BOTTOM[2], gradT), 255, barCov);

    const i = (py * SIZE + px) * 4;
    rgba[i] = Math.round(r);
    rgba[i + 1] = Math.round(g);
    rgba[i + 2] = Math.round(b);
    rgba[i + 3] = Math.round(bgCov * 255);
  }
}

mkdirSync(buildDir, { recursive: true });
const pngPath = path.join(buildDir, "icon.png");
writeFileSync(pngPath, encodePNG(SIZE, SIZE, rgba));

const iconset = path.join(buildDir, "icon.iconset");
mkdirSync(iconset, { recursive: true });
for (const size of [16, 32, 128, 256, 512]) {
  for (const scale of [1, 2]) {
    const px = size * scale;
    const name = scale === 1 ? `icon_${size}x${size}.png` : `icon_${size}x${size}@2x.png`;
    execFileSync("sips", ["-z", String(px), String(px), pngPath, "--out", path.join(iconset, name)], {
      stdio: "ignore",
    });
  }
}
execFileSync("iconutil", ["-c", "icns", iconset, "-o", path.join(buildDir, "icon.icns")]);
console.log(`wrote ${path.join(buildDir, "icon.icns")}`);