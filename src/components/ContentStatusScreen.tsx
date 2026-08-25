import { topics } from "../content";
import { collectVerifyList } from "../content/verifyList";

export default function ContentStatusScreen({ onClose }: { onClose: () => void }) {
  const verifyList = collectVerifyList();

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="content-status-title">
      <div className="modal-card">
        <div className="emergencies-header">
          <h1 id="content-status-title">Content status</h1>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <section className="outcome-section">
          <h2>Topic versions</h2>
          <ul>
            {topics.map((t) => (
              <li key={t.id}>
                {t.title} — last reviewed {t.lastReviewed}
              </li>
            ))}
          </ul>
        </section>

        <section className="outcome-section">
          <h2>VERIFY-flagged citations ({verifyList.length})</h2>
          <p className="documentation-note">
            These citations reference a real guideline but the exact figure, section number, or wording has not been
            independently re-checked against the current published source. Review before relying on them clinically.
          </p>
          <ul>
            {verifyList.map((v, i) => (
              <li key={i}>
                <strong>{v.topicTitle}</strong> — {v.citation.guideline}: {v.citation.section}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
