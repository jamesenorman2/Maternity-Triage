#!/usr/bin/env node
// Validates every pathway content file: every `next` resolves to a real
// node, every outcome has a category and at least one citation, and lists
// all VERIFY-flagged citations for clinician review. Run via `npm run validate`.
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const ROOT = new URL("../src/content", import.meta.url).pathname;
const CATEGORIES = new Set(["RED", "ORANGE", "YELLOW", "GREEN"]);

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
let pathwayCount = 0;
let nodeCount = 0;

for (const file of findJsonFiles(ROOT)) {
  const rel = path.relative(process.cwd(), file);
  let pathway;
  try {
    pathway = JSON.parse(readFileSync(file, "utf-8"));
  } catch (e) {
    errors.push(`${rel}: invalid JSON — ${e.message}`);
    continue;
  }

  if (!pathway.id || !pathway.title || !pathway.startNode || !pathway.nodes) {
    errors.push(`${rel}: missing required top-level field (id/title/startNode/nodes)`);
    continue;
  }
  pathwayCount++;

  const nodes = pathway.nodes;
  const nodeIds = Object.keys(nodes);
  nodeCount += nodeIds.length;

  if (!nodes[pathway.startNode]) {
    errors.push(`${rel}: startNode "${pathway.startNode}" does not exist in nodes`);
  }

  for (const id of nodeIds) {
    const node = nodes[id];
    if (node.id !== id) {
      errors.push(`${rel}: node key "${id}" does not match its own id field "${node.id}"`);
    }

    if (node.type === "question") {
      if (!Array.isArray(node.answers) || node.answers.length === 0) {
        errors.push(`${rel}: question "${id}" has no answers`);
      } else {
        for (const answer of node.answers) {
          if (!answer.next || !nodes[answer.next]) {
            errors.push(`${rel}: question "${id}" answer "${answer.label}" points to missing node "${answer.next}"`);
          }
        }
      }
      if (node.citation?.verify) {
        verifyList.push(`${rel} :: ${id} :: ${node.citation.guideline} — ${node.citation.section}`);
      }
    } else if (node.type === "outcome") {
      if (!CATEGORIES.has(node.category)) {
        errors.push(`${rel}: outcome "${id}" has invalid/missing category "${node.category}"`);
      }
      if (!Array.isArray(node.citations) || node.citations.length === 0) {
        errors.push(`${rel}: outcome "${id}" has no citations`);
      } else {
        for (const c of node.citations) {
          if (c.verify) {
            verifyList.push(`${rel} :: ${id} :: ${c.guideline} — ${c.section}`);
          }
        }
      }
      if (!Array.isArray(node.actions) || node.actions.length === 0) {
        errors.push(`${rel}: outcome "${id}" has no actions`);
      }
      if (!Array.isArray(node.safetyNetting)) {
        errors.push(`${rel}: outcome "${id}" missing safetyNetting array`);
      }
      if (!Array.isArray(node.documentationPrompts) || node.documentationPrompts.length === 0) {
        errors.push(`${rel}: outcome "${id}" has no documentationPrompts`);
      }
    } else {
      errors.push(`${rel}: node "${id}" has unknown type "${node.type}"`);
    }
  }

  // Reachability: every node should be reachable from startNode (catches orphans/typos).
  const reachable = new Set([pathway.startNode]);
  const queue = [pathway.startNode];
  while (queue.length) {
    const current = nodes[queue.pop()];
    if (current?.type === "question") {
      for (const a of current.answers) {
        if (nodes[a.next] && !reachable.has(a.next)) {
          reachable.add(a.next);
          queue.push(a.next);
        }
      }
    }
  }
  for (const id of nodeIds) {
    if (!reachable.has(id)) {
      errors.push(`${rel}: node "${id}" is unreachable from startNode`);
    }
  }
}

console.log(`Validated ${pathwayCount} pathway file(s), ${nodeCount} node(s).\n`);

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

console.log("✓ All pathway content is structurally valid.");
