import { emergencyDrills } from "../content";
import { useTriage } from "../state/TriageContext";

export default function EmergenciesDrawer({ onClose }: { onClose: () => void }) {
  const { startPathway } = useTriage();

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="emergencies-title">
      <div className="modal-card emergencies-card">
        <div className="emergencies-header">
          <h1 id="emergencies-title">🚨 Emergencies</h1>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <p className="subtitle">One-tap quick-reference drills. These skip the question set.</p>
        <div className="emergency-list">
          {emergencyDrills.map((p) => (
            <button
              key={p.id}
              className="emergency-btn"
              onClick={() => {
                startPathway(p);
                onClose();
              }}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
