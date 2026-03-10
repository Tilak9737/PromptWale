"use server";

import { cookies } from "next/headers";
import { createToken, verifyAdminSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { createAuditLog } from "@/lib/audit";

export async function loginAdmin(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    // Check if any admin exists in the DB
    const adminCount = await prisma.admin.count();

    if (adminCount === 0) {
        // Bootstrap Mode: If no admins exist, use env vars to create one
        const bootstrapUser = process.env.ADMIN_USERNAME || "admin";
        const bootstrapPass = process.env.ADMIN_PASSWORD;

        if (!bootstrapPass) {
            return { success: false, error: "System not initialized. ADMIN_PASSWORD env var is missing." };
        }

        if (username === bootstrapUser && password === bootstrapPass) {
            // Create the first admin in DB
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.admin.create({
                data: {
                    username: bootstrapUser,
                    password: hashedPassword,
                }
            });

            const token = await createToken({ role: "admin", username: bootstrapUser });
            const cookieStore = await cookies();
            cookieStore.set("admin_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24, // 24 hours
            });
            return { success: true };
        }
        return { success: false, error: "Invalid bootstrap credentials." };
    }

    // Normal Mode: Auth against DB
    const admin = await prisma.admin.findUnique({
        where: { username }
    });

    if (!admin) {
        return { success: false, error: "Invalid admin credentials." };
    }

    // Check for lockout
    if (admin.lockoutUntil && admin.lockoutUntil > new Date()) {
        const remainingMinutes = Math.ceil((admin.lockoutUntil.getTime() - Date.now()) / 60000);
        return { success: false, error: `Account locked. Please try again in ${remainingMinutes} minutes.` };
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (isPasswordCorrect) {
        // Reset flags on success and update login time
        const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;
        const mustRotate = (Date.now() - (admin.passwordUpdatedAt?.getTime() || 0)) > NINETY_DAYS_MS;

        await prisma.admin.update({
            where: { id: admin.id },
            data: {
                failedAttempts: 0,
                lockoutUntil: null,
                lastLoginAt: new Date()
            }
        });

        const token = await createToken({ role: "admin", username: admin.username });
        const cookieStore = await cookies();
        cookieStore.set("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24, // 24 hours
        });

        return { success: true, mustRotate };
    } else {
        // Increment failed attempts
        const newFailedAttempts = admin.failedAttempts + 1;
        const lockoutDuration = 15; // minutes
        const updateData: Prisma.AdminUpdateInput = { failedAttempts: newFailedAttempts };

        if (newFailedAttempts >= 5) {
            updateData.lockoutUntil = new Date(Date.now() + lockoutDuration * 60000);
        }

        await prisma.admin.update({
            where: { id: admin.id },
            data: updateData
        });

        if (newFailedAttempts >= 5) {
            return { success: false, error: `Account locked due to multiple failed attempts. Please try again in ${lockoutDuration} minutes.` };
        }

        return { success: false, error: `Invalid admin credentials. ${5 - newFailedAttempts} attempts remaining.` };
    }
}

export async function logoutAdmin() {
    const cookieStore = await cookies();
    cookieStore.delete("admin_token");
    redirect("/admin/login");
}

export async function updateAdminPassword(formData: FormData) {
    const session = await verifyAdminSession();
    if (!session) redirect("/admin/login");

    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;

    const admin = await prisma.admin.findUnique({
        where: { username: session.username }
    });

    if (!admin || !(await bcrypt.compare(currentPassword, admin.password))) {
        return { success: false, error: "Incorrect current password." };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({
        where: { id: admin.id },
        data: {
            password: hashedNewPassword,
            passwordUpdatedAt: new Date()
        }
    });

    await createAuditLog("CHANGE_PASSWORD", `Admin ${session.username} rotated their password.`, admin.id);

    return { success: true };
}

export async function deleteAdmin(formData: FormData) {
    const session = await verifyAdminSession();
    if (!session) redirect("/admin/login");

    const adminId = formData.get("adminId") as string;

    if (session.id === adminId) {
        return { success: false, error: "Cannot delete your own account." };
    }

    try {
        const deletedAdmin = await prisma.admin.delete({
            where: { id: adminId }
        });
        await createAuditLog("DELETE_ADMIN", `Admin ${session.username} deleted admin account: ${deletedAdmin.username}.`, deletedAdmin.id);
        revalidatePath('/admin/admins');
        return { success: true };
    } catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2025') {
                return { success: false, error: "Admin not found." };
            }
        }
        console.error("Delete admin error:", err);
        return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
}

export async function createPrompt(data: { title: string; tool: string; beforeImage: string; afterImage: string; promptText: string; description?: string; metaTitle?: string; metaDescription?: string; status?: string; thumbnailPos?: string; categoryName: string }) {
    await verifyAdminSession();
    try {
        // Handle multi-categories (comma separated)
        const catNames = data.categoryName.split(",").map((c: string) => c.trim()).filter(Boolean);
        const categoriesConnectOrCreate = await Promise.all(catNames.map(async (name: string) => {
            return {
                where: { name },
                create: {
                    name,
                    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + "-" + Date.now().toString().slice(-4)
                }
            };
        }));

        const prompt = await prisma.prompt.create({
            data: {
                title: data.title,
                slug: `${data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
                tool: data.tool,
                beforeImage: data.beforeImage,
                afterImage: data.afterImage,
                promptText: data.promptText,
                description: data.description,
                metaTitle: data.metaTitle || `${data.title} | PromptWale`,
                metaDescription: data.metaDescription || data.description || data.promptText.substring(0, 150),
                categories: {
                    connectOrCreate: categoriesConnectOrCreate
                },
                status: data.status || "published",
                thumbnailPos: data.thumbnailPos || "center"
            }
        });

        revalidatePath('/');
        revalidatePath('/admin/prompts');
        await createAuditLog("CREATE_PROMPT", `Created prompt: ${data.title}`, prompt.id);
        return { success: true, promptId: prompt.id };
    } catch (err: unknown) {
        console.error("Create prompt error:", err);
        return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
}

export async function deletePrompt(id: string) {
    await verifyAdminSession();
    try {
        await prisma.prompt.delete({ where: { id } });
        revalidatePath('/admin/prompts');
        revalidatePath('/');
        await createAuditLog("DELETE_PROMPT", `Deleted prompt ID: ${id}`, id);
        return { success: true };
    } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
}

export async function deleteCategory(id: string) {
    await verifyAdminSession();
    try {
        const count = await prisma.prompt.count({ where: { categories: { some: { id } } } });
        if (count > 0) {
            return { success: false, error: "Cannot delete category with associated prompts." };
        }
        await prisma.category.delete({ where: { id } });
        revalidatePath('/admin/categories');
        await createAuditLog("DELETE_CATEGORY", `Deleted category ID: ${id}`, id);
        return { success: true };
    } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
}

export async function createCategory(data: { name: string, description: string }) {
    await verifyAdminSession();
    try {
        await prisma.category.create({
            data: {
                name: data.name,
                slug: data.name.toLowerCase().replace(/\s+/g, '-'),
                description: data.description,
            }
        });
        revalidatePath('/admin/categories');
        await createAuditLog("CREATE_CATEGORY", `Created category: ${data.name}`);
        return { success: true };
    } catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
                return { success: false, error: "A category with this name already exists." };
            }
        }
        return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
}

export async function updateCategory(id: string, data: { name: string, description: string }) {
    await verifyAdminSession();
    try {
        await prisma.category.update({
            where: { id },
            data: {
                name: data.name,
                slug: data.name.toLowerCase().replace(/\s+/g, '-'),
                description: data.description,
            }
        });
        revalidatePath('/admin/categories');
        await createAuditLog("UPDATE_CATEGORY", `Updated category: ${data.name}`, id);
        return { success: true };
    } catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
                return { success: false, error: "A category with this name already exists." };
            }
        }
        return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
}

export async function updatePrompt(id: string, data: { title: string; tool: string; beforeImage?: string; afterImage?: string; promptText: string; description?: string; metaTitle?: string; metaDescription?: string; status?: string; thumbnailPos?: string; categoryName: string }) {
    await verifyAdminSession();
    try {
        // Handle multi-categories
        const catNames = data.categoryName.split(",").map((c: string) => c.trim()).filter(Boolean);
        const categoriesConnectOrCreate = await Promise.all(catNames.map(async (name: string) => {
            return {
                where: { name },
                create: {
                    name,
                    slug: name.toLowerCase().replace(/\s+/g, '-') + "-" + Date.now().toString().slice(-4)
                }
            };
        }));

        const updateData: Prisma.PromptUpdateInput = {
            title: data.title,
            promptText: data.promptText,
            description: data.description,
            tool: data.tool,
            status: data.status || "published",
            metaTitle: data.metaTitle || `${data.title} | PromptWale`,
            metaDescription: data.metaDescription || data.description || data.promptText.substring(0, 150),
            thumbnailPos: data.thumbnailPos || "center",
            categories: {
                set: [], // Disconnect old categories
                connectOrCreate: categoriesConnectOrCreate
            }
        };

        if (data.beforeImage) updateData.beforeImage = data.beforeImage;
        if (data.afterImage) updateData.afterImage = data.afterImage;

        await prisma.prompt.update({
            where: { id },
            data: updateData
        });

        revalidatePath('/');
        revalidatePath('/admin/prompts');
        await createAuditLog("UPDATE_PROMPT", `Updated prompt: ${data.title}`, id);
        return { success: true };
    } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
}



export async function getAllCategories() {
    try {
        return await prisma.category.findMany({
            orderBy: { name: 'asc' }
        });
    } catch {
        return [];
    }
}

export async function resolveReport(id: string) {
    await verifyAdminSession();
    try {
        await prisma.report.update({
            where: { id },
            data: { status: "resolved" }
        });
        await createAuditLog("RESOLVE_REPORT", `Resolved report ID: ${id}`, id);
        revalidatePath('/admin/reports');
        return { success: true };
    } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
}

export async function dismissReport(id: string) {
    await verifyAdminSession();
    try {
        await prisma.report.update({
            where: { id },
            data: { status: "dismissed" }
        });
        await createAuditLog("DISMISS_REPORT", `Dismissed report ID: ${id}`, id);
        revalidatePath('/admin/reports');
        return { success: true };
    } catch (err: unknown) {
        return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
}

export async function getAuditLogs(page = 1, pageSize = 20) {
    await verifyAdminSession();
    const skip = (page - 1) * pageSize;

    try {
        const [logs, total] = await Promise.all([
            prisma.adminAuditLog.findMany({
                orderBy: { createdAt: 'desc' },
                skip,
                take: pageSize
            }),
            prisma.adminAuditLog.count()
        ]);

        return {
            logs,
            total,
            totalPages: Math.ceil(total / pageSize)
        };
    } catch (error) {
        console.error("Failed to fetch audit logs:", error);
        return { logs: [], total: 0, totalPages: 0 };
    }
}

