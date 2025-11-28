import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { accentureProblemsCSV } from './constants';
import { type Problem, Difficulty } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import Header from './components/Header';
import ProblemTable from './components/ProblemTable';

const parseCSV = (csv: string): Problem[] => {
    const lines = csv.trim().split('\n');
    const problems: Problem[] = [];
    
    // Starting from 1 to skip header row
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = line.split(',');

        // Safety check: Ensure we have enough columns (Diff, Title, Freq, Acc, Link, Topics...)
        if (values.length < 5) {
            console.warn(`Skipping invalid line ${i}: ${line}`);
            continue;
        }

        // 1. Handle Difficulty: Convert "MEDIUM" -> "Medium" to match Enum
        const rawDiff = values[0].trim().toUpperCase();
        let difficulty: Difficulty;
        
        if (rawDiff === 'EASY') difficulty = Difficulty.Easy;
        else if (rawDiff === 'MEDIUM') difficulty = Difficulty.Medium;
        else if (rawDiff === 'HARD') difficulty = Difficulty.Hard;
        else {
            // Fallback for Title Case or other variations
            const normalized = rawDiff.charAt(0).toUpperCase() + rawDiff.slice(1).toLowerCase();
            if (Object.values(Difficulty).includes(normalized as Difficulty)) {
                difficulty = normalized as Difficulty;
            } else {
                console.warn(`Skipping line with invalid difficulty: ${values[0]}`);
                continue;
            }
        }

        const title = values[1].replace(/^"|"$/g, '');
        const frequency = parseFloat(values[2]);
        
        // 2. Handle Acceptance Rate: Convert 0.537... -> 53.7
        let acceptanceRate = parseFloat(values[3]);
        if (acceptanceRate <= 1) {
            acceptanceRate = acceptanceRate * 100;
        }

        const link = values[4].replace(/^"|"$/g, '');
        
        // 3. Handle Topics: "Math, Brainteaser"
        // Re-join the rest of the array (in case topics were split by comma)
        const topicsRaw = values.slice(5).join(',');
        // Remove surrounding quotes and split by comma
        const topics = topicsRaw
            .replace(/^"|"$/g, '') // remove outer quotes
            .split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0);
        
        problems.push({
            difficulty,
            title,
            frequency,
            acceptanceRate,
            link,
            topics
        });
    }
    return problems;
};

const App: React.FC = () => {
    const [problems, setProblems] = useState<Problem[]>([]);
    // Initialize with empty array to prevent null issues
    const [solvedLinksArray, setSolvedLinksArray] = useLocalStorage<string[]>('solvedProblemLinks', []);

    useEffect(() => {
        try {
            const parsedProblems = parseCSV(accentureProblemsCSV);
            setProblems(parsedProblems);
        } catch (error) {
            console.error("Failed to parse problems:", error);
        }
    }, []);

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
                <Header />

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

                {problems.length > 0 ? (
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
                    System Version 1.0.3 <br /> Accenture_Prep <br /> Developed by <a href='https://github.com/VedeshP' className='bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 
text-transparent bg-clip-text
' target='_blank'>VedeshP</a> <br/>
                    SOME FIXES COMING SOON... STAY TUNED
                </footer>
            </main>
        </div>
    );
};

export default App;