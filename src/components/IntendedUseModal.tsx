export function IntendedUseStatement() {
  return (
    <>
      <p>
        This tool is a personal quick-reference library for a registered midwife, for looking up information on the
        go — it is not a decision-support or triage tool, does not diagnose, and does not store patient information.
        It does not replace local policy, senior review, emergency protocols, or your own clinical judgement. Content
        is derived from published NICE and RCOG guidance (versions and dates listed per topic) and must be checked
        against current guidance before reliance.
      </p>
      <p className="intended-use-sub">
        A "Local trust guidelines" section is included for Yeovil Hospital (part of Somerset NHS Foundation Trust).
        Somerset FT's clinical guidelines live on a staff-only intranet with no public source to cite honestly, so
        this section is empty until that content is supplied directly and added with proper attribution. Local trust
        guidelines always take precedence over the content in this app.
      </p>
      <p className="intended-use-sub">
        Nothing typed into this app is saved, sent anywhere, or recorded.
      </p>
      <p className="intended-use-sub">
        <strong>Installing to your home screen:</strong> on Android/Chrome/Edge, tap <strong>📲 Install app</strong>{" "}
        in the toolbar. On iPhone/iPad, open this page in Safari, tap the Share icon, then{" "}
        <strong>Add to Home Screen</strong> — Apple only allows this manual route, there's no one-tap install button
        on iOS.
      </p>
    </>
  );
}

export default function IntendedUseModal({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="intended-use-title">
      <div className="modal-card">
        <div className="emergencies-header">
          <h1 id="intended-use-title">About this app</h1>
          <button className="icon-btn" onClick={onDismiss} aria-label="Close">
            ✕
          </button>
        </div>
        <IntendedUseStatement />
      </div>
    </div>
  );
}
