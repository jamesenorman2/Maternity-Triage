import { useState } from "react";
import IntendedUseModal from "./components/IntendedUseModal";
import HomeScreen from "./components/HomeScreen";
import OpeningScreen from "./components/OpeningScreen";
import QuestionScreen from "./components/QuestionScreen";
import OutcomeScreen from "./components/OutcomeScreen";
import EmergenciesDrawer from "./components/EmergenciesDrawer";
import ContentStatusScreen from "./components/ContentStatusScreen";
import ThemeToggle from "./components/ThemeToggle";
import InstallButton from "./components/InstallButton";
import { TriageProvider, useTriage } from "./state/TriageContext";
import { ThemeProvider } from "./state/ThemeContext";
import { InstallPromptProvider } from "./state/InstallPromptContext";

function TriageRouter() {
  const { pathway, opening, currentNodeId } = useTriage();

  if (!pathway) return null;
  if (!opening) return <OpeningScreen />;

  const node = currentNodeId ? pathway.nodes[currentNodeId] : null;
  if (!node) return null;

  return node.type === "question" ? <QuestionScreen node={node} /> : <OutcomeScreen node={node} />;
}

function AppShell() {
  const { pathway } = useTriage();
  const [showAbout, setShowAbout] = useState(false);
  const [showEmergencies, setShowEmergencies] = useState(false);
  const [showContentStatus, setShowContentStatus] = useState(false);
  const isEmergencyDrill = pathway?.section === "emergency";

  return (
    <div className="app-root">
      <div className="app-toolbar">
        <button className="icon-btn" onClick={() => setShowAbout(true)} aria-label="About this app">
          ⓘ About
        </button>
        <button className="icon-btn" onClick={() => setShowContentStatus(true)} aria-label="Content status and VERIFY list">
          📋 Content
        </button>
        {!isEmergencyDrill && (
          <button className="toolbar-emergency-btn" onClick={() => setShowEmergencies(true)}>
            🚨 Emergencies
          </button>
        )}
        <InstallButton />
        <ThemeToggle />
      </div>

      {pathway ? <TriageRouter /> : <HomeScreen />}

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
        <TriageProvider>
          <AppShell />
        </TriageProvider>
      </InstallPromptProvider>
    </ThemeProvider>
  );
}
