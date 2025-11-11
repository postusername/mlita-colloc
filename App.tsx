import React, { useState, useCallback } from 'react';
import { formalizeProblem, generateProof, explainProof, LLMProvider } from './services/llmService';
import InputForm from './components/InputForm';
import ResultCard from './components/ResultCard';
import { TranslateIcon, CogIcon, BookOpenIcon } from './components/icons';

type ModuleState = {
  title: string;
  content: string;
  icon: React.ComponentType<{ className?: string }>;
};

const App: React.FC = () => {
  const [problemText, setProblemText] = useState<string>("Сократ — человек. Все люди смертны. Докажи, что Сократ смертен.");
  const [llmProvider, setLlmProvider] = useState<LLMProvider>('gemini');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const initialModules: ModuleState[] = [
    {
      title: 'Модуль 1: LLM-формализатор',
      content: 'Здесь появятся формулы в логике предикатов...',
      icon: TranslateIcon,
    },
    {
      title: 'Модуль 2: Движок резолюций (Симуляция)',
      content: 'Здесь появится пошаговое доказательство...',
      icon: CogIcon,
    },
    {
      title: 'Модуль 3: LLM-объяснятор',
      content: 'Здесь появится объяснение доказательства на естественном языке...',
      icon: BookOpenIcon,
    },
  ];

  const [modules, setModules] = useState<ModuleState[]>(initialModules);

  const handleSolve = useCallback(async () => {
    if (!problemText.trim()) {
      setError('Пожалуйста, введите текст задачи.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setModules(initialModules.map(m => ({ ...m, content: '' })));

    try {
      // Module 1: Formalization
      const formalizationResult = await formalizeProblem(problemText, llmProvider);
      setModules(prev => [
        { ...prev[0], content: formalizationResult },
        ...prev.slice(1)
      ]);

      // Module 2: Resolution Engine (Now dynamic)
      const proofResult = await generateProof(formalizationResult, llmProvider);
      setModules(prev => [
        prev[0],
        { ...prev[1], content: proofResult },
        ...prev.slice(2)
      ]);

      // Module 3: Explanation
      const explanationResult = await explainProof(proofResult, llmProvider);
      setModules(prev => [
        prev[0],
        prev[1],
        { ...prev[2], content: explanationResult },
      ]);

    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'Произошла неизвестная ошибка.';
      setError(`Ошибка при обработке запроса: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [problemText, llmProvider]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            Нейро-символический решатель
          </h1>
          <p className="mt-2 text-slate-400 text-lg">
            Введите логическую задачу на естественном языке для анализа.
          </p>
        </header>

        <main className="w-full">
          <InputForm
            value={problemText}
            onChange={(e) => setProblemText(e.target.value)}
            onSubmit={handleSolve}
            isLoading={isLoading}
            llmProvider={llmProvider}
            onProviderChange={setLlmProvider}
          />
          
          {error && (
            <div className="mt-4 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 gap-6">
            {modules.map((mod, index) => (
              <ResultCard
                key={index}
                title={mod.title}
                icon={<mod.icon className="h-8 w-8 text-cyan-400" />}
                isLoading={isLoading && !mod.content}
              >
                <p className="text-slate-300 font-mono whitespace-pre-wrap">
                  {mod.content || (isLoading ? 'Обработка...' : initialModules[index].content)}
                </p>
              </ResultCard>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;