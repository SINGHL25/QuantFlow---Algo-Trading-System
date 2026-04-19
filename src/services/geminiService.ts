import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function analyzePerformance(trades: any[]) {
  const prompt = `Analyze these trades from my algo trading system and provide professional insights on risk management, win rate, and potential psychological/strategy leakage:
  
  ${JSON.stringify(trades, null, 2)}
  
  Provide a concise summary of strengths, weaknesses, and 3 actionable improvements.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (e) {
    console.error("AI Analysis Error:", e);
    return "AI insights currently unavailable.";
  }
}
