import React from 'react';
import { ClockIcon, XIcon } from './icons';
import { Tooltip } from './Tooltip';

interface HistoryProps {
  history: string[];
  onSelectItem: (item: string) => void;
  onClearHistory: () => void;
}

export const History: React.FC<HistoryProps> = ({ history, onSelectItem, onClearHistory }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <ClockIcon className="h-5 w-5 text-indigo-500" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Analysis History</h3>
        </div>
        {history.length > 0 && (
          <Tooltip content="Clear History">
            <button
              onClick={onClearHistory}
              className="p-1.5 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:focus:ring-offset-slate-800"
              aria-label="Clear history"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </Tooltip>
        )}
      </div>
      {history.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
          Your analyzed content will appear here.
        </p>
      ) : (
        <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {history.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => onSelectItem(item)}
                className="w-full text-left p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors duration-150"
              >
                <p className="text-sm text-slate-600 dark:text-slate-300 truncate">
                  {item}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
