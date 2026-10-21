#!/usr/bin/env node
// Validates every reference-topic content file: required fields present,
// every block has a heading and at least one bullet, every topic has at
// least one citation, and lists all VERIFY-flagged citations for clinician
// review. Run via `npm run validate`.
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const ROOT = new URL("../src/content/topics", import.meta.url).pathname;
const SECTIONS = new Set(["antenatal", "intrapartum", "postnatal", "general", "emergency", "trust"]);

function findJsonFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...findJsonFiles(full));
    else if (entry.name.endsWith(".json")) out.push(full);
  }
  return out;
}

let errors = [];
let verifyList = [];
let topicCount = 0;
const seenIds = new Set();

for (const file of findJsonFiles(ROOT)) {
  const rel = path.relative(process.cwd(), file);
  let topic;
  try {
    topic = JSON.parse(readFileSync(file, "utf-8"));
  } catch (e) {
    errors.push(`${rel}: invalid JSON — ${e.message}`);
    continue;
  }

  if (!topic.id || !topic.title || !topic.section || !topic.summary || !topic.lastReviewed) {
    errors.push(`${rel}: missing required top-level field (id/title/section/summary/lastReviewed)`);
    continue;
  }
  topicCount++;

  if (seenIds.has(topic.id)) {
    errors.push(`${rel}: duplicate topic id "${topic.id}"`);
  }
  seenIds.add(topic.id);

  if (!SECTIONS.has(topic.section)) {
    errors.push(`${rel}: invalid section "${topic.section}"`);
  }

  if (!Array.isArray(topic.blocks) || topic.blocks.length === 0) {
    errors.push(`${rel}: has no content blocks`);
  } else {
    topic.blocks.forEach((block, i) => {
      if (!block.heading) {
        errors.push(`${rel}: block[${i}] missing heading`);
      }
      if (!Array.isArray(block.bullets) || block.bullets.length === 0) {
        errors.push(`${rel}: block "${block.heading ?? i}" has no bullets`);
      }
    });
  }

  if (!Array.isArray(topic.citations) || topic.citations.length === 0) {
    errors.push(`${rel}: has no citations`);
  } else {
    for (const c of topic.citations) {
      if (c.verify) {
        verifyList.push(`${rel} :: ${c.guideline} — ${c.section}`);
      }
    }
  }

  if (topic.redFlags && !Array.isArray(topic.redFlags)) {
    errors.push(`${rel}: redFlags must be an array if present`);
  }
}

console.log(`Validated ${topicCount} topic file(s).\n`);

if (verifyList.length > 0) {
  console.log(`⚠ ${verifyList.length} citation(s) flagged VERIFY — review before clinical reliance:\n`);
  for (const v of verifyList) console.log(`  - ${v}`);
  console.log("");
}

if (errors.length > 0) {
  console.error(`✗ ${errors.length} content error(s):\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log("✓ All topic content is structurally valid.");
