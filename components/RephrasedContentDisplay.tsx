import React from 'react';
import { RefreshCwIcon, WandIcon, XIcon } from './icons';
import type { AnalysisResult } from '../types';

interface AnalysisHeaderProps {
  title: string;
  analysis: AnalysisResult | null;
}

const AnalysisHeader: React.FC<AnalysisHeaderProps> = ({ title, analysis }) => {
    if (!analysis) {
        return (
            <div className="flex justify-between items-center text-sm mb-2 animate-pulse p-3 bg-slate-50 dark:bg-slate-900/50 rounded-t-md border-b border-slate-200 dark:border-slate-700">
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
            </div>
        );
    }

    const { aiScore, summary } = analysis.data;
    const wordCount = analysis.content.trim().split(/\s+/).filter(Boolean).length;
    
    let textColor = 'text-green-600 dark:text-green-400';
    if (aiScore > 40) textColor = 'text-yellow-600 dark:text-yellow-400';
    if (aiScore > 70) textColor = 'text-red-600 dark:text-red-400';

    return (
        <div className="text-sm mb-0 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-t-md border-b border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-1">
                <h4 className="font-semibold text-slate-700 dark:text-slate-200">{title}</h4>
                <div className="flex items-center gap-3">
                    <span className="text-slate-500 dark:text-slate-400 text-xs">Words: {wordCount}</span>
                    <div className="flex items-baseline gap-1">
                        <span className={`font-bold text-xl ${textColor}`}>{aiScore}</span>
                        <span className="font-semibold text-xs text-slate-500 dark:text-slate-400">% AI</span>
                    </div>
                </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">"{summary}"</p>
        </div>
    );
};


interface RephrasedContentDisplayProps {
  originalAnalysis: AnalysisResult;
  rephrasedAnalysis: AnalysisResult;
  onAccept: (newText: string) => void;
  onDiscard: () => void;
}

export const RephrasedContentDisplay: React.FC<RephrasedContentDisplayProps> = ({ originalAnalysis, rephrasedAnalysis, onAccept, onDiscard }) => {

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
            <WandIcon className="h-5 w-5 text-indigo-500" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Compare Changes</h3>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <AnalysisHeader title="Original Text" analysis={originalAnalysis} />
            <div className="text-sm text-slate-700 dark:text-slate-300 p-3 bg-slate-100 dark:bg-slate-900 rounded-b-md h-64 overflow-y-auto border border-t-0 border-slate-200 dark:border-slate-700 whitespace-pre-wrap">
                {originalAnalysis.content}
            </div>
        </div>
         <div>
            <AnalysisHeader title="Suggested Rephrase" analysis={rephrasedAnalysis} />
            <div className="text-sm text-slate-700 dark:text-slate-300 p-3 bg-slate-100 dark:bg-slate-900 rounded-b-md h-64 overflow-y-auto border border-t-0 border-slate-200 dark:border-slate-700 whitespace-pre-wrap">
                {rephrasedAnalysis.content}
            </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-3">
        <button
          onClick={onDiscard}
          className="inline-flex items-center gap-2 px-4 py-2 font-semibold text-sm text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200"
        >
          <XIcon className="h-4 w-4" />
          Discard
        </button>
        <button
          onClick={() => onAccept(rephrasedAnalysis.content)}
          className="inline-flex items-center gap-2 px-4 py-2 font-semibold text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <RefreshCwIcon className="h-4 w-4" />
          Accept & Use
        </button>
      </div>
    </div>
  );
};
