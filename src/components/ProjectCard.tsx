
import Link from "next/link";
import { Star, Clock, GitFork, AlertCircle } from "lucide-react";
import { Repository } from "@/lib/github";
import { cn, formatRelativeTime } from "@/lib/utils";

interface ProjectCardProps {
    repo: Repository;
}

export default function ProjectCard({ repo }: ProjectCardProps) {
    // Take top 3 topics
    const tags = repo.topics.slice(0, 3);

    return (
        <Link
            href={repo.html_url}
            target="_blank"
            className="group block h-full"
        >
            <div className={cn(
                "h-full p-6 rounded-xl border border-white/5 bg-[#11121d] hover:bg-[#151622]",
                "transition-all duration-300 ease-out transform",
                "hover:scale-[1.02] hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10",
                "flex flex-col justify-between relative overflow-hidden"
            )}>
                {/* Hover Glow Effect */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-indigo-500/10 blur-3xl group-hover:bg-indigo-500/20 transition-all duration-500" />

                <div>
                    <div className="flex items-start justify-between mb-3 relative z-10">
                        <div className="flex items-center gap-3">
                            {repo.owner.avatar_url && (
                                <img src={repo.owner.avatar_url} alt={repo.owner.login} className="w-6 h-6 rounded-full border border-white/10" />
                            )}
                            <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                                {repo.name}
                            </h3>
                        </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-6 line-clamp-2 h-10">
                        {repo.description || "No description available for this repository."}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className={cn(
                                    "px-2.5 py-0.5 text-[10px] font-medium rounded-full uppercase tracking-wide",
                                    "bg-white/5 text-gray-400 border border-white/5",
                                    "group-hover:border-indigo-500/20 group-hover:bg-indigo-500/10 group-hover:text-indigo-300 transition-colors"
                                )}
                            >
                                {tag}
                            </span>
                        ))}
                        {repo.language && (
                            <span className="px-2.5 py-0.5 text-[10px] font-medium rounded-full uppercase tracking-wide bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                {repo.language}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between text-gray-500 text-xs font-medium border-t border-white/5 pt-4 mt-auto">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-yellow-500/90" title="Stars">
                            <Star className="w-3.5 h-3.5 fill-yellow-500/20" />
                            <span>{repo.stargazers_count.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5 hover:text-white transition-colors" title="Forks">
                            <GitFork className="w-3.5 h-3.5" />
                            <span>{repo.forks_count.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span suppressHydrationWarning>{formatRelativeTime(repo.updated_at || repo.pushed_at)}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
