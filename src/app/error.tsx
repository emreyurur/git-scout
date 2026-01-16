
"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
                <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
                Our scouts are taking a break due to high traffic.
            </h2>

            <p className="text-gray-400 mb-8 max-w-md">
                We will be back in service shortly. Please try again later.
            </p>

            <button
                onClick={() => reset()}
                className="flex items-center gap-2 px-6 py-3 bg-[#1ecc41] hover:bg-[#18a635] text-[#0a2e12] font-semibold rounded-xl transition-all shadow-lg hover:shadow-green-500/20"
            >
                <RotateCcw size={18} />
                Retry Connection
            </button>
        </div>
    );
}
