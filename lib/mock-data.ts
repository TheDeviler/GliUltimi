// FALLBACK DATA: Used only when Gemini API is unavailable or during development
import type {
  AnalyzeResponse,
  ESGPillarData,
  ESGScore,
  RedFlag,
  ActionItem,
  AgentOutput,
  OnboardingData,
  InternalState,
} from "./types";

export const defaultOnboardingData: OnboardingData = {
  company: { name: "", vatNumber: "", atecoSector: "", officeSqm: 0 },
  hardware: { pcStations: 0, physicalServers: 0, printers: 0 },
  documents: [],
};

export const mockESGScore: ESGScore = {
  overall: 68,
  environmental: 62,
  social: 71,
  governance: 73,
};

export const mockPillars: ESGPillarData[] = [
  {
    pillar: "E",
    label: "Environment",
    score: 62,
    metrics: [
      { id: "e1", label: "Scope 2 CO₂", value: 42.5, unit: "tCO₂e", target: 34.5, status: "critical", pillar: "E" },
      { id: "e2", label: "Consumo Energetico", value: 185000, unit: "kWh", target: 160000, status: "warning", pillar: "E" },
      { id: "e3", label: "Tasso Riciclo Rifiuti", value: 64, unit: "%", target: 80, status: "warning", pillar: "E" },
    ],
    chartData: [
      { name: "Ott", actual: 48, target: 36 },
      { name: "Nov", actual: 46, target: 36 },
      { name: "Dic", actual: 50, target: 35 },
      { name: "Gen", actual: 45, target: 35 },
      { name: "Feb", actual: 43, target: 35 },
      { name: "Mar", actual: 42.5, target: 34.5 },
    ],
  },
  {
    pillar: "S",
    label: "Social",
    score: 71,
    metrics: [
      { id: "s1", label: "Ore Formazione / Dip.", value: 24, unit: "h", target: 32, status: "warning", pillar: "S" },
      { id: "s2", label: "Gender Pay Gap", value: 4.2, unit: "%", target: 3, status: "warning", pillar: "S" },
      { id: "s3", label: "Turnover Dipendenti", value: 8, unit: "%", target: 10, status: "good", pillar: "S" },
    ],
    chartData: [
      { name: "Ott", actual: 18, target: 28 },
      { name: "Nov", actual: 20, target: 29 },
      { name: "Dic", actual: 16, target: 30 },
      { name: "Gen", actual: 22, target: 30 },
      { name: "Feb", actual: 26, target: 31 },
      { name: "Mar", actual: 24, target: 32 },
    ],
  },
  {
    pillar: "G",
    label: "Governance",
    score: 73,
    metrics: [
      { id: "g1", label: "Indipendenza CdA", value: 60, unit: "%", target: 66, status: "warning", pillar: "G" },
      { id: "g2", label: "Compliance Anti-Corruzione", value: 92, unit: "%", target: 95, status: "good", pillar: "G" },
      { id: "g3", label: "Data Breach Incidents", value: 0, unit: "", target: 0, status: "good", pillar: "G" },
    ],
    chartData: [
      { name: "Ott", actual: 55, target: 60 },
      { name: "Nov", actual: 58, target: 62 },
      { name: "Dic", actual: 56, target: 63 },
      { name: "Gen", actual: 60, target: 64 },
      { name: "Feb", actual: 58, target: 65 },
      { name: "Mar", actual: 60, target: 66 },
    ],
  },
];

export const mockRedFlags: RedFlag[] = [
  {
    id: "rf-1",
    severity: "high",
    title: "Scope 2 CO₂ sopra soglia CSRD",
    description: "Le emissioni Scope 2 superano del 23% il target settoriale. Rischio di non conformità alla direttiva CSRD.",
    pillar: "E",
  },
  {
    id: "rf-2",
    severity: "high",
    title: "Manca policy whistleblowing",
    description: "Non è stata rilevata una policy whistleblowing formale. Obbligatoria per la Direttiva UE 2019/1937.",
    pillar: "G",
  },
  {
    id: "rf-3",
    severity: "medium",
    title: "Diversità CdA insufficiente",
    description: "La composizione del CdA non rispetta la quota minima del 33% di genere meno rappresentato.",
    pillar: "G",
  },
];

export const mockActionPlan: ActionItem[] = [
  {
    id: "ap-1",
    title: "Passaggio a energia rinnovabile certificata",
    description: "Contratto GO (Garanzia di Origine) per fornitura 100% rinnovabile.",
    estimatedCost: 2400,
    estimatedSavings: 8500,
    paybackMonths: 4,
    pillar: "E",
    priority: "high",
  },
  {
    id: "ap-2",
    title: "Virtualizzazione server fisici",
    description: "Migrazione dei 3 server fisici su infrastruttura cloud, riducendo consumo energetico e costi di manutenzione.",
    estimatedCost: 15000,
    estimatedSavings: 22000,
    paybackMonths: 9,
    pillar: "E",
    priority: "high",
  },
  {
    id: "ap-3",
    title: "Implementazione piattaforma whistleblowing",
    description: "Adozione di una piattaforma certificata per segnalazioni anonime, conforme alla Direttiva UE 2019/1937.",
    estimatedCost: 3000,
    estimatedSavings: 0,
    paybackMonths: 0,
    pillar: "G",
    priority: "medium",
  },
];

// ==================== CERTIFICATION TARGET MOCK DATA ====================

export const certificationMockData: Record<string, { redFlags: RedFlag[]; actionPlan: ActionItem[] }> = {
  iso14001: {
    redFlags: [
      {
        id: "rf-iso14001-1",
        severity: "high",
        title: "Manca analisi ciclo di vita (LCA) richiesta dalla ISO 14001",
        description: "L'analisi del ciclo di vita dei prodotti non è stata eseguita. È un requisito chiave per la certificazione ISO 14001.",
        pillar: "E",
      },
      {
        id: "rf-iso14001-2",
        severity: "high",
        title: "Assenza di un Sistema di Gestione Ambientale (SGA)",
        description: "Non è stato rilevato un SGA formalizzato conforme ai requisiti della clausola 4 della ISO 14001:2015.",
        pillar: "E",
      },
      {
        id: "rf-iso14001-3",
        severity: "medium",
        title: "Piano di emergenza ambientale incompleto",
        description: "Il piano di risposta alle emergenze ambientali non copre tutti gli scenari richiesti (sversamenti, emissioni accidentali).",
        pillar: "E",
      },
    ],
    actionPlan: [
      {
        id: "ap-iso14001-1",
        title: "Redigere LCA per prodotto di punta",
        description: "Commissionare un'analisi del ciclo di vita conforme alla ISO 14040/14044 per il prodotto principale.",
        estimatedCost: 12000,
        estimatedSavings: 5000,
        paybackMonths: 18,
        pillar: "E",
        priority: "high",
      },
      {
        id: "ap-iso14001-2",
        title: "Implementare Sistema di Gestione Ambientale",
        description: "Sviluppare e documentare un SGA con politica ambientale, obiettivi misurabili e programma di audit interno.",
        estimatedCost: 8000,
        estimatedSavings: 0,
        paybackMonths: 0,
        pillar: "E",
        priority: "high",
      },
      {
        id: "ap-iso14001-3",
        title: "Completare il piano di emergenza ambientale",
        description: "Aggiornare il piano includendo scenari di sversamento chimico, emissioni fuggitive e contaminazione del suolo.",
        estimatedCost: 3000,
        estimatedSavings: 0,
        paybackMonths: 0,
        pillar: "E",
        priority: "medium",
      },
    ],
  },
  iso45001: {
    redFlags: [
      {
        id: "rf-iso45001-1",
        severity: "high",
        title: "DVR non aggiornato secondo ISO 45001",
        description: "Il Documento di Valutazione dei Rischi non segue la metodologia richiesta dalla ISO 45001:2018 (clausola 6.1).",
        pillar: "S",
      },
      {
        id: "rf-iso45001-2",
        severity: "high",
        title: "Manca sistema di segnalazione near-miss",
        description: "Non è presente un processo formalizzato per la segnalazione e analisi degli incidenti mancati.",
        pillar: "S",
      },
      {
        id: "rf-iso45001-3",
        severity: "medium",
        title: "Formazione sicurezza insufficiente",
        description: "Le ore di formazione sulla sicurezza per dipendente sono al di sotto del minimo richiesto dalla ISO 45001.",
        pillar: "S",
      },
    ],
    actionPlan: [
      {
        id: "ap-iso45001-1",
        title: "Aggiornamento DVR conforme ISO 45001",
        description: "Revisione completa del DVR con identificazione dei pericoli, valutazione dei rischi e opportunità (clausola 6.1).",
        estimatedCost: 6000,
        estimatedSavings: 15000,
        paybackMonths: 5,
        pillar: "S",
        priority: "high",
      },
      {
        id: "ap-iso45001-2",
        title: "Implementare piattaforma near-miss reporting",
        description: "Adottare un sistema digitale per la segnalazione anonima di quasi-incidenti con workflow di analisi root-cause.",
        estimatedCost: 4500,
        estimatedSavings: 0,
        paybackMonths: 0,
        pillar: "S",
        priority: "high",
      },
      {
        id: "ap-iso45001-3",
        title: "Piano formazione sicurezza potenziato",
        description: "Portare le ore di formazione annuali da 24h a 40h per dipendente, includendo simulazioni di emergenza.",
        estimatedCost: 8000,
        estimatedSavings: 3000,
        paybackMonths: 24,
        pillar: "S",
        priority: "medium",
      },
    ],
  },
  iso9001: {
    redFlags: [
      {
        id: "rf-iso9001-1",
        severity: "high",
        title: "Assenza di procedura di gestione non conformità",
        description: "Non è presente un processo documentato per la gestione delle non conformità e azioni correttive (clausola 10.2).",
        pillar: "G",
      },
      {
        id: "rf-iso9001-2",
        severity: "medium",
        title: "KPI di processo non definiti",
        description: "I processi principali non hanno indicatori di performance misurabili come richiesto dalla ISO 9001:2015.",
        pillar: "G",
      },
      {
        id: "rf-iso9001-3",
        severity: "medium",
        title: "Audit interni non pianificati",
        description: "Non è presente un programma di audit interni per il sistema di gestione qualità (clausola 9.2).",
        pillar: "G",
      },
    ],
    actionPlan: [
      {
        id: "ap-iso9001-1",
        title: "Creare procedura non conformità e azioni correttive",
        description: "Documentare il processo di identificazione, registrazione, analisi causa radice e chiusura delle non conformità.",
        estimatedCost: 3500,
        estimatedSavings: 12000,
        paybackMonths: 4,
        pillar: "G",
        priority: "high",
      },
      {
        id: "ap-iso9001-2",
        title: "Definire KPI per ogni processo chiave",
        description: "Mappare i processi principali e associare almeno 2 KPI misurabili per ciascuno, con target e frequenza di monitoraggio.",
        estimatedCost: 2000,
        estimatedSavings: 0,
        paybackMonths: 0,
        pillar: "G",
        priority: "medium",
      },
      {
        id: "ap-iso9001-3",
        title: "Pianificare ciclo di audit interni",
        description: "Definire un programma annuale di audit interni con auditor qualificati, coprendo tutti i processi del SGQ.",
        estimatedCost: 5000,
        estimatedSavings: 0,
        paybackMonths: 0,
        pillar: "G",
        priority: "medium",
      },
    ],
  },
  sa8000: {
    redFlags: [
      {
        id: "rf-sa8000-1",
        severity: "high",
        title: "Manca policy su lavoro minorile e forzato",
        description: "Non è stata rilevata una policy esplicita contro il lavoro minorile e forzato lungo la catena di fornitura.",
        pillar: "S",
      },
      {
        id: "rf-sa8000-2",
        severity: "high",
        title: "Assenza di audit fornitori su diritti umani",
        description: "Nessun processo di due diligence sui fornitori per verificare il rispetto dei diritti fondamentali del lavoro.",
        pillar: "S",
      },
      {
        id: "rf-sa8000-3",
        severity: "medium",
        title: "Orario di lavoro non monitorato",
        description: "Non è presente un sistema di monitoraggio delle ore di lavoro straordinarie conforme ai limiti SA8000.",
        pillar: "S",
      },
    ],
    actionPlan: [
      {
        id: "ap-sa8000-1",
        title: "Redigere policy su lavoro minorile e forzato",
        description: "Creare e pubblicare una policy aziendale che vieti esplicitamente lavoro minorile e forzato, estesa alla supply chain.",
        estimatedCost: 2000,
        estimatedSavings: 0,
        paybackMonths: 0,
        pillar: "S",
        priority: "high",
      },
      {
        id: "ap-sa8000-2",
        title: "Programma audit sociale fornitori",
        description: "Implementare un programma annuale di audit sociali sui fornitori principali, con checklist basata su SA8000.",
        estimatedCost: 10000,
        estimatedSavings: 0,
        paybackMonths: 0,
        pillar: "S",
        priority: "high",
      },
      {
        id: "ap-sa8000-3",
        title: "Sistema monitoraggio ore di lavoro",
        description: "Adottare un sistema digitale di timekeeping per garantire che le ore straordinarie rispettino i limiti SA8000 (48+12h/sett.).",
        estimatedCost: 4000,
        estimatedSavings: 2000,
        paybackMonths: 18,
        pillar: "S",
        priority: "medium",
      },
    ],
  },
  bcorp: {
    redFlags: [
      {
        id: "rf-bcorp-1",
        severity: "high",
        title: "Bilancio di impatto sociale non redatto",
        description: "Non è stato prodotto un bilancio di impatto conforme agli standard B Impact Assessment. Punteggio stimato sotto la soglia di 80.",
        pillar: "S",
      },
      {
        id: "rf-bcorp-2",
        severity: "high",
        title: "Statuto aziendale non modificato",
        description: "Lo statuto non include la clausola di benefit corporation / società benefit richiesta per la certificazione B Corp.",
        pillar: "G",
      },
      {
        id: "rf-bcorp-3",
        severity: "medium",
        title: "Trasparenza retributiva insufficiente",
        description: "Il rapporto tra retribuzione massima e minima non è pubblicato e potrebbe superare il rapporto 10:1 raccomandato.",
        pillar: "G",
      },
    ],
    actionPlan: [
      {
        id: "ap-bcorp-1",
        title: "Completare B Impact Assessment",
        description: "Compilare il questionario B Impact Assessment (BIA) e raggiungere un punteggio minimo di 80/200 punti.",
        estimatedCost: 5000,
        estimatedSavings: 0,
        paybackMonths: 0,
        pillar: "S",
        priority: "high",
      },
      {
        id: "ap-bcorp-2",
        title: "Modificare statuto in società benefit",
        description: "Aggiornare lo statuto aziendale inserendo la finalità di beneficio comune, come richiesto dalla Legge 208/2015.",
        estimatedCost: 3000,
        estimatedSavings: 0,
        paybackMonths: 0,
        pillar: "G",
        priority: "high",
      },
      {
        id: "ap-bcorp-3",
        title: "Report trasparenza retributiva",
        description: "Pubblicare il rapporto retributivo interno e valutare azioni per ridurre il divario sotto la soglia 10:1.",
        estimatedCost: 1500,
        estimatedSavings: 0,
        paybackMonths: 0,
        pillar: "G",
        priority: "medium",
      },
    ],
  },
};

export const mockAgents: AgentOutput[] = [
  { agentName: "Intake", status: "completed", summary: "Documenti ricevuti e validati. Estratti 47 data point." },
  { agentName: "Mapping", status: "completed", summary: "Mapping completato su 12 indicatori ESRS." },
  { agentName: "Gap-Finder", status: "completed", summary: "Identificati 3 gap critici e 4 aree di miglioramento." },
  { agentName: "Recommendation", status: "completed", summary: "Generate 3 azioni prioritarie con analisi ROI." },
  { agentName: "Report", status: "completed", summary: "Report ESG pronto per export." },
];

export const mockInternalState: InternalState = {
  companyContext: "Azienda demo — dati di fallback per sviluppo senza API key",
  previousSnapshots: [],
  knownDocuments: [],
  cumulativeFindings: "Nessuna analisi reale effettuata. Configura GEMINI_API_KEY per risultati reali.",
  lastAnalyzedAt: new Date().toISOString(),
};

export const mockAnalyzeResponse: AnalyzeResponse = {
  agents: mockAgents,
  score: mockESGScore,
  pillars: mockPillars,
  redFlags: mockRedFlags,
  actionPlan: mockActionPlan,
  internalState: mockInternalState,
  generatedAt: new Date().toISOString(),
};
