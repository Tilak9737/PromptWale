"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitReport(formData: FormData) {
    try {
        const promptId = formData.get("promptId") as string;
        const reason = formData.get("reason") as string;
        const details = formData.get("details") as string;

        if (!promptId || !reason) {
            return { success: false, error: "Missing required fields." };
        }

        await prisma.report.create({
            data: {
                promptId,
                reason,
                details: details || null,
            },
        });

        // Optional: Trigger admin notification here

        revalidatePath("/admin/reports");
        return { success: true };
    } catch (error) {
        console.error("Failed to submit report:", error);
        return { success: false, error: "An unexpected error occurred. Please try again later." };
    }
}
