import { getAuditLogs } from "@/actions/admin";
import { format } from "date-fns";
import { History, User, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function AdminLogsPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string }>
}) {
    const { page } = await searchParams;
    const currentPage = parseInt(page || "1");
    const { logs, total, totalPages } = await getAuditLogs(currentPage);

    const getActionColor = (action: string) => {
        if (action.includes("DELETE")) return "text-red-500 bg-red-500/10 border-red-500/20";
        if (action.includes("CREATE")) return "text-green-500 bg-green-500/10 border-green-500/20";
        if (action.includes("UPDATE")) return "text-blue-500 bg-blue-500/10 border-blue-500/20";
        if (action.includes("PASSWORD")) return "text-orange-500 bg-orange-500/10 border-orange-500/20";
        return "text-muted-foreground bg-muted border-border";
    };

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
                        <History size={32} className="text-primary" />
                        Admin Audit Logs
                    </h1>
                    <p className="text-muted-foreground">Trace all administrative actions and security events.</p>
                </div>
                <div className="px-4 py-2 bg-muted/50 border border-border rounded-xl text-sm font-medium">
                    Total Events: <span className="font-bold text-foreground">{total}</span>
                </div>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/30 border-b border-border/50 text-sm">
                            <tr>
                                <th className="px-6 py-4 font-bold text-muted-foreground">Timestamp</th>
                                <th className="px-6 py-4 font-bold text-muted-foreground">Admin</th>
                                <th className="px-6 py-4 font-bold text-muted-foreground">Action</th>
                                <th className="px-6 py-4 font-bold text-muted-foreground">Details</th>
                                <th className="px-6 py-4 font-bold text-muted-foreground">Target</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 bg-card">
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground font-medium">
                                        No audit logs found. Actions will appear here as they occur.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-muted/10 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock size={14} className="text-muted-foreground" />
                                                <span className="font-medium">{format(new Date(log.createdAt), "MMM d, HH:mm:ss")}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                                    <User size={12} className="text-primary" />
                                                </div>
                                                <span className="font-bold text-sm">{log.admin}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getActionColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-foreground max-w-md truncate" title={log.details || ""}>
                                                {log.details || "—"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {log.targetId ? (
                                                <code className="px-2 py-1 bg-muted rounded text-[10px] text-muted-foreground font-mono">
                                                    {log.targetId.substring(0, 8)}...
                                                </code>
                                            ) : (
                                                <span className="text-muted-foreground text-xs">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-border/50 flex items-center justify-between bg-muted/5">
                        <p className="text-sm text-muted-foreground">
                            Page <span className="font-bold text-foreground">{currentPage}</span> of <span className="font-bold text-foreground">{totalPages}</span>
                        </p>
                        <div className="flex items-center gap-2">
                            <Link
                                href={`/admin/logs?page=${currentPage - 1}`}
                                className={`p-2 rounded-lg border border-border transition-colors ${currentPage === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-muted'}`}
                            >
                                <ChevronLeft size={16} />
                            </Link>
                            <Link
                                href={`/admin/logs?page=${currentPage + 1}`}
                                className={`p-2 rounded-lg border border-border transition-colors ${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-muted'}`}
                            >
                                <ChevronRight size={16} />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
