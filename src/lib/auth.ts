import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length === 0) {
        throw new Error("Missing JWT_SECRET environment variable.");
    }
    return secret;
};

export const verifyAuth = async (token: string) => {
    try {
        const verified = await jwtVerify(
            token,
            new TextEncoder().encode(getJwtSecretKey())
        );
        return verified.payload;
    } catch {
        throw new Error("Your token is expired or invalid.");
    }
};

export const createToken = async (payload: { role: string, username: string }) => {
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(new TextEncoder().encode(getJwtSecretKey()));

    return token;
};

export async function verifyAdminSession() {
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
    } catch {
        throw new Error("Unauthorized: Invalid session.");
    }
}
