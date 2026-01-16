
"use client";

import { useState } from "react";
import { Bell, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Repository } from "@/lib/github";
import { formatRelativeTime } from "@/lib/utils";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 4;

export default function NotificationBell({ updatedRepos }: { updatedRepos: Repository[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const hasNotifications = updatedRepos.length > 0;

    // Pagination Logic
    const totalPages = Math.ceil(updatedRepos.length / ITEMS_PER_PAGE);
    const paginatedRepos = updatedRepos.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(p => p + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(p => p - 1);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors relative"
            >
                <Bell size={20} />
                {hasNotifications && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#11121d]" />
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-[#151622] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
                        <div className="p-3 border-b border-white/5 bg-[#1a1b26]">
                            <h4 className="text-sm font-semibold text-white">Recent Updates</h4>
                            <p className="text-xs text-gray-500">Starred repos updated in last 24h</p>
                        </div>

                        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-slate-600">
                            {updatedRepos.length > 0 ? (
                                paginatedRepos.map(repo => (
                                    <Link
                                        key={repo.id}
                                        href={repo.html_url}
                                        target="_blank"
                                        className="block p-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-sm font-medium text-indigo-300 truncate w-3/4">
                                                {repo.owner.login}/{repo.name}
                                            </span>
                                            <ExternalLink size={12} className="text-gray-600" />
                                        </div>
                                        <div className="text-xs text-gray-400 mb-1 line-clamp-1">
                                            {repo.description}
                                        </div>
                                        <div className="text-[10px] text-gray-500 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                            <span suppressHydrationWarning>{formatRelativeTime(repo.pushed_at)}</span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500 text-sm">
                                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                    No recent updates
                                </div>
                            )}
                        </div>

                        {/* Pagination Footer */}
                        {updatedRepos.length > ITEMS_PER_PAGE && (
                            <div className="p-2 border-t border-white/5 bg-[#1a1b26] flex items-center justify-between">
                                <button
                                    onClick={prevPage}
                                    disabled={currentPage === 1}
                                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                >
                                    <ChevronLeft size={14} />
                                </button>

                                <span className="text-xs text-gray-500 font-medium">
                                    Page {currentPage} of {totalPages}
                                </span>

                                <button
                                    onClick={nextPage}
                                    disabled={currentPage === totalPages}
                                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                >
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
