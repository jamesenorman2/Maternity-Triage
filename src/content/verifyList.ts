import { topics } from "./index";
import type { Citation } from "./schema";

export interface VerifyEntry {
  topicTitle: string;
  citation: Citation;
}

// Walks every topic's citations and collects the ones flagged verify:true, so
// the clinician has a single review list rather than hunting through screens.
export function collectVerifyList(): VerifyEntry[] {
  const entries: VerifyEntry[] = [];
  for (const topic of topics) {
    for (const citation of topic.citations) {
      if (citation.verify) {
        entries.push({ topicTitle: topic.title, citation });
      }
    }
  }
  return entries;
}
