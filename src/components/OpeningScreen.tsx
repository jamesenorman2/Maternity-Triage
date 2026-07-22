import { useState } from "react";
import type { Channel, OpeningData } from "../state/TriageContext";
import { useTriage } from "../state/TriageContext";

export default function OpeningScreen() {
  const { pathway, setOpening, reset } = useTriage();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [gestationWeeks, setGestationWeeks] = useState("");
  const [postnatalDays, setPostnatalDays] = useState("");
  const [parity, setParity] = useState("");
  const [riskFactors, setRiskFactors] = useState("");

  if (!pathway) return null;

  const showGestation = pathway.openingFields.some((f) => f.kind === "gestation");
  const showPostnatalDays = pathway.openingFields.some((f) => f.kind === "postnatalDays");
  const showParity = pathway.openingFields.some((f) => f.kind === "parity");
  const showRiskFactors = pathway.openingFields.some((f) => f.kind === "riskFactors");

  const canContinue = channel !== null;

  const handleContinue = () => {
    if (!channel) return;
    const data: OpeningData = { channel, gestationWeeks, postnatalDays, parity, riskFactors };
    setOpening(data);
  };

  return (
    <div className="screen opening-screen">
      <button className="back-link" onClick={reset}>
        ← Back to complaints
      </button>
      <h1>{pathway.title}</h1>
      <p className="subtitle">Answer these before starting the question set. Nothing is saved.</p>

      <fieldset className="field-group">
        <legend>Channel</legend>
        <div className="choice-row">
          <button
            className={`choice-btn ${channel === "phone" ? "choice-btn-selected" : ""}`}
            onClick={() => setChannel("phone")}
          >
            📞 Telephone
          </button>
          <button
            className={`choice-btn ${channel === "inPerson" ? "choice-btn-selected" : ""}`}
            onClick={() => setChannel("inPerson")}
          >
            🏥 Face-to-face
          </button>
        </div>
      </fieldset>

      {showGestation && (
        <label className="field-group">
          <span>Gestation (weeks+days)</span>
          <input
            className="text-input"
            inputMode="numeric"
            placeholder="e.g. 32+4"
            value={gestationWeeks}
            onChange={(e) => setGestationWeeks(e.target.value)}
          />
        </label>
      )}

      {showPostnatalDays && (
        <label className="field-group">
          <span>Days postnatal</span>
          <input
            className="text-input"
            inputMode="numeric"
            placeholder="e.g. 4"
            value={postnatalDays}
            onChange={(e) => setPostnatalDays(e.target.value)}
          />
        </label>
      )}

      {showParity && (
        <label className="field-group">
          <span>Gravida / Parity</span>
          <input
            className="text-input"
            placeholder="e.g. G2P1"
            value={parity}
            onChange={(e) => setParity(e.target.value)}
          />
        </label>
      )}

      {showRiskFactors && (
        <label className="field-group">
          <span>Known risk factors</span>
          <textarea
            className="text-input"
            rows={2}
            placeholder="Optional — free text"
            value={riskFactors}
            onChange={(e) => setRiskFactors(e.target.value)}
          />
        </label>
      )}

      <button className="btn btn-primary btn-large" disabled={!canContinue} onClick={handleContinue}>
        Start triage
      </button>
    </div>
  );
}
