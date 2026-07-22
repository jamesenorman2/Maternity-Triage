export function IntendedUseStatement() {
  return (
    <>
      <p>
        This tool is a personal reference aide-memoire for use by a registered midwife alongside her own clinical
        judgement and her employer's local guidelines. It does not diagnose, does not store patient information, and
        does not replace local policy, senior review, or emergency protocols. Content is derived from published NICE
        guidance (versions and dates listed per pathway) and must be checked against current guidance before
        reliance.
      </p>
      <p className="intended-use-sub">
        Local trust guidelines always take precedence over the content in this app. Nothing typed into this app is
        saved, sent anywhere, or recorded — closing or resetting a triage discards it completely.
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
