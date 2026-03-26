import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { mockAnalyzeResponse } from "@/lib/mock-data";
import type { AnalyzeRequestPayload, AnalyzeResponse } from "@/lib/types";

const SYSTEM_PROMPT = `Sei un sistema di analisi ESG composto da 5 agenti specializzati. Analizza i dati aziendali forniti e produci un profilo ESG completo in formato JSON.

## I tuoi 5 agenti:
1. **Intake Agent**: Ricevi e valida i dati aziendali. Estrai data point rilevanti dai documenti descritti.
2. **Mapping Agent**: Mappa i dati sugli indicatori ESRS (European Sustainability Reporting Standards). Ogni pilastro (E, S, G) deve avere esattamente 3 metriche.
3. **Gap-Finder Agent**: Identifica gap critici rispetto alla normativa CSRD, Direttiva UE 2019/1937 (whistleblowing), standard GRI e best practice settoriali.
4. **Recommendation Agent**: Genera un action plan con analisi ROI (costo stimato, risparmio annuo, payback in mesi). Prioritizza per impatto.
5. **Report Agent**: Compila il profilo ESG finale con score 0-100 per ogni pilastro.

## Regole per gli Score:
- Ogni pilastro (E, S, G) ha score 0-100
- Overall = media ponderata (E: 40%, S: 30%, G: 30%) arrotondata all'intero
- Score >= 75: azienda in buona posizione; 50-74: migliorabile; < 50: critico
- Basa gli score su dati reali del settore ATECO fornito e sulle informazioni disponibili

## Regole per le Metriche:
- Esattamente 3 metriche per pilastro, con id univoco (e1, e2, e3, s1, s2, s3, g1, g2, g3)
- Ogni metrica ha: label (italiano), value (numerico), unit, target (benchmark settoriale), status (good/warning/critical)
- Status: good = value migliore o uguale al target; warning = entro 20% dal target; critical = oltre 20%

## Regole per chartData (Trend 6 mesi):
- Se NON ci sono previousSnapshots: genera 6 punti dati con nomi mesi italiani abbreviati (Gen, Feb, Mar, Apr, Mag, Giu, Lug, Ago, Set, Ott, Nov, Dic). Usa i 5 mesi precedenti + mese corrente. Crea valori credibili che mostrano un trend verso il valore attuale. I target mostrano miglioramento graduale.
- Se CI SONO previousSnapshots: usa i dati storici reali per ricostruire i mesi passati, aggiungi il mese corrente con i nuovi valori. Mantieni sempre esattamente 6 punti.

## Regole per Red Flags:
- Solo gap realmente critici (non-conformità normativa, rischi legali, violazioni di soglia)
- Severity "high" per obblighi di legge, "medium" per best practice mancate
- Minimo 1, massimo 5 red flags

## Regole per Action Plan:
- Da 3 a 5 azioni, ordinate per priorità
- estimatedCost e estimatedSavings in EUR, realistici per il settore e dimensione aziendale
- paybackMonths = 0 se è compliance obbligatoria senza risparmio diretto
- priority: "high" per azioni urgenti/obbligatorie, "medium" per miglioramenti importanti, "low" per ottimizzazioni

## Regole per internalState:
- companyContext: riassumi in 2-3 frasi chi è l'azienda, il settore, le dimensioni
- previousSnapshots: mantieni gli snapshot precedenti (max 6, rimuovi i più vecchi) e aggiungi quello corrente con date ISO e i valori delle metriche correnti
- knownDocuments: lista cumulativa di tutti i documenti già analizzati (aggiungi i nuovi a quelli esistenti)
- cumulativeFindings: riassumi in modo cumulativo tutti i finding passati e nuovi (max 500 parole)
- lastAnalyzedAt: timestamp ISO della analisi corrente

## Regole per agents:
- Per ogni agente, imposta status: "completed" e scrivi un summary in italiano di 1 frase che descrive cosa ha fatto

## CRITICO: Lingua italiana per tutti i campi testuali (label, description, title, summary, companyContext, cumulativeFindings)

## SCHEMA JSON OBBLIGATORIO:
Rispondi ESCLUSIVAMENTE con un oggetto JSON che rispetta esattamente questa struttura:

{
  "agents": [
    { "agentName": "Intake" | "Mapping" | "Gap-Finder" | "Recommendation" | "Report", "status": "completed", "summary": "<stringa in italiano>" }
  ],
  "score": {
    "overall": <0-100>,
    "environmental": <0-100>,
    "social": <0-100>,
    "governance": <0-100>
  },
  "pillars": [
    {
      "pillar": "E" | "S" | "G",
      "label": "Environment" | "Social" | "Governance",
      "score": <0-100>,
      "metrics": [
        { "id": "<e1|e2|e3|s1|s2|s3|g1|g2|g3>", "label": "<italiano>", "value": <numero>, "unit": "<unità>", "target": <numero>, "status": "good" | "warning" | "critical", "pillar": "E" | "S" | "G" }
      ],
      "chartData": [
        { "name": "<mese abbreviato>", "actual": <numero>, "target": <numero> }
      ]
    }
  ],
  "redFlags": [
    { "id": "<stringa>", "severity": "high" | "medium", "title": "<italiano>", "description": "<italiano>", "pillar": "E" | "S" | "G" }
  ],
  "actionPlan": [
    { "id": "<stringa>", "title": "<italiano>", "description": "<italiano>", "estimatedCost": <EUR>, "estimatedSavings": <EUR>, "paybackMonths": <numero>, "pillar": "E" | "S" | "G", "priority": "high" | "medium" | "low" }
  ],
  "internalState": {
    "companyContext": "<italiano, 2-3 frasi>",
    "previousSnapshots": [
      { "date": "<ISO>", "scores": { "overall": <n>, "environmental": <n>, "social": <n>, "governance": <n> }, "metricValues": { "<metric_id>": <valore> } }
    ],
    "knownDocuments": ["<nome documento>"],
    "cumulativeFindings": "<italiano, max 500 parole>",
    "lastAnalyzedAt": "<ISO>"
  },
  "generatedAt": "<ISO>"
}

NON aggiungere testo prima o dopo il JSON. Rispondi SOLO con il JSON valido.`;

function buildUserMessage(payload: AnalyzeRequestPayload): string {
  const newDocs = payload.documentDescriptions.length > 0
    ? payload.documentDescriptions.map((d, i) => `${i + 1}. ${d}`).join("\n")
    : "Nessun documento caricato in questa sessione";

  const previousStateStr = payload.previousState
    ? JSON.stringify(payload.previousState, null, 2)
    : "Prima analisi — nessuno stato precedente";

  const targetCertStr = payload.targetCertification
    ? `\n\n## OBIETTIVO CERTIFICAZIONE:\nL'azienda vuole valutare il gap per la certificazione: ${payload.targetCertification}. Oltre all'aggiornamento generale dello score, concentra i red flags (gap critici rispetto alla norma) e i suggerimenti (action plan per adeguarsi) ESCLUSIVAMENTE sui requisiti specifici di questa certificazione.`
    : "";

  return `## Dati Azienda:
- Nome: ${payload.companyProfile.name || "Non specificato"}
- P.IVA: ${payload.companyProfile.vatNumber || "Non specificata"}
- Settore ATECO: ${payload.companyProfile.atecoSector || "Non specificato"}
- Metratura uffici: ${payload.companyProfile.officeSqm || 0} mq
- PC/Workstation: ${payload.hardware.pcStations || 0}
- Server fisici: ${payload.hardware.physicalServers || 0}
- Stampanti: ${payload.hardware.printers || 0}

## Nuovi documenti caricati:
${newDocs}

## Tipo aggiornamento: ${payload.updateType}${targetCertStr}

## Stato precedente dell'azienda (memoria incrementale):
${previousStateStr}

## Data corrente: ${new Date().toISOString()}`;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  // Parse request body
  let payload: AnalyzeRequestPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Fallback to mock if no API key
  if (!apiKey) {
    console.warn("[Eco360] GEMINI_API_KEY not set — returning mock data");
    await new Promise((r) => setTimeout(r, 2000));
    const fallback: AnalyzeResponse = {
      ...mockAnalyzeResponse,
      internalState: {
        companyContext: `${payload.companyProfile.name} — settore ${payload.companyProfile.atecoSector}. Analisi demo, configurare GEMINI_API_KEY per risultati reali.`,
        previousSnapshots: payload.previousState?.previousSnapshots ?? [],
        knownDocuments: [
          ...(payload.previousState?.knownDocuments ?? []),
          ...payload.documentDescriptions,
        ],
        cumulativeFindings: payload.previousState?.cumulativeFindings ?? "Analisi demo con dati mockati. Configura GEMINI_API_KEY per risultati reali.",
        lastAnalyzedAt: new Date().toISOString(),
      },
      generatedAt: new Date().toISOString(),
    };
    return NextResponse.json(fallback);
  }

  // Try multiple models in order of preference
  const MODELS = [
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-pro",
  ];

  const genAI = new GoogleGenerativeAI(apiKey);
  const userMessage = buildUserMessage(payload);

  for (const modelName of MODELS) {
    try {
      console.log(`[Eco360] Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_PROMPT,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      });

      const result = await model.generateContent(userMessage);
      const responseText = result.response.text();

      let parsed: AnalyzeResponse;
      try {
        parsed = JSON.parse(responseText);
      } catch {
        console.error(`[Eco360] Failed to parse ${modelName} response:`, responseText.substring(0, 500));
        continue; // Try next model
      }

      parsed.generatedAt = new Date().toISOString();
      console.log(`[Eco360] Success with model: ${modelName}`);
      return NextResponse.json(parsed);
    } catch (error: unknown) {
      const statusCode = (error as { status?: number })?.status;
      console.warn(`[Eco360] Model ${modelName} failed (status ${statusCode}):`, (error as Error).message?.substring(0, 200));

      // If quota exceeded (429), wait and retry same model once
      if (statusCode === 429) {
        console.log(`[Eco360] Retrying ${modelName} after 5s delay...`);
        await new Promise((r) => setTimeout(r, 5000));
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: SYSTEM_PROMPT,
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.7,
              maxOutputTokens: 8192,
            },
          });
          const result = await model.generateContent(userMessage);
          const responseText = result.response.text();
          const parsed: AnalyzeResponse = JSON.parse(responseText);
          parsed.generatedAt = new Date().toISOString();
          console.log(`[Eco360] Retry success with model: ${modelName}`);
          return NextResponse.json(parsed);
        } catch (retryError) {
          console.warn(`[Eco360] Retry also failed for ${modelName}:`, (retryError as Error).message?.substring(0, 100));
        }
      }
      // Continue to next model
    }
  }

  // All models failed — return fallback
  console.error("[Eco360] All Gemini models failed — returning mock data");
  const fallback: AnalyzeResponse = {
    ...mockAnalyzeResponse,
    internalState: {
      companyContext: `${payload.companyProfile.name} — tutti i modelli Gemini non disponibili, dati di fallback`,
      previousSnapshots: payload.previousState?.previousSnapshots ?? [],
      knownDocuments: [
        ...(payload.previousState?.knownDocuments ?? []),
        ...payload.documentDescriptions,
      ],
      cumulativeFindings: payload.previousState?.cumulativeFindings ?? "Nessun modello Gemini disponibile. Verifica la chiave API e i limiti di quota.",
      lastAnalyzedAt: new Date().toISOString(),
    },
    generatedAt: new Date().toISOString(),
  };
  return NextResponse.json(fallback);
}

