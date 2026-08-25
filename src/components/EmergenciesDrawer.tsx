import { emergencyTopics } from "../content";
import { useContent } from "../state/ContentContext";

export default function EmergenciesDrawer({ onClose }: { onClose: () => void }) {
  const { selectTopic } = useContent();

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="emergencies-title">
      <div className="modal-card emergencies-card">
        <div className="emergencies-header">
          <h1 id="emergencies-title">🚨 Emergencies</h1>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <p className="subtitle">One-tap quick-reference drills.</p>
        <div className="emergency-list">
          {emergencyTopics.map((t) => (
            <button
              key={t.id}
              className="emergency-btn"
              onClick={() => {
                selectTopic(t);
                onClose();
              }}
            >
              {t.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
