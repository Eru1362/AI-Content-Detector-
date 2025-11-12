import React, { useState } from 'react';
import type { AnalysisResult } from '../types';
import { ClipboardIcon, SparklesIcon, WandIcon, CheckCircleIcon, Share2Icon } from './icons';
import { Tooltip } from './Tooltip';

const ScoreGauge: React.FC<{ score: number }> = ({ score }) => {
  const circumference = 2 * Math.PI * 55;
  const offset = circumference - (score / 100) * circumference;
  
  let strokeColor = 'stroke-green-500';
  if (score > 40) strokeColor = 'stroke-yellow-500';
  if (score > 70) strokeColor = 'stroke-red-500';

  let textColor = 'text-green-600 dark:text-green-400';
  if (score > 40) textColor = 'text-yellow-600 dark:text-yellow-400';
  if (score > 70) textColor = 'text-red-600 dark:text-red-400';

  return (
    <div className="relative w-32 h-32 flex-shrink-0">
      <svg className="w-full h-full" viewBox="0 0 120 120">
        <circle
          className="text-slate-200 dark:text-slate-700"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="55"
          cx="60"
          cy="60"
        />
        <circle
          className={`transform -rotate-90 origin-center transition-all duration-1000 ease-out ${strokeColor}`}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          stroke="currentColor"
          fill="transparent"
          r="55"
          cx="60"
          cy="60"
          strokeLinecap="round"
        />
      </svg>
      <div className={`absolute inset-0 flex flex-col items-center justify-center`}>
          <span className={`text-3xl font-bold ${textColor}`}>{score}%</span>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">AI Score</span>
      </div>
    </div>
  );
};


const MetricBar: React.FC<{ score: number }> = ({ score }) => {
    let bgColor = 'bg-green-500';
    if (score > 40) bgColor = 'bg-yellow-500';
    if (score > 70) bgColor = 'bg-red-500';

    return (
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
            <div className={`${bgColor} h-2.5 rounded-full`} style={{ width: `${score}%` }}></div>
        </div>
    );
};


interface AnalysisResultDisplayProps {
  isLoading: boolean;
  result: AnalysisResult | null;
  onAutoRephrase: () => void;
  onCustomRephrase: () => void;
}

export const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({ isLoading, result, onAutoRephrase, onCustomRephrase }) => {
  const [summaryCopied, setSummaryCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  if (isLoading) {
    return <AnalysisSkeleton />;
  }

  if (!result) {
    return null;
  }
  
  const { aiScore, summary, analysis } = result.data;

  const copySummaryToClipboard = () => {
    navigator.clipboard.writeText(summary);
    setSummaryCopied(true);
    setTimeout(() => setSummaryCopied(false), 2000);
  };

  const handleGetLink = () => {
    if (!result) return;
    try {
        const jsonString = JSON.stringify(result);
        const encodedData = btoa(jsonString);
        const url = `${window.location.origin}${window.location.pathname}?preview=${encodedData}`;
        navigator.clipboard.writeText(url);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2500);
    } catch (e) {
        console.error('Failed to create preview link', e);
    }
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700 space-y-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <ScoreGauge score={aiScore} />
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Analysis Complete</h3>
          <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
            <p className="text-slate-600 dark:text-slate-300 italic">"{summary}"</p>
            <Tooltip content={summaryCopied ? "Copied!" : "Copy Summary"}>
                <button onClick={copySummaryToClipboard} className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    {summaryCopied ? <CheckCircleIcon className="h-4 w-4 text-green-500" /> : <ClipboardIcon className="h-4 w-4 text-slate-500" />}
                </button>
            </Tooltip>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">Detailed Breakdown</h4>
        <div className="space-y-5">
            {analysis.map((item) => (
                <div key={item.metric}>
                    <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">{item.metric}</span>
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{item.score}% <span className="font-normal">AI-like</span></span>
                    </div>
                    <MetricBar score={item.score} />
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{item.finding}</p>
                </div>
            ))}
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 pt-6 space-y-4">
        <div className="text-center">
            <SparklesIcon className="h-8 w-8 mx-auto text-indigo-400 mb-2"/>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Refine Your Content</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Use our AI-powered tools to edit, rephrase, or change the tone of your text.</p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={onAutoRephrase} className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-6 py-2.5 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                <WandIcon className="h-5 w-5" />
                Auto-Rephrase
            </button>
            <button onClick={onCustomRephrase} className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-6 py-2.5 font-semibold text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200">
                <SparklesIcon className="h-5 w-5" />
                Rephrase with Prompt
            </button>
        </div>
      </div>
       <div className="border-t border-slate-200 dark:border-slate-700 pt-4 flex justify-center">
            <button onClick={handleGetLink} className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-4 py-2 font-semibold text-sm text-slate-600 dark:text-slate-300 bg-transparent rounded-md hover:bg-slate-200 dark:hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200">
                {linkCopied ? (
                    <>
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        Link Copied!
                    </>
                ) : (
                    <>
                        <Share2Icon className="h-5 w-5" />
                        Get Preview Link
                    </>
                )}
            </button>
        </div>
    </div>
  );
};


const AnalysisSkeleton: React.FC = () => (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700 space-y-6 animate-pulse">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-32 h-32 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
        <div className="flex-1 w-full">
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded-md mx-auto md:mx-0"></div>
          <div className="h-4 w-full md:w-5/6 mt-3 bg-slate-200 dark:bg-slate-700 rounded-md mx-auto md:mx-0"></div>
        </div>
      </div>
      
      <div>
        <div className="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded-md mb-4"></div>
        <div className="space-y-5">
            {[...Array(3)].map((_, i) => (
                <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                        <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5"></div>
                    <div className="h-4 w-full mt-2 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                    <div className="h-4 w-4/5 mt-1 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                </div>
            ))}
        </div>
      </div>
    </div>
);