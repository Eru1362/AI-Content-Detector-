import React from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <div className="relative group flex items-center">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs hidden group-hover:block bg-slate-800 dark:bg-slate-900 text-white text-xs rounded-md py-1.5 px-3 z-20 shadow-lg pointer-events-none transition-opacity duration-200 opacity-0 group-hover:opacity-100">
        {content}
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800 dark:border-t-slate-900"></div>
      </div>
    </div>
  );
};
