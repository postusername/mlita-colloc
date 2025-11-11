import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const formalizerPrompt = `Ты — экспертный ассистент по формальной логике. Преобразуй следующую текстовую задачу в набор формул логики предикатов в клаузальной форме, готовых для метода резолюций. Это включает в себя отрицание доказываемого утверждения. Выведи ТОЛЬКО формулы, разделяя их запятыми.

Пример задачи: "Сократ — человек. Все люди смертны. Докажи, что Сократ смертен."
Пример вывода: Человек(Сократ), ¬Человек(х) V Смертен(х), ¬Смертен(Сократ)`;

const proofGeneratorPrompt = `Ты — симулятор движка резолюций. Тебе дан набор клауз. Продемонстрируй пошаговое доказательство методом резолюций, чтобы прийти к пустому дизъюнкту (противоречию). Каждый шаг должен показывать, какие клаузы резольвируются и какой результат получается. Формат вывода должен быть кратким и техническим.

Пример входа: Человек(Сократ), ¬Человек(х) V Смертен(х), ¬Смертен(Сократ)
Пример вывода: [Шаг 1: Резолюция 'Человек(Сократ)' и '¬Человек(х) V Смертен(х)' с унификацией {х/Сократ} -> 'Смертен(Сократ)'.
Шаг 2: Резолюция 'Смертен(Сократ)' и '¬Смертен(Сократ)' -> Противоречие.]`;

const explainerPrompt = `Ты — учитель логики. Объясни доказательство, представленное в виде последовательности логических шагов, как если бы ты объяснял его студенту. Будь последовательным и ясным. Используй естественный русский язык.`;

/**
 * Module 1: Formalizes a natural language logic problem into predicate logic.
 * @param problemText The natural language problem.
 * @returns A string containing predicate logic formulas.
 */
export async function formalizeProblem(problemText: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
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
 * Module 2: Simulates a resolution proof based on formalized predicates.
 * @param formalFormulas The predicate logic formulas from Module 1.
 * @returns A string representing the steps of the proof.
 */
export async function generateProof(formalFormulas: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: formalFormulas,
      config: {
        systemInstruction: proofGeneratorPrompt,
      },
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error in generateProof:", error);
    throw new Error("Failed to generate proof with Gemini API.");
  }
}


/**
 * Module 3: Explains a formal proof in natural language.
 * @param proofText The formal proof steps from Module 2.
 * @returns A natural language explanation of the proof.
 */
export async function explainProof(proofText: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
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