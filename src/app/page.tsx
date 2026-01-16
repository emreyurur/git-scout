
import { getGlobalTrendingRepos } from "@/lib/github";
import Header from "@/components/Header";
import RepoExplorer from "@/components/RepoExplorer";


export default async function Home() {
  // Fetch a large pool of trending repos (e.g. top 100) regardless of category
  // sorting by stars initially to get the "best" pool
  const repos = await getGlobalTrendingRepos("stars", "All");

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 lg:p-12 max-w-7xl mx-auto font-sans selection:bg-indigo-500/30">
      <Header />
      <RepoExplorer initialRepos={repos} />
    </main>
  );
}
