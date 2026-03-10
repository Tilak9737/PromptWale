"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, LogIn, AlertCircle } from "lucide-react";
import { loginAdmin } from "@/actions/admin";

export default function AdminLoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const result = await loginAdmin(formData);

        if (result.success) {
            // Force hard refresh to ensure middleware caches the new token
            window.location.href = "/admin";
        } else {
            setError(result.error || "Authentication failed.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-card border border-border/50 rounded-2xl shadow-xl overflow-hidden shadow-primary/5">

                {/* Header */}
                <div className="bg-primary/5 p-8 text-center border-b border-border/50">
                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Admin Protocol</h1>
                    <p className="text-muted-foreground text-sm mt-2">Restricted Area. Authorized access only.</p>
                </div>

                {/* Form Body */}
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-3 text-red-500 text-sm font-medium">
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-muted-foreground mb-2">Identifier</label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Admin username"
                                    required
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-muted-foreground mb-2">Access Key</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter password..."
                                    required
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <span className="animate-pulse">Authenticating...</span>
                            ) : (
                                <>
                                    <LogIn size={18} />
                                    <span>Grant Access</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

            </div>
            <p className="mt-8 text-xs text-muted-foreground">© {new Date().getFullYear()} PromptWale System Dashboard</p>
        </div>
    );
}
