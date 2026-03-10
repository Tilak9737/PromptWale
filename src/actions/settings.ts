"use server";

import prisma from "@/lib/prisma";
import { revalidatePath, unstable_cache } from "next/cache";
import { Prisma } from "@prisma/client";
import { verifyAdminSession } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";

export const getSystemSettings = unstable_cache(
    async () => {
        try {
            let settings = await prisma.systemSettings.findUnique({
                where: { id: "global" }
            });

            if (!settings) {
                // Create default settings if none exist
                settings = await prisma.systemSettings.create({
                    data: {
                        id: "global",
                        maintenanceMode: false,
                        siteName: "PromptWale",
                        baseUrl: "https://promptwale.com",
                        adminEmail: "admin@promptwale.com",
                    }
                });
            }

            return settings;
        } catch (error) {
            console.error("Failed to fetch settings:", error);
            // Silent fallback for public layout
            return { id: "global", maintenanceMode: false, siteName: "PromptWale", baseUrl: "https://promptwale.com", adminEmail: "admin@promptwale.com", updatedAt: new Date() };
        }
    },
    ['system-settings'],
    { revalidate: 60, tags: ['settings'] }
);

export async function updateSystemSettings(data: { maintenanceMode?: boolean, siteName?: string, baseUrl?: string, adminEmail?: string }) {
    await verifyAdminSession();

    try {
        const updateData: Prisma.SystemSettingsUpdateInput = {};
        if (data.maintenanceMode !== undefined) updateData.maintenanceMode = data.maintenanceMode;
        if (data.siteName !== undefined) updateData.siteName = data.siteName;
        if (data.baseUrl !== undefined) updateData.baseUrl = data.baseUrl;
        if (data.adminEmail !== undefined) updateData.adminEmail = data.adminEmail;

        await prisma.systemSettings.update({
            where: { id: "global" },
            data: updateData
        });

        revalidatePath('/', 'layout');
        await createAuditLog("UPDATE_SETTINGS", `Updated system settings: ${data.siteName || 'system'}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to update settings:", error);
        return { success: false, error: "Database error" };
    }
}

export async function clearAppCache() {
    await verifyAdminSession();
    try {
        revalidatePath('/', 'layout');
        await createAuditLog("CLEAR_CACHE", "Cleared application system cache");
        return { success: true };
    } catch (error) {
        console.error("Failed to clear cache:", error);
        return { success: false, error: "Failed to invalidate cache" };
    }
}
