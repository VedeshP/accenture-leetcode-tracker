import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { companies, type CompanyId, withBase } from './constants';
import { type Problem } from './types';
import { parseCSV } from './lib/parseCSV';
import useLocalStorage from './hooks/useLocalStorage';
import Header from './components/Header';
import ProblemTable from './components/ProblemTable';

type AppProps = {
    companyId: CompanyId;
};

const App: React.FC<AppProps> = ({ companyId }) => {
    const company = companies[companyId];
    const [problems, setProblems] = useState<Problem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    // Keep solved state isolated per company.
    const storageKey = `solvedProblemLinks:${companyId}`;
    const [solvedLinksArray, setSolvedLinksArray] = useLocalStorage<string[]>(storageKey, []);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setIsLoading(true);
            setLoadError(null);
            try {
                const res = await fetch(withBase(company.csvFile));
                if (!res.ok) {
                    throw new Error(`Failed to load CSV (${res.status})`);
                }
                const csv = await res.text();
                const parsedProblems = parseCSV(csv);
                if (!cancelled) setProblems(parsedProblems);
            } catch (error) {
                console.error("Failed to load/parse problems:", error);
                if (!cancelled) {
                    setProblems([]);
                    setLoadError('Could not load CSV data.');
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        void load();
        return () => {
            cancelled = true;
        };
    }, [companyId, company.csvFile]);

    // Memoize the Set to avoid re-creation on every render, strictly typed as Set<string>
    const solvedProblemLinks = useMemo(() => {
        // Extra safety: ensure solvedLinksArray is actually an array before creating Set
        const safeArray = Array.isArray(solvedLinksArray) ? solvedLinksArray : [];
        return new Set<string>(safeArray);
    }, [solvedLinksArray]);

    const handleToggleSolved = useCallback((link: string) => {
        // Ensure we are working with a valid array
        const currentLinks = Array.isArray(solvedLinksArray) ? solvedLinksArray : [];
        const newSolvedLinks = new Set<string>(currentLinks);
        
        if (newSolvedLinks.has(link)) {
            newSolvedLinks.delete(link);
        } else {
            newSolvedLinks.add(link);
        }
        setSolvedLinksArray(Array.from(newSolvedLinks));
    }, [solvedLinksArray, setSolvedLinksArray]);

    const solvedCount = solvedProblemLinks.size;
    const totalCount = problems.length;
    const progress = totalCount > 0 ? (solvedCount / totalCount) * 100 : 0;

    return (
        <div className="min-h-screen bg-gray-950 text-gray-200 font-sans selection:bg-brand-blue selection:text-white">
            <main className="container mx-auto px-4 py-8 max-w-5xl">
                <Header companyId={companyId} />

                {/* Dashboard Stats - Brutalist Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    
                    {/* Status Card */}
                    <div className="bg-gray-900 border-2 border-gray-800 rounded-xl p-6 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-gray-500 font-mono text-xs uppercase tracking-widest mb-1">Solved Count</h2>
                                <div className="text-4xl font-black text-white">
                                    {solvedCount} <span className="text-gray-600 text-2xl font-normal">/ {totalCount}</span>
                                </div>
                            </div>
                            <div className="bg-brand-blue/10 p-2 rounded-sm border border-brand-blue/20">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-brand-blue">
                                    <path strokeLinecap="square" strokeLinejoin="miter" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Progress Card */}
                    <div className="bg-gray-900 border-2 border-gray-800 rounded-xl p-6 flex flex-col justify-between group">
                        <div className="flex justify-between items-end mb-4">
                            <h2 className="text-gray-500 font-mono text-xs uppercase tracking-widest">Progress</h2>
                            <div className="text-2xl font-bold text-white">
                                {progress.toFixed(0)}<span className="text-brand-blue">%</span>
                            </div>
                        </div>
                        
                        {/* Brutalist Linear Progress Bar with Gradient & Glow */}
                        <div className="w-full bg-gray-950 h-5 border-2 border-gray-800 p-[2px] rounded-sm">
                            <div 
                                className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-700 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {!isLoading && loadError && (
                    <div className="rounded-xl border-2 border-rose-900/40 bg-rose-950/10 p-8 text-center">
                        <div className="text-rose-200 font-mono text-sm mb-2">[DATA_LOAD_ERROR]</div>
                        <div className="text-rose-300/80 text-xs font-mono">{loadError}</div>
                    </div>
                )}

                {isLoading ? (
                    <div className="rounded-xl border-2 border-dashed border-gray-800 p-12 text-center text-gray-500 font-mono animate-pulse">
                        INITIALIZING_DATA_STREAM...
                    </div>
                ) : problems.length > 0 ? (
                    <ProblemTable
                        problems={problems}
                        solvedProblemLinks={solvedProblemLinks}
                        onToggleSolved={handleToggleSolved}
                    />
                ) : (
                    <div className="rounded-xl border-2 border-dashed border-gray-800 p-12 text-center text-gray-500 font-mono animate-pulse">
                        INITIALIZING_DATA_STREAM...
                    </div>
                )}
                
                <footer className="mt-16 text-center text-gray-400 text-xs font-mono uppercase tracking-widest">
                    System Version 1.1.0 <br /> {company.name}_Prep <br /> Developed by <a href='https://github.com/VedeshP' className='bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 text-transparent bg-clip-text' target='_blank'>VedeshP</a> <br/>
                    UPDATES COMING SOON... STAY TUNED
                </footer>
            </main>
        </div>
    );
};

export default App;
