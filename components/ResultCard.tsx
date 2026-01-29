import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ResultCardProps {
  title: string;
  amount: string;
  rate?: string;
  icon: LucideIcon;
  colorClass: string;
  subText?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, amount, rate, icon: Icon, colorClass, subText }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-start space-x-4 transition-all hover:shadow-md">
      <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10 shrink-0`}>
        <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">{title}</h3>
        <div className="mt-1 flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-slate-900">{amount}</span>
          {rate && <span className="text-sm font-semibold text-slate-600">({rate})</span>}
        </div>
        {subText && <p className="mt-2 text-xs text-slate-400">{subText}</p>}
      </div>
    </div>
  );
};

export default ResultCard;