"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import CompanyHeader from "@/components/dashboard/CompanyHeader";
import CTACards from "@/components/dashboard/CTACards";
import ESGGrid from "@/components/dashboard/ESGGrid";
import RedFlags from "@/components/dashboard/RedFlags";
import ActionPlan from "@/components/dashboard/ActionPlan";
import UploadModal from "@/components/dashboard/UploadModal";
import ComplianceModal from "@/components/dashboard/ComplianceModal";
import {
  certificationMockData,
} from "@/lib/mock-data";
import type {
  ESGScore,
  ESGPillarData,
  RedFlag,
  ActionItem,
  InternalState,
  AnalyzeResponse,
  OnboardingData,
  AnalyzeRequestPayload,
} from "@/lib/types";
import { Loader2, Check } from "lucide-react";

const AGENT_NAMES = ["Intake", "Mapping", "Gap-Finder", "Recommendation", "Report"] as const;

// Default empty score (shown only during initial load)
const emptyScore: ESGScore = { overall: 0, environmental: 0, social: 0, governance: 0 };

export default function DashboardPage() {
  // Company info
  const [companyName, setCompanyName] = useState("La Tua Azienda");

  // Dashboard data state — starts empty, populated by AI
  const [score, setScore] = useState<ESGScore>(emptyScore);
  const [pillars, setPillars] = useState<ESGPillarData[]>([]);
  const [redFlags, setRedFlags] = useState<RedFlag[]>([]);
  const [actionPlan, setActionPlan] = useState<ActionItem[]>([]);

  // Incremental state (persisted in localStorage)
  const [internalState, setInternalState] = useState<InternalState | null>(null);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);

  // UI state
  const [monthlyModalOpen, setMonthlyModalOpen] = useState(false);
  const [complianceModalOpen, setComplianceModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeAgent, setActiveAgent] = useState(-1);
  const [hasData, setHasData] = useState(false);

  const hasTriggeredInitial = useRef(false);

  // Apply an analysis response to all dashboard state
  const applyAnalysis = useCallback((analysis: AnalyzeResponse) => {
    if (analysis.score) setScore(analysis.score);
    if (analysis.pillars?.length) setPillars(analysis.pillars);
    if (analysis.redFlags?.length) setRedFlags(analysis.redFlags);
    if (analysis.actionPlan?.length) setActionPlan(analysis.actionPlan);
    if (analysis.internalState) setInternalState(analysis.internalState);
    setHasData(true);
  }, []);

  const runAnalysis = useCallback(async (
    documentDescriptions: string[],
    updateType: "initial" | "monthly" | "milestone",
    prevState: InternalState | null,
    company?: OnboardingData["company"],
    hardware?: OnboardingData["hardware"],
    targetCertification?: string
  ) => {
    setIsAnalyzing(true);
    setActiveAgent(-1);

    const companyProfile = company ?? onboardingData?.company ?? {
      name: companyName,
      vatNumber: "",
      atecoSector: "",
      officeSqm: 0,
    };
    const hw = hardware ?? onboardingData?.hardware ?? {
      pcStations: 0,
      physicalServers: 0,
      printers: 0,
    };

    const payload: AnalyzeRequestPayload = {
      companyProfile,
      hardware: hw,
      documentDescriptions,
      previousState: prevState,
      updateType,
      targetCertification,
    };

    // Agent animation runs concurrently with the API call
    const agentAnimation = async () => {
      for (let i = 0; i < AGENT_NAMES.length; i++) {
        setActiveAgent(i);
        await new Promise((r) => setTimeout(r, 1500));
      }
    };

    try {
      const [response] = await Promise.all([
        fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).then((res) => res.json() as Promise<AnalyzeResponse>),
        agentAnimation(),
      ]);

      // Apply the response to dashboard
      applyAnalysis(response);

      // Persist to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("eco360_analysis", JSON.stringify(response));
      }
    } catch (error) {
      console.error("[Eco360] Analysis failed:", error);
    }

    setActiveAgent(-1);
    setIsAnalyzing(false);
  }, [companyName, onboardingData, applyAnalysis]);

  // Load from localStorage on mount, or trigger initial analysis
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (hasTriggeredInitial.current) return;
    hasTriggeredInitial.current = true;

    let oData: OnboardingData | null = null;

    try {
      const onboardingStr = localStorage.getItem("eco360_onboarding");
      if (onboardingStr) {
        oData = JSON.parse(onboardingStr);
        if (oData) {
          setOnboardingData(oData);
          if (oData.company?.name) setCompanyName(oData.company.name);
        }
      }
    } catch { /* ignore */ }

    // Check if we have a saved analysis
    try {
      const analysisStr = localStorage.getItem("eco360_analysis");
      if (analysisStr) {
        const analysis: AnalyzeResponse = JSON.parse(analysisStr);
        applyAnalysis(analysis);
        return; // We have data, no need to trigger initial analysis
      }
    } catch { /* ignore */ }

    // No saved analysis → trigger an initial one using Gemini AI
    const company = oData?.company ?? { name: "Azienda Demo", vatNumber: "", atecoSector: "62.01 - Produzione di software", officeSqm: 200 };
    const hardware = oData?.hardware ?? { pcStations: 15, physicalServers: 2, printers: 3 };

    const demoDocuments = [
      "Visura Camerale 2024 (PDF, 245 KB)",
      "Bolletta energia elettrica Q4 2024 (PDF, 120 KB)",
      "Report rifiuti annuale 2024 (XLSX, 85 KB)",
      "Registro formazione dipendenti 2024 (XLSX, 150 KB)",
      "Codice Etico Aziendale v2.1 (PDF, 320 KB)",
    ];

    // Run initial analysis with demo/onboarding data
    runAnalysis(demoDocuments, "initial", null, company, hardware);
  }, [applyAnalysis, runAnalysis]);

  // Handle file upload from modal
  const handleUploadAnalyze = useCallback((files: File[]) => {
    setMonthlyModalOpen(false);
    const documentDescriptions = files.map(
      (f) => `${f.name} (${f.type || "tipo sconosciuto"}, ${(f.size / 1024).toFixed(0)} KB)`
    );
    runAnalysis(documentDescriptions, "monthly", internalState);
  }, [internalState, runAnalysis]);

  // Handle compliance modal
  const handleComplianceAnalyze = useCallback((certificationId: string) => {
    setComplianceModalOpen(false);
    runAnalysis([], "milestone", internalState, undefined, undefined, certificationId);
  }, [internalState, runAnalysis]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Header */}
          <CompanyHeader companyName={companyName} score={score} />

          {/* CTA Cards */}
          <CTACards
            onMonthlyUpdate={() => setMonthlyModalOpen(true)}
            onAddMilestone={() => setComplianceModalOpen(true)}
          />

          {/* ESG Grid */}
          {pillars.length > 0 && <ESGGrid pillars={pillars} />}

          {/* AI Intelligence */}
          {(redFlags.length > 0 || actionPlan.length > 0) && (
            <div>
              <h2 className="mb-4 text-lg font-semibold text-slate-900">AI Intelligence</h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {redFlags.length > 0 && <RedFlags flags={redFlags} />}
                {actionPlan.length > 0 && <ActionPlan actions={actionPlan} />}
              </div>
            </div>
          )}

          {/* Empty state while waiting for first analysis */}
          {!hasData && !isAnalyzing && (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
              <p className="text-slate-500">Nessuna analisi disponibile. Carica documenti per iniziare.</p>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Loading Overlay — Agent Pipeline */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white/95 px-8 py-8 shadow-2xl">
            <h2 className="mb-6 text-center text-lg font-semibold text-slate-900">
              IA al lavoro...
            </h2>
            <div className="space-y-3">
              {AGENT_NAMES.map((name, i) => (
                <div key={name} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center">
                    {i < activeAgent ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                        <Check className="h-4 w-4 text-emerald-600" />
                      </div>
                    ) : i === activeAgent ? (
                      <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                    ) : (
                      <div className="h-6 w-6 rounded-full border-2 border-slate-200" />
                    )}
                  </div>
                  <span
                    className={
                      i <= activeAgent
                        ? "font-medium text-slate-900"
                        : "text-slate-400"
                    }
                  >
                    {name} Agent
                  </span>
                  {i < activeAgent && (
                    <span className="ml-auto text-xs text-emerald-600">Completato</span>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-slate-500">
              Analisi ESG in elaborazione tramite Gemini AI...
            </p>
          </div>
        </div>
      )}

      {/* Modals */}
      <UploadModal
        isOpen={monthlyModalOpen}
        onClose={() => setMonthlyModalOpen(false)}
        onAnalyze={handleUploadAnalyze}
        title="Aggiornamento Mensile"
        description="Carica bollette energetiche, fatture rifiuti e dati HR per aggiornare gli indicatori ESG."
      />
      <ComplianceModal
        isOpen={complianceModalOpen}
        onClose={() => setComplianceModalOpen(false)}
        onAnalyze={handleComplianceAnalyze}
      />
    </div>
  );
}
