import { useMemo, useState } from "react";
import { pathways } from "../content";
import type { Pathway, PathwaySection } from "../content/schema";
import { useTriage } from "../state/TriageContext";

const SECTION_LABELS: Record<PathwaySection, string> = {
  antenatal: "Antenatal",
  intrapartum: "Intrapartum",
  postnatal: "Postnatal",
  emergency: "Emergencies",
};

const SECTION_ORDER: PathwaySection[] = ["antenatal", "intrapartum", "postnatal"];

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const { startPathway } = useTriage();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pathways;
    const words = q.split(/\s+/).filter(Boolean);
    return pathways.filter((p) => {
      const haystack = [p.title, p.summary, ...(p.keywords ?? [])].join(" ").toLowerCase();
      // Every typed word must appear somewhere in the pathway's title/summary/keywords —
      // lets free text like "left sided pain" or "appendix" find the right pathway
      // without needing an exact phrase match.
      return words.every((w) => haystack.includes(w));
    });
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<PathwaySection, Pathway[]>();
    for (const section of SECTION_ORDER) map.set(section, []);
    for (const p of filtered) {
      if (!map.has(p.section)) map.set(p.section, []);
      map.get(p.section)!.push(p);
    }
    return map;
  }, [filtered]);

  return (
    <div className="screen home-screen">
      <header className="home-header">
        <div>
          <h1>Maternity Triage</h1>
          <p className="subtitle">Aide-memoire for structured symptom triage</p>
        </div>
      </header>

      <input
        className="search-input"
        type="search"
        inputMode="search"
        placeholder="Search presenting complaint…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search presenting complaint"
      />

      {[...grouped.entries()].map(([section, items]) =>
        items.length === 0 ? null : (
          <section key={section} className="pathway-section">
            <h2>{SECTION_LABELS[section]}</h2>
            <div className="pathway-list">
              {items.map((p) => (
                <button key={p.id} className="pathway-card" onClick={() => startPathway(p)}>
                  <span className="pathway-title">{p.title}</span>
                  <span className="pathway-summary">{p.summary}</span>
                </button>
              ))}
            </div>
          </section>
        )
      )}

      {filtered.length === 0 && <p className="empty-state">No presenting complaint matches "{query}".</p>}
    </div>
  );
}
