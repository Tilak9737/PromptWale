"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { trackPromptCopy } from "@/actions/prompt";

export default function CopyButton({ promptId, promptText }: { promptId: string, promptText: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(promptText);
            setCopied(true);

            // Fire and forget server action to track analytics
            trackPromptCopy(promptId);

            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="flex-1 py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center space-x-2"
        >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            <span>{copied ? "Copied!" : "Copy Prompt Setup"}</span>
        </button>
    );
}
