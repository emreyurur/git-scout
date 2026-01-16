
import Link from "next/link";
import { Heart, Globe } from "lucide-react";
import { getUserStarredRepos } from "@/lib/github";
import ProjectCard from "@/components/ProjectCard";
import ProjectCardSkeleton from "@/components/Skeleton";
import Header from "@/components/Header";
import { Suspense } from "react";
import { cn } from "@/lib/utils";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function FavoritesPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/");
    }

    // Safe cast for accessToken in session
    const accessToken = (session as any)?.accessToken;
    const repos = await getUserStarredRepos(accessToken);

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">

            <Header />

            <div className="flex flex-col mb-8">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-500 inline-block mb-2">
                    Favorites
                </h2>
                <p className="text-gray-400">Repositories you have starred on GitHub.</p>
            </div>

            {/* Projects Grid */}
            <Suspense fallback={<ProjectsLoadingGrid />}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {repos.length > 0 ? (
                        repos.map((repo) => (
                            <ProjectCard key={repo.id} repo={repo} />
                        ))
                    ) : (
                        <div className="col-span-full py-16 flex flex-col items-center justify-center text-center text-gray-500 bg-[#11121d]/50 rounded-2xl border border-dashed border-white/10">
                            <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center mb-4">
                                <Heart className="w-8 h-8 text-pink-500/50" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-400 mb-1">No favorites yet</h3>
                            <p className="text-sm max-w-sm mx-auto mb-6">Star some repositories on GitHub or Explore the Global Trends to find amazing projects.</p>
                            <Link href="/" className="px-6 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center gap-2">
                                <Globe size={16} />
                                Explore Trends
                            </Link>
                        </div>
                    )}
                </div>
            </Suspense>
        </main>
    );
}

function ProjectsLoadingGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <ProjectCardSkeleton key={i} />
            ))}
        </div>
    );
}
