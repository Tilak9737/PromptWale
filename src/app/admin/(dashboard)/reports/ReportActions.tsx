"use client";

import { useState } from "react";
import { resolveReport, dismissReport } from "@/actions/admin";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function ReportActions({ id, status }: { id: string; status: string }) {
    const [isLoading, setIsLoading] = useState(false);

    if (status !== "pending") return null;

    const handleResolve = async () => {
        setIsLoading(true);
        const res = await resolveReport(id);
        if (res.success) {
            alert("Report marked as resolved.");
        } else {
            alert("Failed to resolve: " + res.error);
        }
        setIsLoading(false);
    };

    const handleDismiss = async () => {
        setIsLoading(true);
        const res = await dismissReport(id);
        if (res.success) {
            alert("Report dismissed.");
        } else {
            alert("Failed to dismiss: " + res.error);
        }
        setIsLoading(false);
    };

    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={handleResolve}
                disabled={isLoading}
                className="p-1.5 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors disabled:opacity-50"
                title="Resolve"
            >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
            </button>
            <button
                onClick={handleDismiss}
                disabled={isLoading}
                className="p-1.5 text-muted-foreground hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
                title="Dismiss"
            >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <XCircle size={18} />}
            </button>
        </div>
    );
}
