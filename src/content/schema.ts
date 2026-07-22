// Content schema for triage pathway files.
// Clinical content lives entirely in these structured data files, separate
// from the engine. The engine (src/engine) only knows how to render whatever
// shape is defined here — it must never encode clinical logic itself.

export type Category = "RED" | "ORANGE" | "YELLOW" | "GREEN";

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

export interface Answer {
  label: string;
  /** Optional shorter/alternate label for phone channel. */
  phoneLabel?: string;
  next: string;
}

export interface QuestionNode {
  type: "question";
  id: string;
  text: string;
  /** Wording for the clinician to read out on a phone triage call. */
  phoneText?: string;
  /** True if this question is asking about a red-flag / short-circuit symptom. */
  redFlag?: boolean;
  answers: Answer[];
  citation?: Citation;
}

export interface OutcomeNode {
  type: "outcome";
  id: string;
  category: Category;
  title: string;
  /** Disposition target, e.g. "Seen within 15 minutes" or "Attend now". */
  target: string;
  actions: string[];
  /** Script for phone channel only; omitted actions imply face-to-face wording is used instead. */
  phoneScript?: string;
  safetyNetting: string[];
  documentationPrompts: string[];
  citations: Citation[];
}

export type PathwayNode = QuestionNode | OutcomeNode;

export type PathwaySection = "antenatal" | "intrapartum" | "postnatal" | "emergency";

export interface OpeningField {
  id: string;
  label: string;
  /** "gestation" | "postnatalDays" | "parity" | "riskFactors" | "text" */
  kind: "gestation" | "postnatalDays" | "parity" | "riskFactors" | "text";
  options?: string[];
}

export interface Pathway {
  id: string;
  title: string;
  section: PathwaySection;
  /** One-line summary shown in the presenting-complaint list. */
  summary: string;
  lastReviewed: string;
  /** Universal-opening-question fields relevant to this pathway. */
  openingFields: OpeningField[];
  startNode: string;
  nodes: Record<string, PathwayNode>;
}
