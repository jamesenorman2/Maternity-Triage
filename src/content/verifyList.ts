import { allPathways } from "./index";
import type { Citation } from "./schema";

export interface VerifyEntry {
  pathwayTitle: string;
  nodeId: string;
  citation: Citation;
}

// Walks every pathway's nodes and collects citations flagged verify:true, so
// the clinician has a single review list rather than hunting through screens.
export function collectVerifyList(): VerifyEntry[] {
  const entries: VerifyEntry[] = [];
  for (const pathway of allPathways) {
    for (const node of Object.values(pathway.nodes)) {
      const citations = node.type === "question" ? (node.citation ? [node.citation] : []) : node.citations;
      for (const citation of citations) {
        if (citation.verify) {
          entries.push({ pathwayTitle: pathway.title, nodeId: node.id, citation });
        }
      }
    }
  }
  return entries;
}
