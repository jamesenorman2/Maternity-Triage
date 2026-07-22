import { useState } from "react";
import { useInstallPrompt } from "../state/InstallPromptContext";

function IosInstallModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="ios-install-title">
      <div className="modal-card">
        <div className="emergencies-header">
          <h1 id="ios-install-title">Install on iPhone / iPad</h1>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <p>
          Safari on iOS doesn't support one-tap installing, only a manual "Add to Home Screen" step — this still
          gives you a full-screen, offline-capable app icon, the same as on Android.
        </p>
        <ol className="ios-install-steps">
          <li>
            Tap the <strong>Share</strong> icon (square with an arrow pointing up) in Safari's toolbar.
          </li>
          <li>
            Scroll down and tap <strong>Add to Home Screen</strong>.
          </li>
          <li>
            Tap <strong>Add</strong> in the top-right corner.
          </li>
        </ol>
        <p className="intended-use-sub">
          This must be done in Safari — Chrome, Firefox, and other browsers on iOS can't add home-screen apps because
          Apple requires them all to use Safari's engine underneath, which doesn't expose this feature to them.
        </p>
      </div>
    </div>
  );
}

export default function InstallButton() {
  const { canInstall, isIos, isInstalled, promptInstall } = useInstallPrompt();
  const [showIosInstructions, setShowIosInstructions] = useState(false);

  if (isInstalled) return null;

  if (canInstall) {
    return (
      <button className="install-btn" onClick={promptInstall}>
        📲 Install app
      </button>
    );
  }

  if (isIos) {
    return (
      <>
        <button className="install-btn" onClick={() => setShowIosInstructions(true)}>
          📲 Install app
        </button>
        {showIosInstructions && <IosInstallModal onClose={() => setShowIosInstructions(false)} />}
      </>
    );
  }

  return null;
}
