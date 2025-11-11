if (!process.env.DEEPSEEK_API_KEY) {
  throw new Error("DEEPSEEK_API_KEY environment variable not set");
}

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEEPSEEK_MODEL_NAME = process.env.DEEPSEEK_MODEL_NAME || "deepseek/deepseek-chat-v3-0324:free";

const formalizerPrompt = `Ты — экспертный ассистент по формальной логике. Преобразуй следующую текстовую задачу в набор формул логики предикатов в клаузальной форме, готовых для метода резолюций. Это включает в себя отрицание доказываемого утверждения. Выведи ТОЛЬКО формулы, разделяя их запятыми.

Пример задачи: "Сократ — человек. Все люди смертны. Докажи, что Сократ смертен."
Пример вывода: Человек(Сократ), ¬Человек(х) V Смертен(х), ¬Смертен(Сократ)`;

const proofGeneratorPrompt = `Ты — симулятор движка резолюций. Тебе дан набор клауз. Продемонстрируй пошаговое доказательство методом резолюций, чтобы прийти к пустому дизъюнкту (противоречию). Каждый шаг должен показывать, какие клаузы резольвируются и какой результат получается. Формат вывода должен быть кратким и техническим.

Пример входа: Человек(Сократ), ¬Человек(х) V Смертен(х), ¬Смертен(Сократ)
Пример вывода: [Шаг 1: Резолюция 'Человек(Сократ)' и '¬Человек(х) V Смертен(х)' с унификацией {х/Сократ} -> 'Смертен(Сократ)'.
Шаг 2: Резолюция 'Смертен(Сократ)' и '¬Смертен(Сократ)' -> Противоречие.]`;

const explainerPrompt = `Ты — учитель логики. Объясни доказательство, представленное в виде последовательности логических шагов, как если бы ты объяснял его студенту. Будь последовательным и ясным. Используй естественный русский язык.`;

async function callDeepseekAPI(systemPrompt: string, userMessage: string): Promise<string> {
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL_NAME,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Deepseek API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error calling Deepseek API:", error);
    throw new Error("Failed to get response from Deepseek API.");
  }
}

/**
 * Module 1: Formalizes a natural language logic problem into predicate logic.
 * @param problemText The natural language problem.
 * @returns A string containing predicate logic formulas.
 */
export async function formalizeProblem(problemText: string): Promise<string> {
  return callDeepseekAPI(formalizerPrompt, problemText);
}

/**
 * Module 2: Simulates a resolution proof based on formalized predicates.
 * @param formalFormulas The predicate logic formulas from Module 1.
 * @returns A string representing the steps of the proof.
 */
export async function generateProof(formalFormulas: string): Promise<string> {
  return callDeepseekAPI(proofGeneratorPrompt, formalFormulas);
}

/**
 * Module 3: Explains a formal proof in natural language.
 * @param proofText The formal proof steps from Module 2.
 * @returns A natural language explanation of the proof.
 */
export async function explainProof(proofText: string): Promise<string> {
  return callDeepseekAPI(explainerPrompt, proofText);
}
