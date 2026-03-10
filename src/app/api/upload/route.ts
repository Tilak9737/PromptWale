import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { verifyAuth } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        // 1. Verify Admin Authentication
        const cookieHeader = request.headers.get("cookie");
        const tokenMatch = cookieHeader?.match(/admin_token=([^;]+)/);

        if (!tokenMatch || !tokenMatch[1]) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
        }

        try {
            await verifyAuth(tokenMatch[1]);
        } catch (e) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        // 2. Process the Form Data
        const data = await request.formData();
        const file: File | null = data.get("file") as unknown as File;

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 });
        }

        // 3. Strict Validation [P1-101]
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 });
        }

        const ALLOWED_TYPES: Record<string, string> = {
            "image/jpeg": "jpg",
            "image/jpg": "jpg",
            "image/png": "png",
            "image/webp": "webp",
        };

        const extension = ALLOWED_TYPES[file.type];
        if (!extension) {
            return NextResponse.json({ error: "Invalid file type. Only JPG, PNG, and WEBP allowed." }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 4. Create Unique Filename and Path
        const uniqueId = uuidv4();
        const filename = `${uniqueId}.${extension}`;

        // For local dev, we save to public/uploads
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        const filepath = path.join(uploadDir, filename);

        // 5. Write File to Disk
        await writeFile(filepath, buffer);

        // 6. Return the public URL for the database to consume
        const publicUrl = `/uploads/${filename}`;

        return NextResponse.json({ success: true, url: publicUrl });
    } catch (error) {
        console.error("Upload Route Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
