import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export type Category = 'AI & ML' | 'Blockchain' | 'Frontend' | 'Backend' | 'All Projects' | 'All';

export function categorizeProject(topics: string[]): Category {
    if (!topics) return 'All Projects';
    const lowerTopics = topics.map((t) => t.toLowerCase());

    const categories: Record<string, string[]> = {
        'AI & ML': ['machine-learning', 'nlp', 'python', 'pytorch', 'tensorflow', 'openai', 'llm', 'deepseek', 'ai', 'transformers'],
        'Blockchain': ['solidity', 'sui', 'move', 'blockchain', 'web3', 'rust', 'smart-contracts', 'ethereum', 'crypto'],
        'Frontend': ['react', 'nextjs', 'typescript', 'tailwind', 'vue', 'svelte', 'css', 'javascript', 'ui'],
        'Backend': ['nodejs', 'express', 'database', 'docker', 'java', 'go', 'golang', 'sql', 'postgres', 'mongodb', 'kubernetes'],
    };

    for (const [category, keywords] of Object.entries(categories)) {
        if (lowerTopics.some((topic) => keywords.some((k) => topic.includes(k)))) {
            return category as Category;
        }
    }

    return 'All Projects';
}

export function formatRelativeTime(dateString: string): string {
    try {
        const date = parseISO(dateString);
        return `Updated ${formatDistanceToNow(date, { addSuffix: true })}`;
    } catch (error) {
        console.error("Date formatting error", error);
        return "Recently updated";
    }
}
