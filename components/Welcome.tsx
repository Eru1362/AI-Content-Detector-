
import React from 'react';
import { BrainCircuitIcon, CheckCircleIcon, ScanIcon } from './icons';

export const Welcome: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700 text-center">
        <BrainCircuitIcon className="h-16 w-16 mx-auto text-indigo-400 mb-4"/>
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Ready to Analyze</h3>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        Paste your content into the text area on the left and click "Analyze Content" to generate a detailed report.
      </p>
      <div className="mt-6 space-y-3 text-left text-sm text-slate-600 dark:text-slate-300">
        <div className="flex items-start gap-3">
            <ScanIcon className="h-5 w-5 flex-shrink-0 text-indigo-500 mt-0.5" />
            <span>Our AI performs a multi-point inspection, checking for common AI writing patterns.</span>
        </div>
         <div className="flex items-start gap-3">
            <CheckCircleIcon className="h-5 w-5 flex-shrink-0 text-indigo-500 mt-0.5" />
            <span>Predicts how your content might be scored by popular third-party AI detection tools.</span>
        </div>
      </div>
    </div>
  );
};