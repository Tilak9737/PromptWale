import prisma from "@/lib/prisma";
import { User, Shield, Calendar, MoreVertical } from "lucide-react";

export const metadata = {
    title: "Users | Admin Dashboard"
};

export default async function AdminUsersPage() {
    // Fetch all admins from DB
    const admins = await prisma.admin.findMany({
        orderBy: { createdAt: "desc" },
        select: { id: true, username: true, createdAt: true, failedAttempts: true, lockoutUntil: true }
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">User Management</h1>
                    <p className="text-muted-foreground">Manage administrative accounts and permissions.</p>
                </div>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border/50 bg-muted/20 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground font-bold">{admins.length} Total Admins</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/30 text-muted-foreground font-bold border-b border-border/50">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4">Security Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {admins.map((user) => {
                                const isLocked = user.lockoutUntil && new Date(user.lockoutUntil) > new Date();
                                return (
                                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-bold">{user.username}</div>
                                                    <div className="text-xs text-muted-foreground">ID: {user.id.slice(0, 8)}...</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                                <Shield size={12} className="mr-1" />
                                                Admin
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            <div className="flex items-center">
                                                <Calendar size={14} className="mr-2" />
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {isLocked ? (
                                                <span className="text-red-500 font-bold bg-red-500/10 px-2 py-1 rounded-md text-xs">Locked Out</span>
                                            ) : (
                                                <span className="text-green-500 font-bold bg-green-500/10 px-2 py-1 rounded-md text-xs">Active</span>
                                            )}
                                            {user.failedAttempts > 0 && <span className="ml-2 text-xs text-muted-foreground">({user.failedAttempts} fails)</span>}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground" disabled>
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
