
import React, { useState } from 'react';
import { MessageCircleIcon, XIcon, LoaderIcon } from './icons';

interface CustomPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
  isRephrasing: boolean;
}

export const CustomPromptModal: React.FC<CustomPromptModalProps> = ({ isOpen, onClose, onSubmit, isRephrasing }) => {
  const [prompt, setPrompt] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Rephrase with Custom Instructions</h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:focus:ring-offset-slate-800"
            aria-label="Close modal"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <p className="text-slate-600 dark:text-slate-300">
              Enter instructions for how you'd like to rephrase the content. For example: "Make it sound more casual and friendly" or "Rewrite this for a professional audience".
            </p>
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Your Instructions
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Make it sound more academic..."
                className="w-full h-28 p-3 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 resize-y"
                disabled={isRephrasing}
                required
              />
            </div>
          </div>
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex justify-end">
            <button
              type="submit"
              disabled={isRephrasing || !prompt.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:dark:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isRephrasing ? (
                <>
                  <LoaderIcon className="animate-spin h-5 w-5" />
                  Rephrasing...
                </>
              ) : (
                <>
                  <MessageCircleIcon className="h-5 w-5" />
                  Rephrase Content
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
