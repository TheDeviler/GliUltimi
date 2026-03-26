// ==================== ONBOARDING ====================

export interface CompanyProfile {
  name: string;
  vatNumber: string;
  atecoSector: string;
  officeSqm: number;
}

export interface HardwareBaseline {
  pcStations: number;
  physicalServers: number;
  printers: number;
}

export interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export interface OnboardingData {
  company: CompanyProfile;
  hardware: HardwareBaseline;
  documents: UploadedDocument[];
}

// ==================== ESG SCORES ====================

export interface ESGScore {
  overall: number;
  environmental: number;
  social: number;
  governance: number;
}

export type ESGStatus = "good" | "warning" | "critical";

export interface ESGMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  target: number;
  status: ESGStatus;
  pillar: "E" | "S" | "G";
}

export interface ChartDataPoint {
  name: string;
  actual: number;
  target: number;
}

export interface ESGPillarData {
  pillar: "E" | "S" | "G";
  label: string;
  score: number;
  metrics: ESGMetric[];
  chartData: ChartDataPoint[];
}

// ==================== INCREMENTAL STATE ====================

export interface AnalysisSnapshot {
  date: string;
  scores: ESGScore;
  metricValues: Record<string, number>;
}

export interface InternalState {
  companyContext: string;
  previousSnapshots: AnalysisSnapshot[];
  knownDocuments: string[];
  cumulativeFindings: string;
  lastAnalyzedAt: string;
}

// ==================== AI / API ====================

export interface AnalyzeRequestPayload {
  companyProfile: CompanyProfile;
  hardware: HardwareBaseline;
  documentDescriptions: string[];
  previousState: InternalState | null;
  updateType: "initial" | "monthly" | "milestone";
  targetCertification?: string;
}

export type AgentName =
  | "Intake"
  | "Mapping"
  | "Gap-Finder"
  | "Recommendation"
  | "Report";

export interface AgentOutput {
  agentName: AgentName;
  status: "completed" | "processing" | "pending";
  summary: string;
}

export interface RedFlag {
  id: string;
  severity: "high" | "medium";
  title: string;
  description: string;
  pillar: "E" | "S" | "G";
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  estimatedCost: number;
  estimatedSavings: number;
  paybackMonths: number;
  pillar: "E" | "S" | "G";
  priority: "high" | "medium" | "low";
}

export interface AnalyzeResponse {
  agents: AgentOutput[];
  score: ESGScore;
  pillars: ESGPillarData[];
  redFlags: RedFlag[];
  actionPlan: ActionItem[];
  internalState: InternalState;
  generatedAt: string;
}

// ==================== CHATBOT ====================

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  history: ChatMessage[];
  analysisContext: AnalyzeResponse | null;
}

export interface ChatResponse {
  reply: string;
}
