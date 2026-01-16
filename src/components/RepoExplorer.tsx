
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { TrendingUp, ArrowDownWideNarrow } from "lucide-react";
import { Repository, SortOption } from "@/lib/github";
import { categorizeProject, Category } from "@/lib/utils";
import ProjectCard from "@/components/ProjectCard";
import { cn } from "@/lib/utils";

interface RepoExplorerProps {
    initialRepos: Repository[];
}

const CATEGORIES: { label: string; value: string; category: Category | 'All' }[] = [
    { label: "All Trending", value: "all", category: "All" },
    { label: "Frontend", value: "frontend", category: "Frontend" },
    { label: "Backend", value: "backend", category: "Backend" },
    { label: "Web3", value: "blockchain", category: "Blockchain" },
    { label: "AI & ML", value: "ai", category: "AI & ML" },
];

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
    { label: "Most Stars", value: "stars" },
    { label: "Recently Updated", value: "updated" },
    { label: "Most Forked", value: "forks" },
    { label: "Help Wanted", value: "help-wanted-issues" },
];

export default function RepoExplorer({ initialRepos }: RepoExplorerProps) {
    const [activeCategoryValue, setActiveCategoryValue] = useState("all");
    const [activeSortValue, setActiveSortValue] = useState<SortOption>("stars");

    const filteredAndSortedRepos = useMemo(() => {
        let result = [...initialRepos];

        // 1. Filter by Category
        const targetCategory = CATEGORIES.find(c => c.value === activeCategoryValue)?.category;
        if (targetCategory && targetCategory !== 'All') {
            result = result.filter(repo => categorizeProject(repo.topics) === targetCategory);
        }

        // 2. Sort
        // Note: initialRepos might already be sorted by stars from API, but we re-sort here to handle user selection
        result.sort((a, b) => {
            switch (activeSortValue) {
                case "stars":
                    return b.stargazers_count - a.stargazers_count;
                case "forks":
                    return b.forks_count - a.forks_count;
                case "updated":
                    return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
                case "help-wanted-issues":
                    return b.open_issues_count - a.open_issues_count;
                default:
                    return 0;
            }
        });

        return result;
    }, [initialRepos, activeCategoryValue, activeSortValue]);

    const activeSortLabel = SORT_OPTIONS.find(s => s.value === activeSortValue)?.label;

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
                <div className="animate-in slide-in-from-left-4 duration-500">
                    <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 inline-block mb-3 tracking-tight">
                        Global Trends
                    </h2>
                    <p className="text-gray-400 text-lg">Explore the top open source projects making waves right now.</p>
                </div>

                <div className="flex items-center gap-3 animate-in slide-in-from-right-4 duration-500 delay-100">
                    {/* Sort Dropdown */}
                    <div className="relative group z-30">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#11121d] hover:bg-[#1a1b26] border border-white/10 rounded-xl text-sm transition-all shadow-lg hover:shadow-indigo-500/5">
                            <ArrowDownWideNarrow size={16} className="text-indigo-400" />
                            <span className="text-gray-400">Sort:</span>
                            <span className="text-white font-medium">{activeSortLabel}</span>
                        </button>

                        {/* Dropdown Menu */}
                        <div className="absolute right-0 top-full mt-2 w-48 bg-[#151622] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                            <div className="p-1">
                                {SORT_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setActiveSortValue(option.value)}
                                        className={cn(
                                            "flex w-full items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-left",
                                            activeSortValue === option.value
                                                ? "bg-indigo-500/10 text-indigo-300"
                                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        {activeSortValue === option.value && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <nav className="flex overflow-x-auto pb-4 md:pb-0 scrollbar-hide mb-8 border-b border-white/5 animate-in fade-in duration-700 delay-200">
                <div className="flex items-center gap-2">
                    {CATEGORIES.map((tab) => {
                        const isActive = activeCategoryValue === tab.value;
                        return (
                            <button
                                key={tab.value}
                                onClick={() => setActiveCategoryValue(tab.value)}
                                className={cn(
                                    "px-5 py-2.5 text-sm font-medium rounded-full transition-all whitespace-nowrap border",
                                    isActive
                                        ? "bg-white/10 text-white border-white/10 shadow-lg shadow-white/5"
                                        : "text-gray-500 border-transparent hover:text-white hover:bg-white/5"
                                )}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                {filteredAndSortedRepos.length > 0 ? (
                    filteredAndSortedRepos.map((repo) => (
                        <ProjectCard key={repo.id} repo={repo} />
                    ))
                ) : (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center text-gray-500 bg-[#11121d]/30 rounded-3xl border border-dashed border-white/5">
                        <TrendingUp className="w-16 h-16 text-indigo-500/20 mb-4" />
                        <h3 className="text-xl font-medium text-gray-300 mb-2">No projects found</h3>
                        <p className="text-gray-500 max-w-md">Try adjusting your filters or check back later for more trending repositories.</p>
                    </div>
                )}
            </div>
        </>
    );
}
