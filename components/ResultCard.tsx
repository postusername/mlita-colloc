import React from 'react';
import Loader from './Loader';

interface ResultCardProps {
  title: string;
  icon: React.ReactNode;
  isLoading: boolean;
  children: React.ReactNode;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, icon, isLoading, children }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex flex-col h-full shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-4 mb-4">
        {icon}
        <h2 className="text-lg font-semibold text-slate-200">{title}</h2>
      </div>
      <div className="flex-grow min-h-[100px] flex items-center justify-center">
        {isLoading ? <Loader /> : children}
      </div>
    </div>
  );
};

export default ResultCard;
