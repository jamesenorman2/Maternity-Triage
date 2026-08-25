import type { ReferenceTopic } from "../content/schema";
import { useContent } from "../state/ContentContext";
import CitationBadge from "./CitationBadge";

const SECTION_LABELS: Record<ReferenceTopic["section"], string> = {
  antenatal: "Antenatal",
  intrapartum: "Intrapartum",
  postnatal: "Postnatal",
  emergency: "Emergency",
  trust: "Local trust guideline",
};

export default function TopicScreen({ topic }: { topic: ReferenceTopic }) {
  const { closeTopic } = useContent();

  return (
    <div className="screen topic-screen">
      <button className="back-link" onClick={closeTopic}>
        ← Back to topics
      </button>

      <span className="topic-section-tag">{SECTION_LABELS[topic.section]}</span>
      <h1>{topic.title}</h1>
      <p className="subtitle">{topic.summary}</p>

      {topic.redFlags && topic.redFlags.length > 0 && (
        <section className="outcome-section red-flags-block">
          <h2>🚩 Red flags</h2>
          <ul>
            {topic.redFlags.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </section>
      )}

      {topic.blocks.map((block, i) => (
        <section key={i} className="outcome-section">
          <h2>{block.heading}</h2>
          <ul>
            {block.bullets.map((b, j) => (
              <li key={j}>{b}</li>
            ))}
          </ul>
        </section>
      ))}

      <section className="outcome-section citations-section">
        <h2>Guideline citations</h2>
        {topic.citations.map((c, i) => (
          <CitationBadge key={i} citation={c} />
        ))}
      </section>

      <p className="documentation-note">Last reviewed {topic.lastReviewed}. Always check current local policy.</p>
    </div>
  );
}
