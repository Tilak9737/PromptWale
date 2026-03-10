"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Filter, X } from "lucide-react";
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
                className={`flex items-center space-x-2 px-4 py-2 border border-border rounded-full hover:bg-muted transition-colors text-sm font-medium ${currentTool ? 'bg-primary/10 border-primary/30 text-primary' : ''}`}
            >
                <Filter size={16} />
                <span>{currentTool || "All Tools"}</span>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-xl z-50 p-2 overflow-hidden">
                        <button
                            onClick={() => handleToolSelect(null)}
                            className={`w-full text-left px-4 py-2 text-sm rounded-xl hover:bg-muted transition-colors ${!currentTool ? 'font-bold text-primary' : ''}`}
                        >
                            All Tools
                        </button>
                        {tools.map(tool => (
                            <button
                                key={tool}
                                onClick={() => handleToolSelect(tool)}
                                className={`w-full text-left px-4 py-2 text-sm rounded-xl hover:bg-muted transition-colors ${currentTool === tool ? 'font-bold text-primary' : ''}`}
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
