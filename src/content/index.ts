import type { Pathway } from "./schema";

import reducedFetalMovements from "./pathways/antenatal/reduced-fetal-movements.json";
import antenatalBleeding from "./pathways/antenatal/vaginal-bleeding.json";
import preEclampsiaScreen from "./pathways/antenatal/headache-visual-epigastric.json";

import maternalCollapse from "./emergencies/maternal-collapse.json";
import eclampsia from "./emergencies/eclampsia.json";
import cordProlapse from "./emergencies/cord-prolapse.json";
import shoulderDystocia from "./emergencies/shoulder-dystocia.json";
import majorHaemorrhage from "./emergencies/major-haemorrhage.json";
import sepsisDrill from "./emergencies/sepsis.json";

// Registry of all pathways. Adding a pathway = drop a JSON file that matches
// the schema in ./schema.ts and register it here; no engine changes needed.
export const pathways: Pathway[] = [
  reducedFetalMovements as Pathway,
  antenatalBleeding as Pathway,
  preEclampsiaScreen as Pathway,
];

export const emergencyDrills: Pathway[] = [
  maternalCollapse as Pathway,
  eclampsia as Pathway,
  cordProlapse as Pathway,
  shoulderDystocia as Pathway,
  majorHaemorrhage as Pathway,
  sepsisDrill as Pathway,
];

export const allPathways: Pathway[] = [...pathways, ...emergencyDrills];

export function findPathway(id: string): Pathway | undefined {
  return allPathways.find((p) => p.id === id);
}
