import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CHATBOT_RESPONSES } from "@/lib/constants";
import type { ChatRequest, ChatResponse, AnalyzeResponse } from "@/lib/types";

function buildChatSystemPrompt(context: AnalyzeResponse | null): string {
  if (!context) {
    return `Sei l'assistente ESG di Eco360 AI. Rispondi in italiano in modo conciso e utile.
L'utente non ha ancora completato un'analisi ESG. Guidalo a completare l'onboarding per ottenere il suo profilo ESG.`;
  }

  return `Sei l'assistente ESG di Eco360 AI. Rispondi in italiano in modo conciso, professionale e utile. Basa le tue risposte sui dati reali dell'analisi ESG dell'azienda.

## Dati dell'analisi corrente:
- ESG Score complessivo: ${context.score.overall}/100
- Score Ambientale (E): ${context.score.environmental}/100
- Score Sociale (S): ${context.score.social}/100
- Score Governance (G): ${context.score.governance}/100

## Metriche per pilastro:
${context.pillars.map((p) =>
  `### ${p.label} (${p.score}/100)\n${p.metrics.map((m) => `- ${m.label}: ${m.value} ${m.unit} (target: ${m.target} ${m.unit}, status: ${m.status})`).join("\n")}`
).join("\n\n")}

## Red Flags attivi:
${context.redFlags.map((rf) => `- [${rf.severity.toUpperCase()}] ${rf.title}: ${rf.description}`).join("\n")}

## Action Plan:
${context.actionPlan.map((a) => `- ${a.title} (Costo: €${a.estimatedCost}, Risparmio: €${a.estimatedSavings}/anno, Payback: ${a.paybackMonths} mesi, Priorità: ${a.priority})`).join("\n")}

## Regole:
- Rispondi sempre in italiano
- Sii conciso (max 3-4 frasi per risposta)
- Cita dati specifici dall'analisi quando pertinente
- Suggerisci azioni concrete dal piano d'azione quando appropriato
- Se l'utente chiede qualcosa non correlato all'ESG, riporta gentilmente la conversazione sui temi ESG`;
}

function findFallbackResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [patterns, response] of Object.entries(CHATBOT_RESPONSES)) {
    const keywords = patterns.split("|");
    if (keywords.some((kw) => lower.includes(kw))) {
      return response;
    }
  }
  return "Non ho informazioni specifiche su questo argomento. Prova a chiedere informazioni su emissioni CO₂, score ESG, compliance normativa o risparmio energetico.";
}

export async function POST(request: NextRequest): Promise<NextResponse<ChatResponse>> {
  let body: ChatRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ reply: "Errore nella richiesta." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // Fallback to keyword matching if no API key
  if (!apiKey) {
    return NextResponse.json({ reply: findFallbackResponse(body.message) });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: buildChatSystemPrompt(body.analysisContext),
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 1024,
      },
    });

    // Convert history to Gemini chat format
    const history = body.history
      .filter((msg) => msg.id !== "welcome") // skip system welcome message
      .map((msg) => ({
        role: msg.role === "user" ? "user" as const : "model" as const,
        parts: [{ text: msg.content }],
      }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(body.message);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("[Eco360 Chat] Gemini error:", error);
    // Fallback to keyword matching on error
    return NextResponse.json({ reply: findFallbackResponse(body.message) });
  }
}
