
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const admin = await prisma.admin.findFirst();
    console.log('Admin fields:', Object.keys(admin || {}));
    if (admin) {
        console.log('failedAttempts:', (admin as Record<string, unknown>).failedAttempts);
        console.log('lockoutUntil:', (admin as Record<string, unknown>).lockoutUntil);
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
