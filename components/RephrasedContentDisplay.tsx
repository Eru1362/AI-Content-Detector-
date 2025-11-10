import React from 'react';
import { RefreshCwIcon, WandIcon, XIcon } from './icons';

interface RephrasedContentDisplayProps {
  originalText: string;
  rephrasedText: string;
  onAccept: (newText: string) => void;
  onDiscard: () => void;
}

const wordCounter = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

export const RephrasedContentDisplay: React.FC<RephrasedContentDisplayProps> = ({ originalText, rephrasedText, onAccept, onDiscard }) => {

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
            <div className="flex justify-between items-center text-sm mb-2">
                <h4 className="font-semibold text-slate-600 dark:text-slate-300">Original Text</h4>
                <span className="text-slate-500 dark:text-slate-400">Words: {wordCounter(originalText)}</span>
            </div>
            <div className="text-sm text-slate-700 dark:text-slate-300 p-3 bg-slate-100 dark:bg-slate-900 rounded-md h-64 overflow-y-auto border border-slate-200 dark:border-slate-700 whitespace-pre-wrap">
                {originalText}
            </div>
        </div>
         <div>
            <div className="flex justify-between items-center text-sm mb-2">
                <h4 className="font-semibold text-slate-600 dark:text-slate-300">Suggested Rephrase</h4>
                <span className="text-slate-500 dark:text-slate-400">Words: {wordCounter(rephrasedText)}</span>
            </div>
            <div className="text-sm text-slate-700 dark:text-slate-300 p-3 bg-slate-100 dark:bg-slate-900 rounded-md h-64 overflow-y-auto border border-slate-200 dark:border-slate-700 whitespace-pre-wrap">
                {rephrasedText}
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
          onClick={() => onAccept(rephrasedText)}
          className="inline-flex items-center gap-2 px-4 py-2 font-semibold text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <RefreshCwIcon className="h-4 w-4" />
          Accept & Re-Analyze
        </button>
      </div>
    </div>
  );
};