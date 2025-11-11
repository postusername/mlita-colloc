import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const formalizerPrompt = `Ты — экспертный ассистент по формальной логике. Преобразуй следующую текстовую задачу в набор формул логики предикатов. Используй предикаты типа Человек(х), Смертен(х), ГоворитПравду(х). Выведи ТОЛЬКО формулы в формате: Предикат(Объект) или ¬Предикат(Объект), разделяя их запятыми.`;
const explainerPrompt = `Ты — учитель логики. Объясни доказательство, представленное в виде последовательности логических шагов, как если бы ты объяснял его студенту. Будь последовательным и ясным. Используй естественный русский язык.`;

/**
 * Module 1: Formalizes a natural language logic problem into predicate logic.
 * @param problemText The natural language problem.
 * @returns A string containing predicate logic formulas.
 */
export async function formalizeProblem(problemText: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: problemText,
      config: {
        systemInstruction: formalizerPrompt,
      },
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error in formalizeProblem:", error);
    throw new Error("Failed to formalize the problem with Gemini API.");
  }
}

/**
 * Module 3: Explains a formal proof in natural language.
 * @param proofText The formal proof steps.
 * @returns A natural language explanation of the proof.
 */
export async function explainProof(proofText: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: proofText,
      config: {
        systemInstruction: explainerPrompt,
      },
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error in explainProof:", error);
    throw new Error("Failed to explain the proof with Gemini API.");
  }
}
