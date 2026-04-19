import React from 'react';
import ReactMarkdown from 'react-markdown';
import { X, Sparkles } from 'lucide-react';

interface AIInsightsProps {
  analysis: string;
  onClose: () => void;
}

export default function AIInsights({ analysis, onClose }: AIInsightsProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-ink -m-8 p-8 mb-8 sticky top-[-32px] z-10">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-accent" />
          <h2 className="text-bg font-black tracking-tighter uppercase text-lg">System Insights</h2>
        </div>
        <button 
          onClick={onClose}
          className="text-bg/50 hover:text-bg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="prose prose-sm prose-invert max-w-none">
        <div className="markdown-body text-ink leading-relaxed">
          <ReactMarkdown>{analysis}</ReactMarkdown>
        </div>
      </div>

      <div className="pt-8 border-t border-line">
        <p className="text-[9px] uppercase tracking-widest opacity-40 mb-4">Re-evaluation recommended every 25 trades.</p>
        <button 
          onClick={onClose}
          className="w-full border border-line py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-ink hover:text-bg transition-all"
        >
          Acknowledge & Sync
        </button>
      </div>
    </div>
  );
}
