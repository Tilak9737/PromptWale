"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Image as ImageIcon, Tags, Users, Settings, LogOut, Flag, History as HistoryIcon, X } from "lucide-react";
import { logoutAdmin } from "@/actions/admin";

type SidebarProps = {
    className?: string;
    onNavigate?: () => void;
    showCloseButton?: boolean;
    onClose?: () => void;
};

export default function Sidebar({
    className = "",
    onNavigate,
    showCloseButton = false,
    onClose,
}: SidebarProps) {
    const pathname = usePathname();

    const links = [
        { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
        { href: "/admin/prompts", icon: ImageIcon, label: "Prompts" },
        { href: "/admin/categories", icon: Tags, label: "Categories" },
        { href: "/admin/reports", icon: Flag, label: "Reports" },
        { href: "/admin/users", icon: Users, label: "Users & Access" },
        { href: "/admin/settings", icon: Settings, label: "Settings" },
        { href: "/admin/logs", icon: HistoryIcon, label: "Audit Logs" },
    ];

    const isActive = (href: string, exact?: boolean) => {
        if (exact) {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    return (
        <aside className={`w-64 bg-card border-r border-border/50 flex flex-col ${className}`}>
            <div className="h-16 flex items-center px-6 border-b border-border/50">
                <div className="w-full flex items-center justify-between">
                    <Link href="/admin" onClick={onNavigate} className="text-xl font-bold tracking-tight">
                        Prompt<span className="text-primary">Wale</span> <span className="text-xs text-muted-foreground ml-1">Admin</span>
                    </Link>
                    {showCloseButton && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                            aria-label="Close admin menu"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1 mt-4">
                {links.map((link) => {
                    const active = isActive(link.href, link.exact);
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={onNavigate}
                            className={`group relative flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all duration-300 ${active
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            {active && (
                                <span className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
                            )}
                            <link.icon size={20} className={`${active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"} transition-colors`} />
                            <span>{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border/50">
                <form action={logoutAdmin}>
                    <button
                        type="submit"
                        onClick={onNavigate}
                        className="flex items-center space-x-3 px-3 py-2.5 w-full rounded-lg text-red-500 hover:bg-red-500/10 font-medium transition-colors"
                    >
                        <LogOut size={18} />
                        <span>Log Out</span>
                    </button>
                </form>
            </div>
        </aside>
    );
}
