import React from 'react';
import type { AnalysisResult } from '../types';
import type { ExternalPlatformAnalysis } from '../types';
import { InfoIcon } from './icons';
import { Tooltip } from './Tooltip';

const PlatformGauge: React.FC<{ score: number }> = ({ score }) => {
  const circumference = 2 * Math.PI * 25; // smaller radius
  const offset = circumference - (score / 100) * circumference;

  let strokeColor = 'stroke-green-500';
  if (score > 50) strokeColor = 'stroke-yellow-500';
  if (score > 75) strokeColor = 'stroke-red-500';
  
  let textColor = 'text-green-600 dark:text-green-400';
  if (score > 50) textColor = 'text-yellow-600 dark:text-yellow-400';
  if (score > 75) textColor = 'text-red-600 dark:text-red-400';

  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg className="w-full h-full" viewBox="0 0 60 60">
        <circle
          className="text-slate-200 dark:text-slate-700"
          strokeWidth="6"
          stroke="currentColor"
          fill="transparent"
          r="25"
          cx="30"
          cy="30"
        />
        <circle
          className={`transform -rotate-90 origin-center transition-all duration-1000 ease-out ${strokeColor}`}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          stroke="currentColor"
          fill="transparent"
          r="25"
          cx="30"
          cy="30"
          strokeLinecap="round"
        />
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center text-xl font-bold ${textColor}`}>
        ~{score}%
      </div>
    </div>
  );
};

const PlatformCard: React.FC<ExternalPlatformAnalysis> = ({ platformName, predictedScore, summary }) => (
  <div className="flex flex-col items-center text-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
    <h4 className="font-semibold text-slate-800 dark:text-slate-100">{platformName}</h4>
    <PlatformGauge score={predictedScore} />
    <p className="text-xs text-slate-600 dark:text-slate-300 italic">"{summary}"</p>
  </div>
);

const SkeletonLoader: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex flex-col items-center gap-3 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
        <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
        <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
        <div className="space-y-1 w-full">
            <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-md"></div>
            <div className="h-3 w-5/6 mx-auto bg-slate-200 dark:bg-slate-700 rounded-md"></div>
        </div>
      </div>
    ))}
  </div>
);

interface ExternalAnalysisReportProps {
  isLoading: boolean;
  result: AnalysisResult | null;
}

export const ExternalAnalysisReport: React.FC<ExternalAnalysisReportProps> = ({ isLoading, result }) => {
  if (!isLoading && !result?.data?.externalAnalysis) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Third-Party Detector Analysis
        </h3>
        <Tooltip content="These are estimations, not real-time scores. Our AI analyzes your text for patterns that these tools commonly detect. Actual results from their websites will vary, as their detection algorithms are proprietary and change over time.">
          <InfoIcon className="h-4 w-4 text-slate-400 dark:text-slate-500 cursor-help" />
        </Tooltip>
      </div>
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {result?.data?.externalAnalysis?.map(platform => (
            <PlatformCard key={platform.platformName} {...platform} />
          ))}
        </div>
      )}
    </div>
  );
};