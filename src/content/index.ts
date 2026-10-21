import type { ReferenceTopic } from "./schema";

import reducedFetalMovements from "./topics/antenatal/reduced-fetal-movements.json";
import antenatalBleeding from "./topics/antenatal/vaginal-bleeding.json";
import preEclampsiaScreen from "./topics/antenatal/headache-visual-epigastric.json";
import abdominalPain from "./topics/antenatal/abdominal-pain.json";

import labourStages from "./topics/intrapartum/labour-stages.json";
import fetalMonitoring from "./topics/intrapartum/fetal-monitoring.json";
import perinealTrauma from "./topics/intrapartum/perineal-trauma.json";

import postnatalRedFlags from "./topics/postnatal/maternal-red-flags.json";
import newbornExam from "./topics/postnatal/newborn-examination.json";
import breastfeedingSupport from "./topics/postnatal/breastfeeding-support.json";

import screeningTimeline from "./topics/general/screening-timeline.json";
import antenatalBloods from "./topics/general/antenatal-bloods.json";
import newsMeows from "./topics/general/news-meows.json";

import maternalCollapse from "./topics/emergencies/maternal-collapse.json";
import eclampsia from "./topics/emergencies/eclampsia.json";
import cordProlapse from "./topics/emergencies/cord-prolapse.json";
import shoulderDystocia from "./topics/emergencies/shoulder-dystocia.json";
import majorHaemorrhage from "./topics/emergencies/major-haemorrhage.json";
import sepsisDrill from "./topics/emergencies/sepsis.json";

// Registry of all reference topics. Adding a topic = drop a JSON file that
// matches the schema in ./schema.ts and register it here; no engine changes
// needed. Trust-specific local guidelines (section: "trust") register here
// too, once their text has been supplied — none are included yet, since no
// publicly published source exists to cite honestly.
export const antenatalTopics: ReferenceTopic[] = [
  reducedFetalMovements as ReferenceTopic,
  antenatalBleeding as ReferenceTopic,
  preEclampsiaScreen as ReferenceTopic,
  abdominalPain as ReferenceTopic,
];

export const intrapartumTopics: ReferenceTopic[] = [
  labourStages as ReferenceTopic,
  fetalMonitoring as ReferenceTopic,
  perinealTrauma as ReferenceTopic,
];

export const postnatalTopics: ReferenceTopic[] = [
  postnatalRedFlags as ReferenceTopic,
  newbornExam as ReferenceTopic,
  breastfeedingSupport as ReferenceTopic,
];

export const generalTopics: ReferenceTopic[] = [
  screeningTimeline as ReferenceTopic,
  antenatalBloods as ReferenceTopic,
  newsMeows as ReferenceTopic,
];

export const emergencyTopics: ReferenceTopic[] = [
  maternalCollapse as ReferenceTopic,
  eclampsia as ReferenceTopic,
  cordProlapse as ReferenceTopic,
  shoulderDystocia as ReferenceTopic,
  majorHaemorrhage as ReferenceTopic,
  sepsisDrill as ReferenceTopic,
];

export const trustTopics: ReferenceTopic[] = [];

export const topics: ReferenceTopic[] = [
  ...antenatalTopics,
  ...intrapartumTopics,
  ...postnatalTopics,
  ...generalTopics,
  ...emergencyTopics,
  ...trustTopics,
];

export function findTopic(id: string): ReferenceTopic | undefined {
  return topics.find((t) => t.id === id);
}
