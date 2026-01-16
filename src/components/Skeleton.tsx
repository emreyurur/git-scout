import { cn } from "../lib/utils";

export default function ProjectCardSkeleton() {
    return (
        <div className="h-full p-6 rounded-xl border border-white/5 bg-[#11121d] flex flex-col justify-between animate-pulse">
            <div>
                <div className="h-7 w-3/4 bg-white/5 rounded mb-3" />
                <div className="space-y-2 mb-6">
                    <div className="h-4 w-full bg-white/5 rounded" />
                    <div className="h-4 w-5/6 bg-white/5 rounded" />
                </div>
                <div className="flex gap-2 mb-6">
                    <div className="h-6 w-16 bg-white/5 rounded-lg" />
                    <div className="h-6 w-20 bg-white/5 rounded-lg" />
                    <div className="h-6 w-14 bg-white/5 rounded-lg" />
                </div>
            </div>
            <div className="flex justify-between mt-auto">
                <div className="h-5 w-12 bg-white/5 rounded" />
                <div className="h-5 w-20 bg-white/5 rounded" />
            </div>
        </div>
    );
}
