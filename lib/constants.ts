export const ATECO_SECTORS = [
  { code: "62.01", label: "62.01 - Produzione di software" },
  { code: "46.90", label: "46.90 - Commercio all'ingrosso non specializzato" },
  { code: "41.20", label: "41.20 - Costruzione di edifici residenziali e non" },
  { code: "56.10", label: "56.10 - Ristorazione con somministrazione" },
  { code: "10.71", label: "10.71 - Produzione di pane e pasticceria fresca" },
  { code: "25.11", label: "25.11 - Fabbricazione di strutture metalliche" },
  { code: "47.11", label: "47.11 - Commercio al dettaglio in esercizi non specializzati" },
  { code: "49.41", label: "49.41 - Trasporto di merci su strada" },
  { code: "68.20", label: "68.20 - Affitto e gestione di immobili propri" },
  { code: "85.59", label: "85.59 - Altra istruzione non classificata" },
  { code: "86.21", label: "86.21 - Servizi degli studi medici di medicina generale" },
  { code: "69.20", label: "69.20 - Contabilità e consulenza fiscale" },
  { code: "71.12", label: "71.12 - Attività degli studi di ingegneria" },
  { code: "73.11", label: "73.11 - Agenzie pubblicitarie" },
  { code: "96.02", label: "96.02 - Servizi dei parrucchieri e di altri trattamenti estetici" },
] as const;

export const ESG_STATUS_CONFIG = {
  good: { label: "Buono", color: "emerald", bgClass: "bg-emerald-50", textClass: "text-emerald-700", borderClass: "border-emerald-200" },
  warning: { label: "Attenzione", color: "yellow", bgClass: "bg-yellow-50", textClass: "text-yellow-700", borderClass: "border-yellow-200" },
  critical: { label: "Critico", color: "red", bgClass: "bg-red-50", textClass: "text-red-700", borderClass: "border-red-200" },
} as const;

export const PILLAR_COLORS = {
  E: { bg: "bg-emerald-50", text: "text-emerald-700", accent: "bg-emerald-600", chart: "#059669" },
  S: { bg: "bg-blue-50", text: "text-blue-700", accent: "bg-blue-600", chart: "#2563eb" },
  G: { bg: "bg-purple-50", text: "text-purple-700", accent: "bg-purple-600", chart: "#9333ea" },
} as const;

export const PILLAR_LABELS = {
  E: "Environment",
  S: "Social",
  G: "Governance",
} as const;

export const DOCUMENT_TYPES = [
  "Visura Camerale",
  "Codice Etico",
  "Employee Handbook",
] as const;

export const CHATBOT_RESPONSES: Record<string, string> = {
  "co2|emissioni|carbonio|scope":
    "Le tue emissioni Scope 2 sono attualmente di 42.5 tCO2e, superiori del 23% rispetto al target settoriale di 34.5 tCO2e. Ti consiglio di valutare il passaggio a un fornitore di energia con Garanzia d'Origine (GO) rinnovabile per abbattere rapidamente questo indicatore.",
  "score|punteggio|valutazione":
    "Il tuo ESG Score complessivo è 68/100 (Medium). Il pilastro più debole è quello Ambientale (62/100), principalmente a causa delle emissioni Scope 2 elevate e del tasso di riciclo rifiuti sotto target. Il Social (71/100) e la Governance (73/100) sono in buona forma ma migliorabili.",
  "compliance|normativa|csrd|regolamento":
    "La tua azienda presenta 3 gap di compliance: (1) Emissioni Scope 2 sopra soglia CSRD, (2) Mancanza di una policy whistleblowing formale, (3) Diversità insufficiente nel CdA. Ti consiglio di prioritizzare il punto 2, poiché la Direttiva UE 2019/1937 lo rende obbligatorio.",
  "led|energia|risparmio|rinnovabile":
    "Passare a illuminazione LED e a un contratto con energia rinnovabile certificata potrebbe ridurre le emissioni Scope 2 del 40% e generare un risparmio annuo stimato di €8.500, con un payback di circa 4 mesi sull'investimento iniziale.",
};
