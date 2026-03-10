"use client";

import { useState } from "react";
import { Flag, X, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function ReportModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [reason, setReason] = useState("");

    const reasons = [
        "Broken Prompt / Doesn't work",
        "Low Quality Result",
        "Inappropriate Content",
        "Incorrect Category/Tool",
        "Other"
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason) return;

        // Mock submission
        setTimeout(() => {
            setIsSubmitted(true);
            setTimeout(() => {
                setIsOpen(false);
                setIsSubmitted(false);
                setReason("");
            }, 2000);
        }, 500);
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

                    <div className="relative bg-card border border-border w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <h3 className="text-xl font-bold flex items-center space-x-2">
                                <AlertTriangle className="text-orange-500" size={20} />
                                <span>Report Prompt</span>
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            {isSubmitted ? (
                                <div className="py-8 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                    <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Report Submitted</h4>
                                        <p className="text-muted-foreground text-sm">Thank you for helping us maintain prompt quality.</p>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-3">
                                        <p className="text-sm font-medium text-muted-foreground">Why are you reporting this prompt?</p>
                                        <div className="grid grid-cols-1 gap-2">
                                            {reasons.map((r) => (
                                                <label
                                                    key={r}
                                                    className={`flex items-center space-x-3 p-3 rounded-xl border transition-all cursor-pointer ${reason === r ? "bg-primary/5 border-primary text-primary" : "hover:bg-muted border-transparent"
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="reason"
                                                        value={r}
                                                        className="hidden"
                                                        onChange={(e) => setReason(e.target.value)}
                                                    />
                                                    <span className="text-sm font-bold">{r}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold">Additional Details (Optional)</label>
                                        <textarea
                                            placeholder="Tell us more about the issue..."
                                            className="w-full bg-muted/30 border border-border rounded-xl p-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!reason}
                                        className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98]"
                                    >
                                        Submit Report
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
