
import { Suspense } from "react";
import Header from "@/components/Header";
import TrendingRepoList from "@/components/TrendingRepoList";
import RepoSkeleton from "@/components/RepoSkeleton";

export default async function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 lg:p-12 max-w-7xl mx-auto font-sans selection:bg-indigo-500/30">
      <Header />
      <Suspense fallback={
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 animate-pulse">
            <div>
              <div className="h-10 w-64 bg-white/5 rounded mb-3" />
              <div className="h-6 w-96 bg-white/5 rounded" />
            </div>
            <div className="h-10 w-32 bg-white/5 rounded-xl" />
          </div>

          <div className="flex gap-2 mb-8">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-10 w-24 bg-white/5 rounded-full" />)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <RepoSkeleton key={i} />
            ))}
          </div>
        </div>
      }>
        <TrendingRepoList />
      </Suspense>
    </main>
  );
}
