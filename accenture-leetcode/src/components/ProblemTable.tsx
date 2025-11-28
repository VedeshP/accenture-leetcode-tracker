import React, { useState, useMemo } from 'react';
import type { Problem } from '../types';
import { Difficulty } from '../types';
import ProblemRow from './ProblemRow';

interface ProblemTableProps {
    problems: Problem[];
    solvedProblemLinks: Set<string>;
    onToggleSolved: (link: string) => void;
}

type SortKey = 'difficulty' | 'frequency' | 'acceptanceRate';
type SortDirection = 'asc' | 'desc';

const difficultyRank: Record<Difficulty, number> = {
    [Difficulty.Easy]: 1,
    [Difficulty.Medium]: 2,
    [Difficulty.Hard]: 3,
};

const ProblemTable: React.FC<ProblemTableProps> = ({ problems, solvedProblemLinks, onToggleSolved }) => {
    const [sortKey, setSortKey] = useState<SortKey>('frequency');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

    // Extract all unique tags from problems
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        problems.forEach(p => p.topics.forEach(t => tags.add(t)));
        return Array.from(tags).sort();
    }, [problems]);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            // Default directions: Difficulty -> Asc (Easy first), Numbers -> Desc (High first)
            if (key === 'difficulty') setSortDirection('asc');
            else setSortDirection('desc');
        }
    };

    const toggleTag = (tag: string) => {
        const newTags = new Set(selectedTags);
        if (newTags.has(tag)) newTags.delete(tag);
        else newTags.add(tag);
        setSelectedTags(newTags);
    };

    const sortedAndFilteredProblems = useMemo(() => {
        let result = [...problems];

        // Filter
        if (selectedTags.size > 0) {
            result = result.filter(p => p.topics.some(t => selectedTags.has(t)));
        }

        // Sort
        result.sort((a, b) => {
            let valA: number, valB: number;
            
            if (sortKey === 'difficulty') {
                valA = difficultyRank[a.difficulty];
                valB = difficultyRank[b.difficulty];
            } else if (sortKey === 'frequency') {
                valA = a.frequency;
                valB = b.frequency;
            } else {
                valA = a.acceptanceRate;
                valB = b.acceptanceRate;
            }

            if (valA === valB) return 0;
            
            const compare = valA < valB ? -1 : 1;
            return sortDirection === 'asc' ? compare : -compare;
        });

        return result;
    }, [problems, selectedTags, sortKey, sortDirection]);

    const SortIcon = ({ active, direction }: { active: boolean; direction: SortDirection }) => {
        if (!active) return <span className="ml-1 text-gray-800">↕</span>;
        return <span className="ml-1 text-brand-blue">{direction === 'asc' ? '↑' : '↓'}</span>;
    };

    return (
        <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-gray-900 border-2 border-gray-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                        Filter by Topic
                    </div>
                    {selectedTags.size > 0 && (
                        <button 
                            onClick={() => setSelectedTags(new Set())}
                            className="text-xs text-brand-blue hover:text-white transition-colors"
                        >
                            Clear All
                        </button>
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => {
                        const isSelected = selectedTags.has(tag);
                        return (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-wide rounded-md border transition-all duration-200
                                    ${isSelected 
                                        ? 'bg-brand-blue text-white border-brand-blue shadow-[0_0_10px_rgba(37,99,235,0.3)]' 
                                        : 'bg-gray-950 text-gray-400 border-gray-800 hover:border-gray-600 hover:text-gray-200'
                                    }`}
                            >
                                {tag}
                            </button>
                        );
                    })}
                    {allTags.length === 0 && <span className="text-gray-600 text-xs italic">No topics found</span>}
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border-2 border-gray-800 bg-gray-950 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead>
                            <tr className="bg-gray-900 border-b-2 border-gray-800">
                                <th className="p-4 w-12 border-r border-gray-800">
                                    {/* Checkbox placeholder */}
                                </th>
                                <th className="p-4 text-xs font-mono font-bold text-gray-500 uppercase tracking-wider">
                                    Problem Title
                                </th>
                                <th 
                                    className="p-4 text-xs font-mono font-bold text-gray-500 uppercase tracking-wider w-24 cursor-pointer hover:bg-gray-800 transition-colors select-none group"
                                    onClick={() => handleSort('difficulty')}
                                >
                                    <div className="flex items-center">
                                        Diff
                                        <SortIcon active={sortKey === 'difficulty'} direction={sortDirection} />
                                    </div>
                                </th>
                                <th 
                                    className="p-4 text-right text-xs font-mono font-bold text-gray-500 uppercase tracking-wider border-l border-gray-800 w-24 cursor-pointer hover:bg-gray-800 transition-colors select-none group"
                                    onClick={() => handleSort('frequency')}
                                >
                                    <div className="flex items-center justify-end">
                                        Freq
                                        <SortIcon active={sortKey === 'frequency'} direction={sortDirection} />
                                    </div>
                                </th>
                                <th 
                                    className="p-4 text-right text-xs font-mono font-bold text-gray-500 uppercase tracking-wider border-l border-gray-800 w-24 cursor-pointer hover:bg-gray-800 transition-colors select-none group"
                                    onClick={() => handleSort('acceptanceRate')}
                                >
                                    <div className="flex items-center justify-end">
                                        Acc
                                        <SortIcon active={sortKey === 'acceptanceRate'} direction={sortDirection} />
                                    </div>
                                </th>
                                <th className="p-4 text-xs font-mono font-bold text-gray-500 uppercase tracking-wider border-l border-gray-800 hidden md:table-cell">
                                    Tags
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {sortedAndFilteredProblems.map(problem => (
                                <ProblemRow
                                    key={problem.link}
                                    problem={problem}
                                    isSolved={solvedProblemLinks.has(problem.link)}
                                    onToggleSolved={onToggleSolved}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
                {sortedAndFilteredProblems.length === 0 && (
                    <div className="p-12 text-center border-t border-gray-800">
                        <div className="text-gray-500 font-mono text-sm mb-2">[NO_MATCHING_DATA]</div>
                        <button 
                            onClick={() => setSelectedTags(new Set())}
                            className="text-brand-blue text-xs hover:underline"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProblemTable;