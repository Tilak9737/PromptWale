
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Checking Prompt model fields...");
    const fields = Object.keys(prisma.prompt);
    console.log("Prompt model keys:", fields);

    // Check if we can find any prompt
    const prompt = await prisma.prompt.findFirst();
    if (prompt) {
        console.log("Actual Prompt object keys:", Object.keys(prompt));
    } else {
        console.log("No prompts found in DB.");
    }
}

main();
