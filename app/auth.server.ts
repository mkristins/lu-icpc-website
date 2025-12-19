import bcrypt from "bcryptjs";
import { PrismaClient } from "generated/prisma/client";
import type { NewsArticle } from "generated/prisma/browser";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma } from "generated/prisma/client";
import jwt from "jsonwebtoken";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({adapter})

const JWT_SECRET = process.env.JWT_SECRET!;

export function createToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export async function checkAdminAuth(username : string, password : string){
    let admin = await prisma.adminUser.findFirst({
         where : {
            username: username
        }
    })
    const token = createToken("admin")
    if(admin){
        const ok = await bcrypt.compare(password, admin.password_hash)
        return ok
    }
    else{
        return false
    }
}