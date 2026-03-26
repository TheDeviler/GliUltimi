"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Loader2, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import StepIndicator from "@/components/onboarding/StepIndicator";
import CompanyIdentityStep from "@/components/onboarding/CompanyIdentityStep";
import HardwareBaselineStep from "@/components/onboarding/HardwareBaselineStep";
import DocumentUploadStep from "@/components/onboarding/DocumentUploadStep";
import { defaultOnboardingData } from "@/lib/mock-data";
import type { OnboardingData, AgentName, AnalyzeResponse } from "@/lib/types";

const STEPS = ["Identità", "Asset", "Documenti"];
const AGENTS: AgentName[] = ["Intake", "Mapping", "Gap-Finder", "Recommendation", "Report"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({ ...defaultOnboardingData });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeAgent, setActiveAgent] = useState(-1);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);

    // Store onboarding data for dashboard
    if (typeof window !== "undefined") {
      localStorage.setItem("eco360_onboarding", JSON.stringify(data));
    }

    // Build document descriptions from uploaded files
    const documentDescriptions = uploadedFiles.map(
      (f) => `${f.name} (${f.type || "tipo sconosciuto"}, ${(f.size / 1024).toFixed(0)} KB)`
    );

    // Add documents from the onboarding data structure too
    const onboardingDocDescriptions = data.documents.map((d) => d.name);
    const allDocDescriptions = [...new Set([...documentDescriptions, ...onboardingDocDescriptions])];

    // Agent animation runs concurrently with the API call
    const agentAnimation = async () => {
      for (let i = 0; i < AGENTS.length; i++) {
        setActiveAgent(i);
        await new Promise((r) => setTimeout(r, 1200));
      }
    };

    // Call the analyze API
    try {
      const [response] = await Promise.all([
        fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            companyProfile: data.company,
            hardware: data.hardware,
            documentDescriptions: allDocDescriptions,
            previousState: null, // First analysis — no previous state
            updateType: "initial",
          }),
        }).then((res) => res.json() as Promise<AnalyzeResponse>),
        agentAnimation(),
      ]);

      // Save full analysis result to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("eco360_analysis", JSON.stringify(response));
      }
    } catch (error) {
      console.error("[Eco360] Initial analysis failed:", error);
      // Dashboard will use mock defaults if no analysis is saved
    }

    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-xl">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-slate-900">
            Eco<span className="text-emerald-600">360</span>{" "}
            <span className="text-blue-900">AI</span>
          </span>
        </div>

        {!isAnalyzing ? (
          <>
            {/* Step Indicator */}
            <div className="mb-8">
              <StepIndicator currentStep={step} steps={STEPS} />
            </div>

            {/* Step Content */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              {step === 1 && (
                <CompanyIdentityStep
                  data={data.company}
                  onUpdate={(company) => setData({ ...data, company })}
                />
              )}
              {step === 2 && (
                <HardwareBaselineStep
                  data={data.hardware}
                  onUpdate={(hardware) => setData({ ...data, hardware })}
                />
              )}
              {step === 3 && (
                <DocumentUploadStep
                  onFilesChange={(files) => {
                    setUploadedFiles(files);
                    setData({
                      ...data,
                      documents: files.map((f, i) => ({
                        id: `doc-${i}`,
                        name: f.name,
                        size: f.size,
                        type: f.type,
                        uploadedAt: new Date().toISOString(),
                      })),
                    });
                  }}
                />
              )}

              {/* Navigation */}
              <div className="mt-6 flex justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setStep((s) => Math.max(1, s - 1) as 1 | 2 | 3)}
                  disabled={step === 1}
                >
                  Indietro
                </Button>

                {step < 3 ? (
                  <Button onClick={() => setStep((s) => Math.min(3, s + 1) as 1 | 2 | 3)}>
                    Avanti
                  </Button>
                ) : (
                  <Button onClick={handleAnalyze} size="lg">
                    <Leaf className="h-4 w-4" />
                    Genera Profilo ESG Base
                  </Button>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Processing Animation */
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-center text-xl font-semibold text-slate-900">
              IA al lavoro...
            </h2>
            <div className="space-y-4">
              {AGENTS.map((agent, i) => (
                <div key={agent} className="flex items-center gap-3">
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
                    {agent} Agent
                  </span>
                  {i < activeAgent && (
                    <span className="ml-auto text-xs text-emerald-600">Completato</span>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-slate-500">
              Analisi ESG tramite Gemini AI in corso...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
