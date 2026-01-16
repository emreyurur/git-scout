
import { Octokit } from "octokit";
import { unstable_cache } from "next/cache";

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

// Helper for Timeout
const timeoutPromise = (ms: number) => {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error("GitHub API is experiencing high latency."));
        }, ms);
    });
};

// Internal fetcher to be wrapped by cache and timeout
async function fetchGlobalTrending(sort: SortOption, category: string): Promise<Repository[]> {
    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
    });

    console.log(`[GitHub API] Fetching trending. Category: ${category}, Sort: ${sort}`);

    // Server-Side Filtering
    if (category !== 'All' && category !== 'All Trending') {
        const queryMap: Record<string, string> = {
            'AI & ML': 'topic:machine-learning',
            'Blockchain': 'topic:blockchain',
            'Frontend': 'language:typescript',
            'Backend': 'language:go',
        };
        const topicQuery = queryMap[category] || 'stars:>1000';
        const q = `stars:>1000 ${topicQuery}`;

        console.log(`[GitHub API] Sending Specific Query: ${q}`);

        // Wrap request in timeout race (increased to 15s)
        const response: any = await Promise.race([
            octokit.rest.search.repos({
                q,
                sort: sort === 'created' ? 'updated' : sort,
                order: "desc",
                per_page: 50,
            }),
            timeoutPromise(15000)
        ]);

        console.log(`[GitHub API] Fetched specific: ${response.data.items.length} items`);
        return response.data.items.map(transformRepo);
    }

    // Parallel Fetch Strategy for "All"
    // Diversified Web3 Queries + Lower Thresholds for Volume
    const queries = [
        // Frontend (Volume) - Increased to 30
        `stars:>2000 language:typescript`,
        // Backend (Volume) - Increased to 30
        `stars:>2000 language:go`,
        // AI (Volume) - Increased to 30
        `stars:>1000 topic:machine-learning`,
        // Web3 Sub-Query A (EVM / Solidity) - Lowered to stars:>100
        `topic:solidity stars:>100 sort:updated`,
        // Web3 Sub-Query B (General Blockchain) - Lowered to stars:>100
        `topic:blockchain stars:>100 sort:updated`,
        // Web3 Sub-Query C (Smart Contracts / Alt L1s) - Lowered to stars:>50
        `topic:smart-contracts stars:>50 sort:updated`
    ];


    const results = await Promise.race([
        Promise.all(
            queries.map(q => {
                console.log(`[GitHub API] Sending Parallel Query: ${q}`);
                return octokit.rest.search.repos({
                    q,
                    // If 'sort:updated' is in q, it often overrides this, but we keep defaults safe
                    sort: q.includes('sort:updated') ? 'updated' : 'stars',
                    order: "desc",
                    per_page: 30, // Increased Volume!
                }).then(res => {
                    console.log(`[GitHub API] Success "${q}": ${res.data.items.length} items`);
                    return res.data.items;
                }).catch(err => {
                    console.error(`[GitHub API Error] Failed "${q}":`, err.message);
                    return [];
                });
            })
        ),
        timeoutPromise(15000)
    ]) as any[];

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

    // Final Sort by Stars (User usually expects this on home page)
    uniqueRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);
    console.log(`[GitHub API] Final unique items count: ${uniqueRepos.length}`);

    return uniqueRepos;
}

// Cached version of the global trending fetch
export const getGlobalTrendingRepos = unstable_cache(
    async (sort: SortOption = 'stars', category: string = 'All') => {
        return fetchGlobalTrending(sort, category);
    },
    ['global-trending-repos-v2'], // Cache bust key
    { revalidate: 3600 }
);

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
