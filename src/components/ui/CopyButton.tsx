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
            className="clay hover-lift flex flex-1 items-center justify-center space-x-2 rounded-xl py-4 font-bold text-primary"
        >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            <span>{copied ? "Copied!" : "Copy Prompt Setup"}</span>
        </button>
    );
}
