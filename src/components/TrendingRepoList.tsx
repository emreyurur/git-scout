
import { getGlobalTrendingRepos } from "@/lib/github";
import RepoExplorer from "@/components/RepoExplorer";

export default async function TrendingRepoList() {
    const repos = await getGlobalTrendingRepos("stars", "All");
    return <RepoExplorer initialRepos={repos} />;
}
