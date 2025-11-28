import React from 'react';
import { type Problem, Difficulty } from '../types';

interface ProblemRowProps {
    problem: Problem;
    isSolved: boolean;
    onToggleSolved: (link: string) => void;
}

const difficultyConfig: Record<Difficulty, { color: string; border: string }> = {
    [Difficulty.Easy]: { color: 'text-emerald-400', border: 'border-emerald-400/30' },
    [Difficulty.Medium]: { color: 'text-amber-400', border: 'border-amber-400/30' },
    [Difficulty.Hard]: { color: 'text-rose-400', border: 'border-rose-400/30' },
};

const ExternalLinkIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 ml-1 opacity-50 group-hover:opacity-100">
        <path strokeLinecap="square" strokeLinejoin="miter" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
);

const ProblemRow: React.FC<ProblemRowProps> = ({ problem, isSolved, onToggleSolved }) => {
    const theme = difficultyConfig[problem.difficulty];

    return (
        <tr className={`group border-b border-gray-800 hover:bg-gray-900 transition-colors ${isSolved ? 'bg-gray-900/30' : ''}`}>
            {/* Checkbox - Sharp/Brutalist */}
            <td className="p-4 w-12 text-center align-middle border-r border-gray-800">
                <button
                    onClick={() => onToggleSolved(problem.link)}
                    className={`w-5 h-5 border-2 flex items-center justify-center transition-all duration-100
                        ${isSolved 
                            ? 'bg-brand-blue border-brand-blue' 
                            : 'bg-transparent border-gray-600 hover:border-white'}`}
                >
                    {isSolved && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-white">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
            </td>

            {/* Title - Sans Serif */}
            <td className="p-4 align-middle">
                <a
                    href={problem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center font-bold tracking-tight text-sm hover:text-brand-blue transition-colors
                        ${isSolved ? 'text-gray-500 line-through' : 'text-gray-200'}`}
                >
                    {problem.title}
                    <ExternalLinkIcon />
                </a>
            </td>

            {/* Difficulty - Sharp Badge */}
            <td className="p-4 align-middle w-24">
                <div className={`inline-block px-2 py-0.5 text-xs font-mono uppercase tracking-wider border ${theme.border} ${theme.color} bg-gray-900/50`}>
                    {problem.difficulty}
                </div>
            </td>

            {/* Stats - Monospace */}
            <td className="p-4 text-right font-mono text-xs text-gray-400 border-l border-gray-800 w-24">
                {problem.frequency.toFixed(1)}%
            </td>
            <td className="p-4 text-right font-mono text-xs text-gray-400 border-l border-gray-800 w-24">
                {problem.acceptanceRate.toFixed(1)}%
            </td>

            {/* Topics - Rounded Pills (The "Mix") */}
            <td className="p-4 align-middle border-l border-gray-800 hidden md:table-cell">
                <div className="flex flex-wrap gap-2">
                    {problem.topics.slice(0, 3).map(topic => (
                        <span key={topic} className="px-2 py-1 text-[10px] font-medium rounded-full text-gray-400 bg-gray-800 hover:bg-gray-700 hover:text-white transition-colors cursor-default">
                            {topic}
                        </span>
                    ))}
                    {problem.topics.length > 3 && (
                        <span className="px-2 py-1 text-[10px] rounded-full text-gray-500 bg-gray-900">
                            +{problem.topics.length - 3}
                        </span>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default ProblemRow;