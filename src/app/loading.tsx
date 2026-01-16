
import Header from "@/components/Header";
import ProjectCardSkeleton from "@/components/Skeleton";

export default function Loading() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 lg:p-12 max-w-7xl mx-auto font-sans">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 bg-[#11121d]/50 p-4 rounded-2xl border border-white/5">
                {/* Skeleton Header */}
                <div className="flex items-center gap-6 w-full">
                    <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
                    <div className="h-6 w-32 bg-white/5 rounded animate-pulse" />
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
                <div>
                    <div className="h-10 w-64 bg-white/10 rounded mb-3 animate-pulse" />
                    <div className="h-6 w-96 bg-white/5 rounded animate-pulse" />
                </div>
                <div className="h-10 w-40 bg-white/5 rounded-xl animate-pulse" />
            </div>

            <div className="flex gap-2 mb-8 overflow-hidden">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-10 w-32 bg-white/5 rounded-full animate-pulse" />
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                    <ProjectCardSkeleton key={i} />
                ))}
            </div>
        </main>
    );
}
