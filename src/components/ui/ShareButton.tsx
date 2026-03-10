"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";

export default function ShareButton() {
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleShare}
            className="p-4 bg-muted border border-border rounded-xl hover:bg-muted/80 transition-colors flex items-center justify-center"
            title="Share Prompt"
        >
            {copied ? <Check size={18} className="text-green-500" /> : <Share2 size={18} />}
        </button>
    );
}
