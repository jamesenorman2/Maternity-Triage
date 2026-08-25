import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { ReferenceTopic } from "../content/schema";

interface ContentContextValue {
  selectedTopic: ReferenceTopic | null;
  selectTopic: (topic: ReferenceTopic) => void;
  closeTopic: () => void;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [selectedTopic, setSelectedTopic] = useState<ReferenceTopic | null>(null);

  const value = useMemo<ContentContextValue>(
    () => ({
      selectedTopic,
      selectTopic: (topic) => setSelectedTopic(topic),
      closeTopic: () => setSelectedTopic(null),
    }),
    [selectedTopic]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within a ContentProvider");
  return ctx;
}
