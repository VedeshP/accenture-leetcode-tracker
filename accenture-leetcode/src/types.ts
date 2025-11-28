export enum Difficulty {
    Easy = 'Easy',
    Medium = 'Medium',
    Hard = 'Hard'
}

export interface Problem {
    difficulty: Difficulty;
    title: string;
    frequency: number;
    acceptanceRate: number;
    link: string;
    topics: string[];
}