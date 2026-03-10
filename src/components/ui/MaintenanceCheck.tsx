import { getSystemSettings } from "@/actions/settings";
import { Lock } from "lucide-react";
import Link from "next/link";

export default async function MaintenanceCheck() {
    const settings = await getSystemSettings();

    if (settings && settings.maintenanceMode) {
        return (
            <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center p-6 text-center">
                <div className="max-w-md space-y-6">
                    <div className="w-20 h-20 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock size={40} />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter">Under Maintenance</h1>
                    <p className="text-muted-foreground text-lg">
                        PromptWale is currently undergoing scheduled maintenance. We'll be back online shortly with new features and improvements!
                    </p>
                    <div className="pt-4">
                        <Link
                            href="/admin"
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                            Admin Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
