
import { Octokit } from "octokit";

export interface Repository {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    language: string;
    topics: string[];
    updated_at: string;
    pushed_at: string;
    created_at: string;
    owner: {
        login: string;
        avatar_url: string;
    };
}

const DEFAULT_USER = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "leerob";

// Transform Octokit response to our Repository interface
function transformRepo(repo: any): Repository {
    return {
        id: repo.id,
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks || repo.forks_count || 0,
        open_issues_count: repo.open_issues_count || 0,
        language: repo.language || "Unknown",
        topics: repo.topics || [],
        updated_at: repo.updated_at,
        pushed_at: repo.pushed_at,
        created_at: repo.created_at,
        owner: {
            login: repo.owner?.login || "Unknown",
            avatar_url: repo.owner?.avatar_url || "",
        }
    };
}

export type SortOption = 'stars' | 'updated' | 'forks' | 'created' | 'help-wanted-issues';

// 1. Get Global Trending Repositories (Home Page)
export async function getGlobalTrendingRepos(
    sort: SortOption = 'stars',
    category: string = 'All'
): Promise<Repository[]> {
    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
    });

    console.log(`[GitHub API] Fetching trending. Category: ${category}, Sort: ${sort}`);

    // Server-Side Filtering (if specific category requested via props/url)
    if (category !== 'All' && category !== 'All Trending') {
        try {
            // Simplified Queries without complex OR logic to avoid API parsing errors
            const queryMap: Record<string, string> = {
                'AI & ML': 'topic:machine-learning',
                'Blockchain': 'topic:solidity',
                'Frontend': 'language:typescript',
                'Backend': 'language:go',
            };
            const topicQuery = queryMap[category] || 'stars:>1000';
            const q = `stars:>1000 ${topicQuery}`;

            console.log(`[GitHub API] Sending Specific Query: ${q}`);
            const response = await octokit.rest.search.repos({
                q,
                sort: sort === 'created' ? 'updated' : sort,
                order: "desc",
                per_page: 50,
            });
            console.log(`[GitHub API] Fetched specific: ${response.data.items.length} items`);
            return response.data.items.map(transformRepo);
        } catch (error: any) {
            console.error(`[GitHub API Error] Specific category ${category}:`, error.message);
            return [];
        }
    }

    // Parallel Fetch Strategy for "All"
    // Using simple, flat queries guaranteed to hit results.
    const queries = [
        // Frontend: High star TS projects are almost always frontend/fullstack
        `stars:>5000 language:typescript`,
        // Backend: Go is predominantly backend
        `stars:>5000 language:go`,
        // Web3: Solidity topic is the most accurate indicator
        `stars:>500 topic:solidity`,
        // AI: Machine Learning topic is the standard
        `stars:>1000 topic:machine-learning`
    ];

    try {
        const results = await Promise.all(
            queries.map(q => {
                console.log(`[GitHub API] Sending Parallel Query: ${q}`);
                return octokit.rest.search.repos({
                    q,
                    sort: 'stars',
                    order: 'desc',
                    per_page: 25, // 25 * 4 = 100 items raw
                }).then(res => {
                    console.log(`[GitHub API] Success "${q}": ${res.data.items.length} items`);
                    return res.data.items;
                }).catch(err => {
                    console.error(`[GitHub API Error] Failed "${q}":`, err.message);
                    return [];
                });
            })
        );

        // Flatten results
        const allRawRepos = results.flat();
        console.log(`[GitHub API] Total raw items fetched: ${allRawRepos.length}`);

        // Deduplicate by ID
        const seenIds = new Set<number>();
        const uniqueRepos: Repository[] = [];

        for (const repo of allRawRepos) {
            if (!seenIds.has(repo.id)) {
                seenIds.add(repo.id);
                uniqueRepos.push(transformRepo(repo));
            }
        }

        // Final Sort by Stars to mix the categories naturally
        uniqueRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);
        console.log(`[GitHub API] Final unique items count: ${uniqueRepos.length}`);

        return uniqueRepos;

    } catch (error: any) {
        console.error("[GitHub API Critical Error]", error.message);
        return [];
    }
}

// 2. Get Logged-in User's Repositories (My Projects)
export async function getUserRepositories(accessToken?: string): Promise<Repository[]> {
    const octokit = new Octokit({ auth: accessToken });
    try {
        let response;
        if (accessToken) {
            response = await octokit.rest.repos.listForAuthenticatedUser({
                sort: "updated",
                direction: "desc",
                per_page: 100,
                visibility: "all",
            });
        } else {
            // Fallback
            response = await octokit.rest.repos.listForUser({
                username: DEFAULT_USER,
                sort: "updated",
                direction: "desc",
                per_page: 100,
            });
        }
        return response.data.map(transformRepo);
    } catch (error) {
        console.error("Error fetching user repositories:", error);
        return [];
    }
}

// 3. Get User's Starred Repositories (Favorites & Notifications)
export async function getUserStarredRepos(accessToken: string): Promise<Repository[]> {
    if (!accessToken) return [];

    const octokit = new Octokit({ auth: accessToken });
    try {
        const response = await octokit.rest.activity.listReposStarredByAuthenticatedUser({
            sort: "created",
            direction: "desc",
            per_page: 100,
        });

        return response.data.map(transformRepo);
    } catch (error) {
        console.error("Error fetching starred repos:", error);
        return [];
    }
}
