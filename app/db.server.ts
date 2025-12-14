import { PrismaClient } from "generated/prisma/client";
import type { NewsArticle } from "generated/prisma/browser";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma } from "generated/prisma/client";
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({adapter})
const data: Prisma.NewsArticleCreateInput[] = [
    {
        title: "LU programmētāji iegūst sudrabu ICPC pusfinālā",
        text: "Patiess notikums."
    }
]

export async function creator() {
    console.log("Server action")
    for (const u of data) {
        await prisma.newsArticle.create({ data: u });
    }
}

export async function fetchAllNewsArticles() {
    let articles = await prisma.newsArticle.findMany()
    console.log(articles)
    return articles
}

export async function fetchNewsArticle(id: string) {
    let article = await prisma.newsArticle.findUnique({
         where : {
            id: parseInt(id)
        }
    })
    return article
}