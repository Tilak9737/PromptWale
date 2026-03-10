import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { verifyAuth } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        // 1. Verify Admin Authentication
        const cookieStore = await cookies();
        const token = cookieStore.get("admin_token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
        }

        try {
            const payload = await verifyAuth(token);
            if (payload.role !== "admin") {
                return NextResponse.json({ error: "Unauthorized role" }, { status: 403 });
            }
        } catch {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        // 2. Process the Form Data
        const data = await request.formData();
        const fileEntry = data.get("file");
        if (!(fileEntry instanceof File)) {
            return NextResponse.json({ error: "No file received." }, { status: 400 });
        }
        const file = fileEntry;


        // 3. Strict Validation [P1-101]
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 });
        }

        const ALLOWED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
        if (file.type && !ALLOWED_TYPES.has(file.type)) {
            return NextResponse.json({ error: "Invalid file type. Only JPG, PNG, and WEBP allowed." }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 3.1 Magic-Byte Signature Verification [P2-206]
        const isJPG = buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
        const isPNG =
            buffer.length >= 8 &&
            buffer[0] === 0x89 &&
            buffer[1] === 0x50 &&
            buffer[2] === 0x4e &&
            buffer[3] === 0x47 &&
            buffer[4] === 0x0d &&
            buffer[5] === 0x0a &&
            buffer[6] === 0x1a &&
            buffer[7] === 0x0a;
        const isWEBP =
            buffer.length >= 12 &&
            buffer.toString("ascii", 0, 4) === "RIFF" &&
            buffer.toString("ascii", 8, 12) === "WEBP";

        let extension: "jpg" | "png" | "webp" | null = null;
        let detectedMime: "image/jpeg" | "image/png" | "image/webp" | null = null;
        if (isJPG) {
            extension = "jpg";
            detectedMime = "image/jpeg";
        } else if (isPNG) {
            extension = "png";
            detectedMime = "image/png";
        } else if (isWEBP) {
            extension = "webp";
            detectedMime = "image/webp";
        } else {
            return NextResponse.json({ error: "Invalid file signature. Only JPG, PNG, and WEBP allowed." }, { status: 400 });
        }

        // Browser-reported MIME types can be inaccurate for renamed/converted files.
        // We trust verified file signatures for security and use that to store the extension.
        const normalizedFileType = file.type === "image/jpg" ? "image/jpeg" : file.type;
        if (normalizedFileType && normalizedFileType !== detectedMime) {
            console.warn(`Upload MIME mismatch: reported=${normalizedFileType}, detected=${detectedMime}`);
        }

        // 4. Create Unique Filename and Path
        const uniqueId = uuidv4();
        const filename = `${uniqueId}.${extension}`;

        // For local dev, we save to public/uploads
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

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
