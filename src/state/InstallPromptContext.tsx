import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// Wraps the browser's beforeinstallprompt flow. Chromium browsers fire this
// event and let us trigger the native install prompt on demand; Safari/iOS
// never fires it, so canInstall stays false there and the button hides —
// there's no programmatic install trigger to offer instead.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface InstallPromptContextValue {
  canInstall: boolean;
  isInstalled: boolean;
  isIos: boolean;
  promptInstall: () => Promise<void>;
}

const InstallPromptContext = createContext<InstallPromptContextValue | null>(null);

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as { standalone?: boolean }).standalone === true
  );
}

// iOS Safari (and any browser on iOS, since they all use WebKit) never fires
// beforeinstallprompt — there is no programmatic install trigger on iOS at
// all. "Add to Home Screen" only exists as a manual step in the Share sheet,
// so this is the only way to offer install guidance on those devices.
function detectIos() {
  const ua = window.navigator.userAgent;
  const isIphoneOrIpad = /iPad|iPhone|iPod/.test(ua);
  const isIpadOs13Plus = ua.includes("Macintosh") && navigator.maxTouchPoints > 1;
  return isIphoneOrIpad || isIpadOs13Plus;
}

export function InstallPromptProvider({ children }: { children: ReactNode }) {
  const [deferredEvent, setDeferredEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(isStandalone);
  const [isIos] = useState(detectIos);

  useEffect(() => {
    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredEvent(e as BeforeInstallPromptEvent);
    };
    const onAppInstalled = () => {
      setDeferredEvent(null);
      setIsInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredEvent) return;
    await deferredEvent.prompt();
    await deferredEvent.userChoice;
    setDeferredEvent(null);
  };

  return (
    <InstallPromptContext.Provider
      value={{ canInstall: deferredEvent !== null && !isInstalled, isInstalled, isIos, promptInstall }}
    >
      {children}
    </InstallPromptContext.Provider>
  );
}

export function useInstallPrompt() {
  const ctx = useContext(InstallPromptContext);
  if (!ctx) throw new Error("useInstallPrompt must be used within an InstallPromptProvider");
  return ctx;
}
