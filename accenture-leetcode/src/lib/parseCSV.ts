import { Difficulty, type Problem } from '../types';

export const parseCSV = (csv: string): Problem[] => {
  const lines = csv.trim().split(/\r?\n/);
  const problems: Problem[] = [];

  const splitCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        // Handle escaped double-quotes inside quoted field.
        if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        result.push(cur);
        cur = '';
      } else {
        cur += ch;
      }
    }

    result.push(cur);
    return result.map(s => s.trim());
  };

  // Start at 1 to skip the header row.
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = splitCSVLine(line);
    if (values.length < 5) {
      console.warn(`Skipping invalid line ${i}: ${line}`);
      continue;
    }

    const rawDiff = values[0].trim().toUpperCase();
    let difficulty: Difficulty;

    if (rawDiff === 'EASY') difficulty = Difficulty.Easy;
    else if (rawDiff === 'MEDIUM') difficulty = Difficulty.Medium;
    else if (rawDiff === 'HARD') difficulty = Difficulty.Hard;
    else {
      const normalized = rawDiff.charAt(0).toUpperCase() + rawDiff.slice(1).toLowerCase();
      if (Object.values(Difficulty).includes(normalized as Difficulty)) difficulty = normalized as Difficulty;
      else {
        console.warn(`Skipping line with invalid difficulty: ${values[0]}`);
        continue;
      }
    }

    const title = values[1].replace(/^"|"$/g, '');
    const frequency = parseFloat(values[2]);

    // Convert 0.537... -> 53.7.
    let acceptanceRate = parseFloat(values[3]);
    if (acceptanceRate <= 1) acceptanceRate = acceptanceRate * 100;

    const link = values[4].replace(/^"|"$/g, '');

    // Topics: everything after column 5.
    const topicsRaw = values.slice(5).join(',');
    const topics = topicsRaw
      .replace(/^"|"$/g, '')
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    problems.push({
      difficulty,
      title,
      frequency,
      acceptanceRate,
      link,
      topics,
    });
  }

  return problems;
};

