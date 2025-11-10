
import React from 'react';
import { ScanIcon, LoaderIcon } from './icons';

interface ContentInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  wordCount: number;
}

export const ContentInput: React.FC<ContentInputProps> = ({
  value,
  onChange,
  onAnalyze,
  isLoading,
  wordCount
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
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Word Count: {wordCount}
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
