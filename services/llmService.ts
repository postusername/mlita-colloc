import * as geminiService from './geminiService';
import * as deepseekService from './deepseekService';

export type LLMProvider = 'gemini' | 'deepseek';

/**
 * Module 1: Formalizes a natural language logic problem into predicate logic.
 * @param problemText The natural language problem.
 * @param provider The LLM provider to use.
 * @returns A string containing predicate logic formulas.
 */
export async function formalizeProblem(problemText: string, provider: LLMProvider): Promise<string> {
  if (provider === 'gemini') {
    return geminiService.formalizeProblem(problemText);
  } else {
    return deepseekService.formalizeProblem(problemText);
  }
}

/**
 * Module 2: Simulates a resolution proof based on formalized predicates.
 * @param formalFormulas The predicate logic formulas from Module 1.
 * @param provider The LLM provider to use.
 * @returns A string representing the steps of the proof.
 */
export async function generateProof(formalFormulas: string, provider: LLMProvider): Promise<string> {
  if (provider === 'gemini') {
    return geminiService.generateProof(formalFormulas);
  } else {
    return deepseekService.generateProof(formalFormulas);
  }
}

/**
 * Module 3: Explains a formal proof in natural language.
 * @param proofText The formal proof steps from Module 2.
 * @param provider The LLM provider to use.
 * @returns A natural language explanation of the proof.
 */
export async function explainProof(proofText: string, provider: LLMProvider): Promise<string> {
  if (provider === 'gemini') {
    return geminiService.explainProof(proofText);
  } else {
    return deepseekService.explainProof(proofText);
  }
}
