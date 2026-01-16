
import Link from "next/link";
import { Star, GitCommit, Activity, LayoutGrid, AlertCircle } from "lucide-react";
import { getUserRepositories } from "@/lib/github";
import { categorizeProject, Category } from "@/lib/utils";
import ProjectCard from "@/components/ProjectCard";
import ProjectCardSkeleton from "@/components/Skeleton";
import Header from "@/components/Header";
import { Suspense } from "react";
import { cn } from "@/lib/utils";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

// Types
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

// Tabs Configuration
const TABS: { label: string; value: string; category: Category | 'All' }[] = [
    { label: "All Projects", value: "all", category: "All" },
    { label: "Frontend", value: "frontend", category: "Frontend" },
    { label: "Backend", value: "backend", category: "Backend" },
    { label: "Web3 / Blockchain", value: "blockchain", category: "Blockchain" },
    { label: "AI & NLP", value: "ai", category: "AI & ML" },
];

export default async function MyProjectsPage(props: { searchParams: SearchParams }) {
    const session = await auth();

    if (!session?.user) {
        redirect("/");
    }

    const searchParams = await props.searchParams;
    const currentTab = (searchParams.category as string) || "all";

    // Safe cast for accessToken in session
    const accessToken = (session as any)?.accessToken;
    const repos = await getUserRepositories(accessToken);

    // Filter Logic
    const activeCategory = TABS.find(t => t.value === currentTab)?.category || "All";

    let filteredRepos = activeCategory === "All"
        ? repos
        : repos.filter(repo => categorizeProject(repo.topics) === activeCategory);

    if (activeCategory === "All") {
        filteredRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);
    }

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">

            <Header />

            <div className="flex flex-col mb-8">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 inline-block mb-2">
                    My Projects
                </h2>
                <p className="text-gray-400">Manage and showcase your personal repositories.</p>
            </div>

            {/* Filter Tabs */}
            <nav className="flex flex-wrap items-center gap-y-2 mb-8 border-b border-white/5 pb-1">
                {TABS.map((tab) => {
                    const isActive = currentTab === tab.value;
                    return (
                        <Link
                            key={tab.value}
                            href={`/my-projects?category=${tab.value}`}
                            scroll={false}
                            className={cn(
                                "px-6 py-3 text-sm font-medium transition-all relative",
                                isActive ? "text-white" : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                            {tab.label}
                            {isActive && (
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-full" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Projects Grid */}
            <Suspense fallback={<ProjectsLoadingGrid />}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRepos.length > 0 ? (
                        filteredRepos.map((repo) => (
                            <ProjectCard key={repo.id} repo={repo} />
                        ))
                    ) : (
                        <div className="col-span-full py-12 flex flex-col items-center justify-center text-center text-gray-500 bg-[#11121d]/50 rounded-2xl border border-dashed border-white/10">
                            <LayoutGrid className="w-12 h-12 mb-4 opacity-20" />
                            <h3 className="text-lg font-medium text-gray-400 mb-1">No projects found</h3>
                            <p className="text-sm">No repositories found in this category.</p>
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
