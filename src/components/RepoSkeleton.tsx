
export default function RepoSkeleton() {
    return (
        <div className="bg-[#11121d] border border-white/5 rounded-2xl p-5 h-[200px] animate-pulse flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5" />
                        <div>
                            <div className="w-24 h-4 bg-white/5 rounded mb-2" />
                            <div className="w-20 h-3 bg-white/5 rounded" />
                        </div>
                    </div>
                </div>
                <div className="w-full h-12 bg-white/5 rounded-lg mb-4" />
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                <div className="flex gap-2">
                    <div className="w-16 h-5 bg-white/5 rounded-full" />
                    <div className="w-16 h-5 bg-white/5 rounded-full" />
                </div>
                <div className="w-8 h-4 bg-white/5 rounded" />
            </div>
        </div>
    );
}
