"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSystemSettings() {
    try {
        // Fallback to raw query if model is missing in generated client due to Windows file locks
        const result = await (prisma as any).$queryRawUnsafe(`SELECT * FROM "SystemSettings" WHERE id = 'global' LIMIT 1`);
        let settings = result[0];

        if (!settings) {
            // Create default settings if none exist
            await (prisma as any).$queryRawUnsafe(`
                INSERT INTO "SystemSettings" (id, "maintenanceMode", "siteName", "updatedAt") 
                VALUES ('global', false, 'PromptWale', NOW())
                ON CONFLICT (id) DO NOTHING
            `);
            settings = { id: "global", maintenanceMode: false, siteName: "PromptWale" };
        }

        return settings;
    } catch (error) {
        console.error("Failed to fetch settings:", error);
        // Silent fallback for public layout
        return { maintenanceMode: false, siteName: "PromptWale" };
    }
}

export async function updateSystemSettings(data: { maintenanceMode?: boolean, siteName?: string }) {
    try {
        if (data.maintenanceMode !== undefined) {
            await (prisma as any).$queryRawUnsafe(`
                UPDATE "SystemSettings" SET "maintenanceMode" = ${data.maintenanceMode}, "updatedAt" = NOW() WHERE id = 'global'
            `);
        }
        if (data.siteName !== undefined) {
            await (prisma as any).$queryRawUnsafe(`
                UPDATE "SystemSettings" SET "siteName" = '${data.siteName}', "updatedAt" = NOW() WHERE id = 'global'
            `);
        }

        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error) {
        console.error("Failed to update settings:", error);
        return { success: false, error: "Database error" };
    }
}
