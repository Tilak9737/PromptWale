const fs = require('fs');
const path = require('path');

const prismaDir = path.join(__dirname, 'prisma');
if (!fs.existsSync(prismaDir)) {
    fs.mkdirSync(prismaDir);
}

const schema = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = "postgresql://postgres:TilakAsAdmin@localhost:5432/promptwale"
}

model Prompt {
  id              String   @id @default(cuid())
  title           String
  slug            String   @unique
  promptText      String
  description     String?
  beforeImage     String
  afterImage      String
  tool            String
  categoryId      String
  category        Category @relation(fields: [categoryId], references: [id])
  instructions    String?
  isTrending      Boolean  @default(false)
  isFeatured      Boolean  @default(false)
  views           Int      @default(0)
  copies          Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  metaTitle       String?
  metaDescription String?
}

model Category {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?
  prompts     Prompt[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Admin {
  id        String   @id @default(cuid())
  username  String   @unique
  password  String
  createdAt DateTime @default(now())
}

model Analytics {
  id        String   @id @default(cuid())
  event     String
  promptId  String?
  timestamp DateTime @default(now())
}
`;

fs.writeFileSync(path.join(prismaDir, 'schema.prisma'), schema.trim());
console.log('Schema written successfully to', path.join(prismaDir, 'schema.prisma'));
