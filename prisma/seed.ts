import { PrismaClient } from "generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg";
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({adapter})

async function main() {
  console.log("Seeding database...")
  // -------------------------
  // NewsArticles
  // -------------------------
  const articles = await prisma.newsArticle.createMany({
    data: [
        { title: "Team 1 wins", text: "This was indeed an incredible feat of achievement"},
        { title: "Team 2 wins", text: "This was indeed a narrow competition"},
    ]
  })
  // -------------------------
  // Teams
  // -------------------------
  const teams = await prisma.team.createMany({
    data: [
      { name: "Alpha Coders" },
      { name: "Bug Slayers" },
      { name: "Runtime Terror" },
    ],
  })

  const allTeams = await prisma.team.findMany()

  // -------------------------
  // Contest
  // -------------------------
  const contest2024 = await prisma.contest.create({
    data: {
      year: 2024,
      from: new Date("2024-06-01T09:00:00Z"),
      to: new Date("2024-06-01T14:00:00Z"),
      teams: {
        connect: allTeams.map((team) => ({ id: team.id })),
      },

      tasks: {
        create: [
          { identifier: "A" },
          { identifier: "B" },
          { identifier: "C" },
        ],
      },
    },
  })

  const contest2025 = await prisma.contest.create({
    data: {
      year: 2025,
      from: new Date("2025-06-01T09:00:00Z"),
      to: new Date("2025-06-01T14:00:00Z"),
      teams: {
        connect: allTeams.map((team) => ({ id: team.id })),
      },

      tasks: {
        create: [
          { identifier: "A" },
          { identifier: "B" },
          { identifier: "C" },
          { identifier: "D" },
          { identifier: "E" },
        ],
      },
    },
  })

  // -------------------------
  // Submissions
  // -------------------------
  await prisma.contestSubmission.createMany({
    data: [
      {
        teamId: allTeams[0].id,
        contestId: contest2024.id,
        submissionTime: 15,
      },
      {
        teamId: allTeams[0].id,
        contestId: contest2024.id,
        submissionTime: 32,
      },
      {
        teamId: allTeams[1].id,
        contestId: contest2024.id,
        submissionTime: 20,
      },
    ],
  })

  console.log("Seeding finished")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
