import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { ContentInput } from './components/ContentInput';
import { AnalysisResultDisplay } from './components/AnalysisResultDisplay';
import { ExternalAnalysisReport } from './components/ExternalAnalysisReport';
import { Welcome } from './components/Welcome';
import { CustomPromptModal } from './components/CustomPromptModal';
import { RephrasedContentDisplay } from './components/RephrasedContentDisplay';
import { History } from './components/History';
import { analyzeContent, rephraseContent } from './services/geminiService';
import type { AnalysisResult } from './types';
import { LoaderIcon, XIcon } from './components/icons';

const App: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [rephrasedContent, setRephrasedContent] = useState<string>('');
  const [originalContentForCompare, setOriginalContentForCompare] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRephrasing, setIsRephrasing] = useState<boolean>(false);
  const [rephraseStatus, setRephraseStatus] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [history, setHistory] = useState<string[]>(() => {
    try {
        const savedHistory = window.localStorage.getItem('analysisHistory');
        return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
        console.error("Could not load history from localStorage", error);
        return [];
    }
  });

  useEffect(() => {
    try {
        window.localStorage.setItem('analysisHistory', JSON.stringify(history));
    } catch (error) {
        console.error("Could not save history to localStorage", error);
    }
  }, [history]);

  const wordCount = useMemo(() => {
    if (!content.trim()) return 0;
    return content.trim().split(/\s+/).length;
  }, [content]);

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const handleAnalyze = useCallback(async () => {
    if (!content.trim()) return;
    setIsLoading(true);
    setAnalysisResult(null);
    setRephrasedContent('');
    setOriginalContentForCompare(null);
    setError(null);
    try {
      const result = await analyzeContent(content);
      setAnalysisResult(result);
      setHistory(prevHistory => {
          const newHistory = [content, ...prevHistory.filter(item => item !== content)];
          return newHistory.slice(0, 10); // Keep last 10 items
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [content]);

  const handleAutoRephrase = async () => {
    if (!content.trim()) return;

    setIsRephrasing(true);
    setError(null);
    setRephrasedContent('');
    setOriginalContentForCompare(content);

    let bestContent = content;
    let initialAnalysis = analysisResult;
    if (!initialAnalysis) {
        setRephraseStatus('Running initial analysis...');
        initialAnalysis = await analyzeContent(content);
        setAnalysisResult(initialAnalysis);
    }
    
    let bestScore = initialAnalysis.data.aiScore;
    
    const maxAttempts = 5;

    for (let i = 1; i <= maxAttempts; i++) {
        if (bestScore === 0) {
            setRephraseStatus(`Target of 0% AI score reached!`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            break;
        }

        setRephraseStatus(`Attempt ${i}/${maxAttempts}: Rephrasing content... (Best score: ${bestScore}%)`);
        
        try {
            const currentContentToRephrase = (i === 1 || bestContent === content) ? content : bestContent;
            const rephrased = await rephraseContent(currentContentToRephrase); // No custom prompt
            
            setRephraseStatus(`Attempt ${i}/${maxAttempts}: Analyzing new version...`);
            const newAnalysis = await analyzeContent(rephrased);
            const newScore = newAnalysis.data.aiScore;

            if (newScore < bestScore) {
                setRephraseStatus(`Improvement found! New best score: ${newScore}%`);
                bestScore = newScore;
                bestContent = rephrased;
                await new Promise(resolve => setTimeout(resolve, 1500));
            } else {
                 setRephraseStatus(`Attempt ${i}/${maxAttempts}: No improvement found. Trying again...`);
                 await new Promise(resolve => setTimeout(resolve, 1500));
            }

        } catch (err) {
            const message = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(message);
            break;
        }
    }
    
    if (bestContent !== content) {
        setRephrasedContent(bestContent);
    } else {
        setRephraseStatus('Could not improve the score further.');
        await new Promise(resolve => setTimeout(resolve, 2000));
        setOriginalContentForCompare(null); // No changes to show
    }

    setIsRephrasing(false);
    setRephraseStatus(null);
  };

  const handleCustomRephrase = () => {
    setIsModalOpen(true);
  };

  const handleRephraseWithPrompt = async (prompt: string) => {
    if (!content.trim()) return;
    setIsRephrasing(true);
    setRephraseStatus('Generating new version with your instructions...');
    setError(null);
    setRephrasedContent('');
    setOriginalContentForCompare(content);

    try {
      const result = await rephraseContent(content, prompt);
      setRephrasedContent(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during rephrasing.');
    } finally {
      setIsRephrasing(false);
      setIsModalOpen(false);
      setRephraseStatus(null);
    }
  };
  
  const handleAcceptRephrase = (newText: string) => {
    setRephrasedContent('');
    setOriginalContentForCompare(null);
    setContent(newText);
    // Use timeout to allow state to update before triggering re-analysis
    setTimeout(() => {
        handleAnalyze();
    }, 100);
  };

  const handleDiscardRephrase = () => {
    setRephrasedContent('');
    setOriginalContentForCompare(null);
  };

  const handleSelectHistoryItem = (item: string) => {
    setContent(item);
  };
  
  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 flex items-center justify-between" role="alert">
            <div>
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
            <button onClick={() => setError(null)} className="p-1 rounded-full hover:bg-red-200">
                <XIcon className="h-5 w-5"/>
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-6">
            <ContentInput
              value={content}
              onChange={handleContentChange}
              onAnalyze={handleAnalyze}
              isLoading={isLoading || isRephrasing}
              wordCount={wordCount}
            />
            {isRephrasing && (
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700 space-y-4">
                    <div className="flex items-center gap-3">
                        <LoaderIcon className="animate-spin h-5 w-5 text-indigo-500" />
                        <h4 className="font-semibold text-slate-700 dark:text-slate-200">Rephrasing in Progress...</h4>
                    </div>
                    {rephraseStatus && <p className="text-sm text-slate-600 dark:text-slate-400 pl-8">{rephraseStatus}</p>}
                </div>
            )}
            
            {rephrasedContent && originalContentForCompare && !isRephrasing ? (
              <RephrasedContentDisplay 
                originalText={originalContentForCompare}
                rephrasedText={rephrasedContent}
                onAccept={handleAcceptRephrase}
                onDiscard={handleDiscardRephrase}
              />
            ) : !isRephrasing ? (
              <History history={history} onSelectItem={handleSelectHistoryItem} onClearHistory={handleClearHistory} />
            ) : null}
          </div>
          <div className="space-y-6">
            {!isLoading && !analysisResult ? (
              <Welcome />
            ) : (
              <>
                <AnalysisResultDisplay
                  isLoading={isLoading}
                  result={analysisResult}
                  onAutoRephrase={handleAutoRephrase}
                  onCustomRephrase={handleCustomRephrase}
                />
                <ExternalAnalysisReport isLoading={isLoading} result={analysisResult} />
              </>
            )}
          </div>
        </div>
      </main>
      <CustomPromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRephraseWithPrompt}
        isRephrasing={isRephrasing}
      />
    </div>
  );
};

export default App;