import type { Citation } from "../content/schema";

export default function CitationBadge({ citation }: { citation: Citation }) {
  return (
    <div className={`citation-badge ${citation.verify ? "citation-verify" : ""}`}>
      <span className="citation-source">
        {citation.guideline}
        {citation.nonNice ? " (non-NICE)" : ""}
      </span>
      <span className="citation-section">{citation.section}</span>
      <span className="citation-checked">Checked {citation.checked}</span>
      {citation.verify && <span className="verify-flag">VERIFY before relying on this</span>}
    </div>
  );
}
