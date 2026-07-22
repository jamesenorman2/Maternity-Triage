import type { QuestionNode } from "../content/schema";
import { useTriage } from "../state/TriageContext";
import CitationBadge from "./CitationBadge";

export default function QuestionScreen({ node }: { node: QuestionNode }) {
  const { opening, answer, goBack, reset, history } = useTriage();
  const isPhone = opening?.channel === "phone";
  const text = (isPhone && node.phoneText) || node.text;

  return (
    <div className="screen question-screen">
      <button className="back-link" onClick={history.length === 0 ? reset : goBack}>
        ← {history.length === 0 ? "Back to complaints" : "Back"}
      </button>

      {node.redFlag && <div className="red-flag-tag">RED-FLAG QUESTION</div>}

      <h1 className="question-text">{text}</h1>
      {isPhone && node.phoneText && <p className="phone-hint">Phone-script wording shown.</p>}

      <div className="answer-list">
        {node.answers.map((a) => (
          <button key={a.label} className="answer-btn" onClick={() => answer(a.next)}>
            {(isPhone && a.phoneLabel) || a.label}
          </button>
        ))}
      </div>

      {node.citation && <CitationBadge citation={node.citation} />}
    </div>
  );
}
