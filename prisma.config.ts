import path from "node:path";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// Always load .env from project root (same folder as this file)
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is undefined. Make sure .env is in the project root and contains DATABASE_URL."
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: DATABASE_URL,
  },
});
