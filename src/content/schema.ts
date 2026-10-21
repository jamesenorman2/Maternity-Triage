// Content schema for midwifery reference topics.
// Clinical content lives entirely in these structured data files, separate
// from the engine. The engine (src/components, src/state) only knows how to
// render whatever shape is defined here — it must never encode clinical
// content itself.

export interface Citation {
  /** Guideline ID, e.g. "NG201" or "RCOG GTG 52". */
  guideline: string;
  /** Section/subsection reference within the guideline. */
  section: string;
  /** Human-readable title of the guideline, for display. */
  title?: string;
  /** ISO date this citation was last checked against the source. */
  checked: string;
  /** True if this is a non-NICE (tier 2) source — must be flagged in UI. */
  nonNice?: boolean;
  /** True if the clinician must verify this value/threshold before relying on it. */
  verify?: boolean;
}

/** One labelled group of bullet points within a topic, e.g. "If BP ≥160/110". */
export interface ContentBlock {
  heading: string;
  bullets: string[];
}

export type TopicSection = "antenatal" | "intrapartum" | "postnatal" | "general" | "emergency" | "trust";

export interface ReferenceTopic {
  id: string;
  title: string;
  section: TopicSection;
  /** One-line summary shown in the browse list. */
  summary: string;
  /** Lay-language synonyms so free-text search finds this topic (e.g. "RIF pain", "appendicitis", "stitch"). */
  keywords?: string[];
  lastReviewed: string;
  /** Headline red-flag bullets shown prominently at the top of the card. */
  redFlags?: string[];
  /** Main body of the reference card, in display order. */
  blocks: ContentBlock[];
  citations: Citation[];
}
