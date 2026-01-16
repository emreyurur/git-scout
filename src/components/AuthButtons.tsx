
"use client";

import { signIn, signOut } from "next-auth/react";
import { LogIn, LogOut, User } from "lucide-react";
import { clsx } from "clsx";

export function LoginButton() {
    return (
        <button
            onClick={() => signIn("github")}
            className={clsx(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md",
                "bg-white text-black hover:bg-gray-200 transition-colors"
            )}
        >
            <LogIn size={16} />
            <span>Login with GitHub</span>
        </button>
    );
}

export function UserMenu({ user }: { user: any }) {

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
                {user.image ? (
                    <img
                        src={user.image}
                        alt={user.name || "User"}
                        className="w-8 h-8 rounded-full border border-white/10"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <User size={16} />
                    </div>
                )}
                <div className="hidden md:block text-sm">
                    <div className="font-medium text-white">{user.name}</div>
                    <div className="text-xs text-gray-400">{user.email}</div>
                </div>
            </div>

            <button
                onClick={() => signOut()}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                title="Sign Out"
            >
                <LogOut size={18} />
            </button>
        </div>
    );
}
