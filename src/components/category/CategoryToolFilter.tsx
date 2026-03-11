"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
import { useState } from "react";

export default function CategoryToolFilter({ tools, currentTool }: { tools: string[], currentTool?: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);

    const handleToolSelect = (tool: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (!tool) {
            params.delete("tool");
        } else {
            params.set("tool", tool);
        }
        router.push(`${pathname}?${params.toString()}`);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`clay-soft flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${currentTool ? "border-primary/30 bg-primary/10 text-primary" : ""}`}
            >
                <Filter size={16} />
                <span>{currentTool || "All Tools"}</span>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="clay absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-2xl p-2">
                        <button
                            onClick={() => handleToolSelect(null)}
                            className={`w-full rounded-xl px-4 py-2 text-left text-sm transition-colors hover:bg-muted/45 ${!currentTool ? "font-bold text-primary" : ""}`}
                        >
                            All Tools
                        </button>
                        {tools.map(tool => (
                            <button
                                key={tool}
                                onClick={() => handleToolSelect(tool)}
                                className={`w-full rounded-xl px-4 py-2 text-left text-sm transition-colors hover:bg-muted/45 ${currentTool === tool ? "font-bold text-primary" : ""}`}
                            >
                                {tool}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
