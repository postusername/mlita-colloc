import React from 'react';
import Loader from './Loader';

interface InputFormProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ value, onChange, onSubmit, isLoading }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
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
