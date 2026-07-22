import type { OutcomeNode } from "../content/schema";
import { useTriage } from "../state/TriageContext";
import CitationBadge from "./CitationBadge";

const CATEGORY_META: Record<OutcomeNode["category"], { label: string; emoji: string }> = {
  RED: { label: "RED — Immediate", emoji: "🔴" },
  ORANGE: { label: "ORANGE — Urgent", emoji: "🟠" },
  YELLOW: { label: "YELLOW — Semi-urgent", emoji: "🟡" },
  GREEN: { label: "GREEN — Non-urgent / advice", emoji: "🟢" },
};

export default function OutcomeScreen({ node }: { node: OutcomeNode }) {
  const { opening, reset, goBack, history, pathway } = useTriage();
  const isPhone = opening?.channel === "phone";
  const meta = CATEGORY_META[node.category];
  const isDirectDrill = pathway?.section === "emergency";

  return (
    <div className={`screen outcome-screen category-${node.category.toLowerCase()}`}>
      {!isDirectDrill && (
        <button className="back-link" onClick={history.length === 0 ? reset : goBack}>
          ← {history.length === 0 ? "Back to complaints" : "Back"}
        </button>
      )}

      <div className="category-banner">
        <span className="category-emoji">{meta.emoji}</span>
        <div>
          <div className="category-label">{meta.label}</div>
          <div className="category-target">{node.target}</div>
        </div>
      </div>

      <h1>{node.title}</h1>

      <section className="outcome-section">
        <h2>Actions</h2>
        <ul>
          {node.actions.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </section>

      {isPhone && node.phoneScript && (
        <section className="outcome-section phone-script">
          <h2>Phone-advice script</h2>
          <p>{node.phoneScript}</p>
        </section>
      )}

      {node.safetyNetting.length > 0 && (
        <section className="outcome-section safety-netting">
          <h2>Safety-netting{isPhone ? " — say to her" : ""}</h2>
          <ul>
            {node.safetyNetting.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="outcome-section">
        <h2>What to document</h2>
        <p className="documentation-note">Prompts only — this app saves nothing.</p>
        <ul>
          {node.documentationPrompts.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      </section>

      <section className="outcome-section citations-section">
        <h2>Guideline citations</h2>
        {node.citations.map((c, i) => (
          <CitationBadge key={i} citation={c} />
        ))}
      </section>

      <button className="btn btn-primary btn-large new-triage-btn" onClick={reset}>
        New triage
      </button>
    </div>
  );
}
