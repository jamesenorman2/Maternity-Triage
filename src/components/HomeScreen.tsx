import { useMemo, useState } from "react";
import { topics } from "../content";
import type { ReferenceTopic, TopicSection } from "../content/schema";
import { useContent } from "../state/ContentContext";

const SECTION_LABELS: Record<TopicSection, string> = {
  antenatal: "Antenatal",
  intrapartum: "Intrapartum",
  postnatal: "Postnatal",
  general: "General reference",
  emergency: "Emergencies",
  trust: "Local trust guidelines (Yeovil / Somerset FT)",
};

const SECTION_ORDER: TopicSection[] = ["antenatal", "intrapartum", "postnatal", "general", "trust"];

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const { selectTopic } = useContent();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return topics;
    const words = q.split(/\s+/).filter(Boolean);
    return topics.filter((t) => {
      const haystack = [t.title, t.summary, ...(t.keywords ?? [])].join(" ").toLowerCase();
      // Every typed word must appear somewhere in the topic's title/summary/keywords —
      // lets free text like "left sided pain" or "appendix" find the right topic
      // without needing an exact phrase match.
      return words.every((w) => haystack.includes(w));
    });
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<TopicSection, ReferenceTopic[]>();
    for (const section of SECTION_ORDER) map.set(section, []);
    for (const t of filtered) {
      if (t.section === "emergency") continue;
      if (!map.has(t.section)) map.set(t.section, []);
      map.get(t.section)!.push(t);
    }
    return map;
  }, [filtered]);

  return (
    <div className="screen home-screen">
      <header className="home-header">
        <div>
          <h1>The Midwife's Companion</h1>
          <p className="subtitle">Your midwifery font of knowledge — browse or search</p>
        </div>
      </header>

      <input
        className="search-input"
        type="search"
        inputMode="search"
        placeholder="Search a topic…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search topics"
      />

      {[...grouped.entries()].map(([section, items]) =>
        items.length === 0 ? null : (
          <section key={section} className="pathway-section">
            <h2>{SECTION_LABELS[section]}</h2>
            <div className="pathway-list">
              {items.map((t) => (
                <button key={t.id} className="pathway-card" onClick={() => selectTopic(t)}>
                  <span className="pathway-title">{t.title}</span>
                  <span className="pathway-summary">{t.summary}</span>
                </button>
              ))}
            </div>
          </section>
        )
      )}

      {query.trim() !== "" && filtered.length === 0 && (
        <p className="empty-state">No topic matches "{query}".</p>
      )}
    </div>
  );
}
