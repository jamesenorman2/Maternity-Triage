import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Pathway } from "../content/schema";

export type Channel = "phone" | "inPerson";

export interface OpeningData {
  channel: Channel;
  gestationWeeks?: string;
  postnatalDays?: string;
  parity?: string;
  riskFactors?: string;
}

interface TriageState {
  pathway: Pathway | null;
  opening: OpeningData | null;
  currentNodeId: string | null;
  history: string[];
}

interface TriageContextValue extends TriageState {
  startPathway: (pathway: Pathway) => void;
  setOpening: (data: OpeningData) => void;
  answer: (nextId: string) => void;
  goBack: () => void;
  reset: () => void;
}

const TriageContext = createContext<TriageContextValue | null>(null);

const initialState: TriageState = {
  pathway: null,
  opening: null,
  currentNodeId: null,
  history: [],
};

export function TriageProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TriageState>(initialState);

  const value = useMemo<TriageContextValue>(
    () => ({
      ...state,
      startPathway: (pathway) =>
        setState(
          pathway.openingFields.length === 0
            ? {
                pathway,
                opening: { channel: "inPerson" },
                currentNodeId: pathway.startNode,
                history: [],
              }
            : {
                pathway,
                opening: null,
                currentNodeId: null,
                history: [],
              }
        ),
      setOpening: (data) =>
        setState((s) => ({
          ...s,
          opening: data,
          currentNodeId: s.pathway?.startNode ?? null,
          history: [],
        })),
      answer: (nextId) =>
        setState((s) =>
          s.currentNodeId
            ? {
                ...s,
                currentNodeId: nextId,
                history: [...s.history, s.currentNodeId],
              }
            : s
        ),
      goBack: () =>
        setState((s) => {
          if (s.history.length === 0) return { ...initialState };
          const history = s.history.slice(0, -1);
          const currentNodeId = s.history[s.history.length - 1];
          return { ...s, history, currentNodeId };
        }),
      reset: () => setState(initialState),
    }),
    [state]
  );

  return <TriageContext.Provider value={value}>{children}</TriageContext.Provider>;
}

export function useTriage() {
  const ctx = useContext(TriageContext);
  if (!ctx) throw new Error("useTriage must be used within a TriageProvider");
  return ctx;
}
