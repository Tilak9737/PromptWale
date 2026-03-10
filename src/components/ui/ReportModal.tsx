"use client";

import { useState } from "react";
import { Flag, X, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { submitReport } from "@/actions/report";

export default function ReportModal({ promptId }: { promptId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reason, setReason] = useState("");
    const [error, setError] = useState<string | null>(null);

    const reasons = [
        "Broken Prompt / Doesn't work",
        "Low Quality Result",
        "Inappropriate Content",
        "Incorrect Category/Tool",
        "Other"
    ];

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!reason || isSubmitting) return;

        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        formData.append("promptId", promptId);

        const result = await submitReport(formData);

        if (result.success) {
            setIsSubmitted(true);
            setTimeout(() => {
                setIsOpen(false);
                setIsSubmitted(false);
                setReason("");
            }, 3000);
        } else {
            setError(result.error || "Failed to submit report");
        }
        setIsSubmitting(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center space-x-2 text-xs text-muted-foreground hover:text-destructive transition-colors mt-6"
            >
                <Flag size={14} />
                <span>Report an issue</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="report-modal-title">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300" onClick={() => setIsOpen(false)} />

                    <div className="relative bg-card border border-border w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
                        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-muted/20">
                            <h3 id="report-modal-title" className="text-xl font-bold flex items-center space-x-2">
                                <AlertTriangle className="text-orange-500" size={20} />
                                <span>Report an Issue</span>
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-muted rounded-full transition-colors active:scale-95"
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            {isSubmitted ? (
                                <div className="py-10 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
                                    <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-2xl tracking-tight">Report Received</h4>
                                        <p className="text-muted-foreground text-sm max-w-[250px] mx-auto">
                                            Thank you for keeping PromptWale clean and high quality.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Reason for reporting</p>
                                        <div className="grid grid-cols-1 gap-2.5">
                                            {reasons.map((r) => (
                                                <label
                                                    key={r}
                                                    className={`group relative flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${reason === r
                                                        ? "bg-primary/5 border-primary text-primary shadow-sm"
                                                        : "bg-muted/30 border-transparent hover:border-border hover:bg-muted/50"
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="reason"
                                                        value={r}
                                                        className="sr-only"
                                                        onChange={(e) => setReason(e.target.value)}
                                                    />
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${reason === r ? "border-primary" : "border-muted-foreground/30"
                                                        }`}>
                                                        {reason === r && <div className="w-2.5 h-2.5 bg-primary rounded-full animate-in zoom-in-50 duration-200" />}
                                                    </div>
                                                    <span className="text-sm font-bold tracking-tight">{r}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-bold block">Additional Details (Optional)</label>
                                        <textarea
                                            name="details"
                                            placeholder="Tell us more about the issue..."
                                            className="w-full bg-muted/30 border-2 border-transparent rounded-2xl p-4 text-sm min-h-[120px] focus:outline-none focus:border-primary/30 focus:bg-background transition-all resize-none"
                                        />
                                    </div>

                                    {error && (
                                        <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl flex items-center space-x-2">
                                            <AlertTriangle size={16} />
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={!reason || isSubmitting}
                                        className="w-full py-4 bg-primary text-primary-foreground font-black text-lg rounded-2xl shadow-xl shadow-primary/20 disabled:opacity-50 disabled:shadow-none hover:shadow-primary/30 hover:-translate-y-0.5 transition-all active:scale-[0.98] flex items-center justify-center"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="animate-spin" size={24} />
                                        ) : (
                                            "Submit Report"
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
