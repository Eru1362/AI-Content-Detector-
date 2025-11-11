import React from 'react';
import { ScanIcon, LoaderIcon, ZapIcon, BrainCircuitIcon } from './icons';

interface ContentInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  wordCount: number;
  analysisMode: 'fast' | 'deep';
  onModeChange: (mode: 'fast' | 'deep') => void;
}

export const ContentInput: React.FC<ContentInputProps> = ({
  value,
  onChange,
  onAnalyze,
  isLoading,
  wordCount,
  analysisMode,
  onModeChange
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-slate-700">
      <textarea
        value={value}
        onChange={onChange}
        placeholder="Paste your content here to check for AI generation..."
        className="w-full h-80 p-3 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 resize-y text-base"
        disabled={isLoading}
      />
      <div className="flex flex-wrap items-center justify-between gap-y-3 mt-4">
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Word Count: {wordCount}
          </div>
          
          <div className="flex items-center gap-1 p-1 rounded-full bg-slate-100 dark:bg-slate-700">
            <button 
                onClick={() => onModeChange('fast')}
                className={`px-3 py-1 text-sm font-semibold rounded-full flex items-center gap-1.5 transition-colors ${
                    analysisMode === 'fast' 
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600/50'
                }`}
                aria-pressed={analysisMode === 'fast'}
            >
                <ZapIcon className="h-4 w-4" />
                Fast
            </button>
            <button
                onClick={() => onModeChange('deep')}
                className={`px-3 py-1 text-sm font-semibold rounded-full flex items-center gap-1.5 transition-colors ${
                    analysisMode === 'deep' 
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600/50'
                }`}
                aria-pressed={analysisMode === 'deep'}
            >
                <BrainCircuitIcon className="h-4 w-4" />
                Deep
            </button>
          </div>
        </div>

        <button
          onClick={onAnalyze}
          disabled={isLoading || !value}
          className="inline-flex items-center gap-2 px-6 py-2.5 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:dark:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? (
            <>
              <LoaderIcon className="animate-spin h-5 w-5" />
              Analyzing...
            </>
          ) : (
            <>
              <ScanIcon className="h-5 w-5" />
              Analyze Content
            </>
          )}
        </button>
      </div>
    </div>
  );
};