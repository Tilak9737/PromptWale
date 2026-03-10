import prisma from "@/lib/prisma";
import Link from "next/link";
import ReportActions from "./ReportActions";

export const metadata = {
    title: "Reports | Admin Dashboard"
};

export default async function ReportsPage() {
    const reports = await prisma.report.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            prompt: {
                select: { id: true, title: true, slug: true }
            }
        }
    });

    const pendingCount = reports.filter((r: { status: string }) => r.status === "pending").length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Reported Prompts</h1>
                    <p className="text-muted-foreground">Review alerts and feedback submitted by users.</p>
                </div>
                <div className="bg-destructive/10 text-destructive text-sm font-bold px-3 py-1 rounded-full border border-destructive/20">
                    {pendingCount} Pending
                </div>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border/50 text-sm">
                                <th className="p-4 font-bold">Reason</th>
                                <th className="p-4 font-bold">Details</th>
                                <th className="p-4 font-bold">Prompt</th>
                                <th className="p-4 font-bold">Date</th>
                                <th className="p-4 font-bold">Status</th>
                                <th className="p-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                        No reports found. Great job!
                                    </td>
                                </tr>
                            ) : (
                                reports.map((report: { id: string; reason: string; details: string | null; createdAt: Date; status: string; prompt: { id: string; title: string; slug: string } | null }) => (
                                    <tr key={report.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                                        <td className="p-4 font-medium">{report.reason}</td>
                                        <td className="p-4 text-sm max-w-xs truncate" title={report.details || "No details provided"}>
                                            {report.details || <span className="text-muted-foreground italic">None</span>}
                                        </td>
                                        <td className="p-4">
                                            {report.prompt ? (
                                                <Link href={`/admin/prompts/${report.prompt.id}/edit`} className="text-sm font-bold text-primary hover:underline truncate inline-block max-w-[150px]">
                                                    {report.prompt.title}
                                                </Link>
                                            ) : (
                                                <span className="text-sm text-muted-foreground line-through">Deleted Prompt</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground">
                                            {new Date(report.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-md ${report.status === "pending" ? "bg-amber-500/10 text-amber-500" :
                                                report.status === "resolved" ? "bg-green-500/10 text-green-500" :
                                                    "bg-muted text-muted-foreground"
                                                }`}>
                                                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end pr-2">
                                                <ReportActions id={report.id} status={report.status} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
