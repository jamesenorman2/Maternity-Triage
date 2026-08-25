import { useState } from "react";
import IntendedUseModal from "./components/IntendedUseModal";
import HomeScreen from "./components/HomeScreen";
import TopicScreen from "./components/TopicScreen";
import EmergenciesDrawer from "./components/EmergenciesDrawer";
import ContentStatusScreen from "./components/ContentStatusScreen";
import ThemeToggle from "./components/ThemeToggle";
import InstallButton from "./components/InstallButton";
import { ContentProvider, useContent } from "./state/ContentContext";
import { ThemeProvider } from "./state/ThemeContext";
import { InstallPromptProvider } from "./state/InstallPromptContext";

function AppShell() {
  const { selectedTopic } = useContent();
  const [showAbout, setShowAbout] = useState(false);
  const [showEmergencies, setShowEmergencies] = useState(false);
  const [showContentStatus, setShowContentStatus] = useState(false);

  return (
    <div className="app-root">
      <div className="app-toolbar">
        <button className="icon-btn" onClick={() => setShowAbout(true)} aria-label="About this app">
          ⓘ About
        </button>
        <button className="icon-btn" onClick={() => setShowContentStatus(true)} aria-label="Content status and VERIFY list">
          📋 Content
        </button>
        <button className="toolbar-emergency-btn" onClick={() => setShowEmergencies(true)}>
          🚨 Emergencies
        </button>
        <InstallButton />
        <ThemeToggle />
      </div>

      {selectedTopic ? <TopicScreen topic={selectedTopic} /> : <HomeScreen />}

      {showAbout && <IntendedUseModal onDismiss={() => setShowAbout(false)} />}
      {showEmergencies && <EmergenciesDrawer onClose={() => setShowEmergencies(false)} />}
      {showContentStatus && <ContentStatusScreen onClose={() => setShowContentStatus(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <InstallPromptProvider>
        <ContentProvider>
          <AppShell />
        </ContentProvider>
      </InstallPromptProvider>
    </ThemeProvider>
  );
}
