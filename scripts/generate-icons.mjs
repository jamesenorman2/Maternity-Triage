// Generates simple solid-shape PNG app icons with zero dependencies, using
// Node's built-in zlib for PNG encoding. Draws a rounded-square background
// with a plus-sign mark — good enough for a home-screen icon.
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";

const BG = [11, 18, 32]; // dark navy, matches app dark theme
const MARK = [230, 80, 90]; // coral-red, matches RED category accent

function crc32(buf) {
  let c;
  const table = crc32.table || (crc32.table = (() => {
    const t = [];
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })());
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function generatePng(size, { maskable = false } = {}) {
  const radius = maskable ? 0 : size * 0.22;
  const margin = maskable ? size * 0.18 : 0;
  const armThickness = size * 0.16;
  const armLength = size * 0.5;
  const cx = size / 2;
  const cy = size / 2;

  const raw = Buffer.alloc(size * (1 + size * 4));
  for (let y = 0; y < size; y++) {
    raw[y * (1 + size * 4)] = 0; // filter type: none
    for (let x = 0; x < size; x++) {
      const inBg = insideRoundedRect(x, y, size, radius, margin);
      const inMark = insidePlus(x, y, cx, cy, armLength, armThickness);
      const [r, g, b] = inBg ? (inMark ? MARK : BG) : [0, 0, 0];
      const a = inBg ? 255 : 0;
      const off = y * (1 + size * 4) + 1 + x * 4;
      raw[off] = r;
      raw[off + 1] = g;
      raw[off + 2] = b;
      raw[off + 3] = a;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const idat = deflateSync(raw);
  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function insideRoundedRect(x, y, size, radius, margin) {
  const left = margin, top = margin, right = size - margin, bottom = size - margin;
  if (x < left || x >= right || y < top || y >= bottom) return false;
  if (radius <= 0) return true;
  const nearLeft = x < left + radius;
  const nearRight = x >= right - radius;
  const nearTop = y < top + radius;
  const nearBottom = y >= bottom - radius;
  if ((nearLeft || nearRight) && (nearTop || nearBottom)) {
    const cx = nearLeft ? left + radius : right - radius;
    const cy = nearTop ? top + radius : bottom - radius;
    const dx = x - cx, dy = y - cy;
    return dx * dx + dy * dy <= radius * radius;
  }
  return true;
}

function insidePlus(x, y, cx, cy, armLength, armThickness) {
  const dx = Math.abs(x - cx);
  const dy = Math.abs(y - cy);
  const half = armLength / 2;
  const halfT = armThickness / 2;
  return (dx <= halfT && dy <= half) || (dy <= halfT && dx <= half);
}

mkdirSync("public/icons", { recursive: true });
for (const size of [192, 512]) {
  writeFileSync(`public/icons/icon-${size}.png`, generatePng(size));
}
writeFileSync("public/icons/maskable-512.png", generatePng(512, { maskable: true }));
console.log("Icons generated in public/icons/");
