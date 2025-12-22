import { PrismaClient } from "generated/prisma/client";
import type { NewsArticle } from "generated/prisma/browser";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma } from "generated/prisma/client";
import { parse } from "path";
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

export async function updateNewsArticle(id: string, newText : string){
    await prisma.newsArticle.update({
        where: {
            id : parseInt(id)
        },
        data : {
            text: newText
        }
    })
}

export async function fetchAllContests(){
    let contests = await prisma.contest.findMany({
        orderBy: {
            year: 'desc'
        }
    })
    return contests
}

export async function fetchAllTeams(){
    let teams = await prisma.team.findMany()
    return teams
}

export async function fetchAllContestants(){
    let contestants = await prisma.contestant.findMany()
    return contestants
}

export async function fetchContest(id : string){
    let contest = await prisma.contest.findUnique({
        where : {
            id : parseInt(id)
        },
        include : {
            teams: true,
            submissions: true,
            tasks: true
        }
    })
    return contest
}

export async function fetchContestTasks(id : string) {
    let contestTasks = await prisma.contestTask.findMany({
        where : {
            contestId: parseInt(id)
        }
    })
    return contestTasks
}

export async function fetchAlbums() {
    let albums = await prisma.album.findMany()
    return albums
}