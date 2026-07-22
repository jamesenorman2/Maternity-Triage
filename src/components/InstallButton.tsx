import { useInstallPrompt } from "../state/InstallPromptContext";

export default function InstallButton() {
  const { canInstall, promptInstall } = useInstallPrompt();

  if (!canInstall) return null;

  return (
    <button className="install-btn" onClick={promptInstall}>
      📲 Install app
    </button>
  );
}
