import { PrismaClient } from "generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma } from "generated/prisma/client";
import type { UploadSubmissionData, UploadTeamData } from "./types/contest-upload";
import { uploadPDF } from "./files.server";

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

interface TeamRecords {
    id: number;
    name: string;
    participations: {
        official: boolean;
        medalIndex: number;
    }[];
}

function fetchTeamRecords(team : TeamRecords){
    let participations = 0
    let gold = 0, silver = 0, bronze = 0
    for (const p of team.participations){
        if (p.official) participations += 1;
        if (p.medalIndex === 1) gold += 1;
        if (p.medalIndex === 2) silver += 1;
        if (p.medalIndex === 3) bronze += 1;
    }
    return {
        participations: participations,
        gold: gold,
        silver: silver,
        bronze: bronze
    }
}

export async function fetchAllTeams(){
    const teams = await prisma.team.findMany({
        select: {
            id: true,
            name: true,
            participations: { select: { official: true, medalIndex: true } },
        },
    });

    return teams.map((t) => {
        const record = fetchTeamRecords(t)

        return { 
            id: t.id, 
            name: t.name, 
            participations: record.participations, 
            gold: record.gold, 
            silver: record.silver, 
            bronze: record.bronze 
        };
    });
}

export async function fetchTeamProfile(id: number) {
    const team = await prisma.team.findFirst({
        where: {
            id: id
        },
        include: {
            members: true
        }
    })
    return team
}

export async function fetchContestantProfile(id: number) {
    const contestant = await prisma.contestant.findFirst({
        where: {
            id: id
        },
        include: {
            teams: true
        }
    })
    return contestant
}

export async function fetchAllContestants(){
    const contestants = await prisma.contestant.findMany({
        select: {
            id: true,
            name: true,
            teams: {
                select: {
                    team : {
                        select: {
                            id: true,
                            name: true,
                            participations: {
                                select: {
                                    official: true,
                                    medalIndex: true
                                }
                            }
                        }
                    }
                }
            }
        }
    })
    return contestants.map((c) => {

        let participations = 0
        let gold = 0, silver = 0, bronze = 0

        for(const t of c.teams){
            const record = fetchTeamRecords(t.team)
            participations += record.participations
            gold += record.gold
            silver += record.silver
            bronze += record.bronze
        }
        return {
            id: c.id,
            name: c.name,
            participations,
            gold,
            silver,
            bronze
        }
    })
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
    pdfFile : File,
    year : number,
    dateFrom : Date,
    dateTo : Date
){
    const pdfUrl = await uploadPDF(pdfFile);
    
    const dbContest = await prisma.contest.create({
        data: {
            name: contestName,
            isLocal : true,
            pdfLink: pdfUrl,
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
                    const contestant1 = await prisma.contestant.create({
                        data : {
                            name: t.member1.name
                        }
                    })
                    await prisma.teamMember.create({
                        data : {
                            teamId: dbTeam.id,
                            contestantId: contestant1.id
                        }
                    })
                }
                if(t.member2.name){
                    const contestant2 = await prisma.contestant.create({
                        data : {
                            name: t.member2.name
                        }
                    })
                    await prisma.teamMember.create({
                        data : {
                            teamId: dbTeam.id,
                            contestantId: contestant2.id
                        }
                    })
                }
                if(t.member3.name){
                    const contestant3 = await prisma.contestant.create({
                        data : {
                            name: t.member3.name
                        }
                    })
                    await prisma.teamMember.create({
                        data : {
                            teamId: dbTeam.id,
                            contestantId: contestant3.id
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