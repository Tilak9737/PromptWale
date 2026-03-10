import { jwtVerify, SignJWT } from "jose";

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
    } catch (error) {
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
