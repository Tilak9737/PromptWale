"use server";

import { cookies } from "next/headers";
import { createToken, verifyAuth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

    if (admin && await bcrypt.compare(password, admin.password)) {
        const token = await createToken({ role: "admin", username: admin.username });
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

    return { success: false, error: "Invalid admin credentials." };
}

export async function logoutAdmin() {
    const cookieStore = await cookies();
    cookieStore.delete("admin_token");
    redirect("/admin/login");
}

async function verifyAdminSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
        throw new Error("Unauthorized: No session token found.");
    }

    try {
        const payload = await verifyAuth(token);
        if (payload.role !== "admin") {
            throw new Error("Unauthorized: Invalid role.");
        }
        return payload;
    } catch (error) {
        throw new Error("Unauthorized: Invalid session.");
    }
}

export async function createPrompt(data: any) {
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
        return { success: true, promptId: prompt.id };
    } catch (err: any) {
        console.error("Create prompt error:", err);
        return { success: false, error: err.message };
    }
}

export async function deletePrompt(id: string) {
    await verifyAdminSession();
    try {
        await prisma.prompt.delete({ where: { id } });
        revalidatePath('/admin/prompts');
        revalidatePath('/');
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
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
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
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
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
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
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function updatePrompt(id: string, data: any) {
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

        const updateData: any = {
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
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function updateAdminPassword(data: any) {
    const payload = await verifyAdminSession();
    const { currentPassword, newPassword } = data;

    if (!payload.username) {
        console.warn("Update password attempt with missing username in session.");
        return { success: false, error: "Session identity missing. Please log out and back in." };
    }

    try {
        const admin = await prisma.admin.findUnique({
            where: { username: payload.username as string }
        });

        if (!admin) {
            console.error(`Admin with username ${payload.username} not found in DB.`);
            return { success: false, error: "Admin account not found." };
        }

        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) {
            return { success: false, error: "Current password incorrect." };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.admin.update({
            where: { id: admin.id },
            data: { password: hashedPassword }
        });

        return { success: true };
    } catch (err: any) {
        console.error("Update password error:", err);
        return { success: false, error: "Failed to update password." };
    }
}

export async function getAllCategories() {
    try {
        return await prisma.category.findMany({
            orderBy: { name: 'asc' }
        });
    } catch (err) {
        return [];
    }
}
