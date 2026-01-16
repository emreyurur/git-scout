
import Link from "next/link";
import Image from "next/image";
import { Globe, Heart, LayoutGrid } from "lucide-react";
import { auth } from "../auth";
import { LoginButton, UserMenu } from "./AuthButtons";
import { getUserStarredRepos } from "@/lib/github";
import NotificationBell from "./NotificationBell";

export default async function Header() {
    const session = await auth();

    // Notification Logic
    let updatedRepos: any[] = [];
    if (session?.user && (session as any).accessToken) {
        try {
            // Fetch user's starred repos to check for updates
            // Limit to 30 to check efficiently
            const starred = await getUserStarredRepos((session as any).accessToken);

            const oneDayAgo = new Date();
            oneDayAgo.setDate(oneDayAgo.getDate() - 1);

            updatedRepos = starred.filter(repo => {
                const pushedDate = new Date(repo.pushed_at);
                return pushedDate > oneDayAgo;
            });
        } catch (e) {
            console.error("Failed to fetch notifications", e);
        }
    }

    return (
        <header className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 bg-[#11121d]/80 backdrop-blur-xl p-4 rounded-2xl border border-white/5 sticky top-4 z-50 shadow-2xl shadow-black/20">
            <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-8 h-8 mr-2">
                        <Image
                            src="/logo.png"
                            alt="GitScout Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                            GitScout
                        </span>
                        <span className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">Developer Hub</span>
                    </div>
                </Link>

                {/* Navigation Dropdown / Links */}
                <nav className="hidden md:flex items-center gap-1 ml-4 border-l border-white/5 pl-4">
                    <Link href="/" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <Globe size={16} />
                        Explore
                    </Link>
                    {session?.user && (
                        <>
                            <Link href="/my-projects" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                <LayoutGrid size={16} />
                                My Projects
                            </Link>
                            <Link href="/favorites" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                <Heart size={16} />
                                Favorites
                            </Link>
                        </>
                    )}
                </nav>
            </div>

            <div className="flex items-center gap-4">
                {session?.user && <NotificationBell updatedRepos={updatedRepos} />}

                {/* Auth Section */}
                {session?.user ? (
                    <UserMenu user={session.user} />
                ) : (
                    <LoginButton />
                )}
            </div>
        </header>
    );
}
