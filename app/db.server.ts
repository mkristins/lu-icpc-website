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
    for (const u of data) {
        await prisma.newsArticle.create({ data: u });
    }
}

export async function fetchAllNewsArticles() {
    let articles = await prisma.newsArticle.findMany()
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

export async function fetchAllContests(){
    let contests = await prisma.contest.findMany()
    return contests
}

export async function fetchContest(id : string){
    let contest = await prisma.contest.findUnique({
        where : {
            id : parseInt(id)
        }
    })
    return contest
}