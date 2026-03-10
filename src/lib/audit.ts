import prisma from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/auth";

export async function createAuditLog(action: string, details?: string, targetId?: string) {
    const session = await verifyAdminSession();

    try {
        await prisma.adminAuditLog.create({
            data: {
                admin: session.username as string,
                action,
                details,
                targetId
            }
        });
    } catch (error) {
        console.error("Failed to create audit log:", error);
        // We don't want to throw here to avoid breaking the main action
    }
}
