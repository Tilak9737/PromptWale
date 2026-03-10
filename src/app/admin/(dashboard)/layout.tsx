import Link from "next/link";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-muted/20 flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-card border-b border-border/50 flex items-center justify-between px-6 sticky top-0 z-10">
                    <h2 className="font-bold text-lg hidden sm:block">Admin Console</h2>
                    <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                            AD
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
