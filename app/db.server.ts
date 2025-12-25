import { PrismaClient } from "generated/prisma/client";
import type { NewsArticle } from "generated/prisma/browser";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma } from "generated/prisma/client";
import { parse } from "path";
import type { UploadSubmissionData, UploadTeamData } from "./types/contest-upload";

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
            participations: {
                include: {
                    team: true
                }
            },
            submissions: true,
            tasks: {
                orderBy: {
                    identifier: 'asc', // or 'desc'
                },
            }
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

export async function uploadLocalContest(
    contestName : string,
    teams : UploadTeamData[],
    submissions : UploadSubmissionData[],
    problems : string[],
    year : number,
    dateFrom : Date,
    dateTo : Date
){
    const dbContest = await prisma.contest.create({
        data: {
            name: contestName,
            isLocal : true,
            year : year,
            from: dateFrom,
            to : dateTo
        }
    })

    const dbProblems = await Promise.all(
        problems.map(async p => {
            return await prisma.contestTask.create({
                data: {
                    contestId: dbContest.id,
                    identifier: p
                }
            })
        })
    )

    const participantToTeamMapping = new Map<number, number>()
    const dbTeams = await Promise.all(
        teams.map(async t => {
            if(t.teamId){
                participantToTeamMapping.set(t.participantId, t.teamId)
                await prisma.teamParticipation.create({
                    data : {
                        teamId: t.teamId,
                        contestId: dbContest.id,
                        rank: t.rank,
                        solvedTasks: t.solvedProblems,
                        penalty: t.penalty
                    }
                })
            }
            else{
                const dbTeam = await prisma.team.create({
                    data : {
                        name: t.teamName
                    }
                })
                if(t.member1.name){
                    await prisma.contestant.create({
                        data : {
                            teamId: dbTeam.id,
                            name: t.member1.name
                        }
                    })
                }
                if(t.member2.name){
                    await prisma.contestant.create({
                        data : {
                            teamId: dbTeam.id,
                            name: t.member2.name
                        }
                    })
                }
                if(t.member3.name){
                    await prisma.contestant.create({
                        data : {
                            teamId: dbTeam.id,
                            name: t.member3.name
                        }
                    })
                }
                await prisma.teamParticipation.create({
                    data : {
                        teamId: dbTeam.id,
                        contestId: dbContest.id,
                        rank: t.rank,
                        solvedTasks: t.solvedProblems,
                        penalty: t.penalty
                    }
                })
                participantToTeamMapping.set(t.participantId, dbTeam.id)
            }
        })
    )
    // submissions
    submissions.forEach(async sub => {
        const problem = dbProblems.find(p => sub.problemIndex == p.identifier)
        const team = participantToTeamMapping.get(sub.participantId)
        if(problem && team){
            await prisma.contestSubmission.create({
                data : {
                    contestId: dbContest.id,
                    taskId: problem.id,
                    teamId: team,
                    submissionTime: sub.submissionTime,
                    isVerdictOk: sub.isVerdictOk
                }
            })
        }
    })
}   