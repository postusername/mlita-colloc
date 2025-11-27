import React from 'react';
import Loader from './Loader';
import { LLMProvider } from '../services/llmService';

interface InputFormProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  llmProvider: LLMProvider;
  onProviderChange: (provider: LLMProvider) => void;
  resolutionEngine: 'neuro' | 'programmatic';
  onEngineChange: (engine: 'neuro' | 'programmatic') => void;
}

const InputForm: React.FC<InputFormProps> = ({ value, onChange, onSubmit, isLoading, llmProvider, onProviderChange, resolutionEngine, onEngineChange }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="llm-provider" className="block text-sm font-medium text-slate-300 mb-2">
            LLM API:
          </label>
          <select
            id="llm-provider"
            value={llmProvider}
            onChange={(e) => onProviderChange(e.target.value as LLMProvider)}
            disabled={isLoading}
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow duration-200 text-slate-200 disabled:bg-slate-700 disabled:cursor-not-allowed"
          >
            <option value="gemini">Gemini</option>
            <option value="deepseek">YandexGPT</option>
          </select>
        </div>
        <div className="flex-1">
            <label htmlFor="resolution-engine" className="block text-sm font-medium text-slate-300 mb-2">
                Модуль 2:
            </label>
            <select
                id="resolution-engine"
                value={resolutionEngine}
                onChange={(e) => onEngineChange(e.target.value as 'neuro' | 'programmatic')}
                disabled={isLoading}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow duration-200 text-slate-200 disabled:bg-slate-700 disabled:cursor-not-allowed"
            >
                <option value="neuro">Нейро</option>
                <option value="programmatic">Программный</option>
            </select>
        </div>
      </div>
      <textarea
        value={value}
        onChange={onChange}
        placeholder="Введите логическую задачу..."
        className="w-full h-32 p-4 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow duration-200 resize-none text-slate-200 placeholder-slate-500"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full sm:w-auto self-center px-8 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 disabled:bg-slate-700 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
      >
        {isLoading ? (
          <>
            <Loader className="h-5 w-5" />
            <span>Анализ...</span>
          </>
        ) : (
          'Решить задачу'
        )}
      </button>
    </form>
  );
};

export default InputForm;
