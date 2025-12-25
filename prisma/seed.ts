import { PrismaClient } from "generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { create } from "domain";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({adapter})

async function main() {
  console.log("Seeding database...")
  // -------------------------
  // Admin
  // -------------------------
  const username = 'admin'
  const password = 'admin'
  const passwordHash = await bcrypt.hash(password, 10)
  
  const admin = await prisma.adminUser.upsert({
    where: { username },
    update: {},
    create: {
      username,
      password_hash: passwordHash,
      email: "admin@example.com",
      name: "Admin"
    }
  })
  // -------------------------
  // NewsArticles
  // -------------------------
  const articles = await prisma.newsArticle.createMany({
    data: [
        { title: "Team 1 wins", text: '{\"type\":\"doc\",\"content\":[{\"type\":\"heading\",\"attrs\":{\"level\":2},\"content\":[{\"type\":\"text\",\"text\":\"LU dalība CERC\"}]},{\"type\":\"heading\",\"attrs\":{\"level\":1},\"content\":[{\"type\":\"text\",\"text\":\"LU komandas CERC pusfinālā izcīna attiecīgi 7. un 35. vietu.\"}]},{\"type\":\"paragraph\"}]}'},
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


  const singleTeam = await prisma.team.create({
    data : {
      name: "Fake Coders",
      contestants: {
        create: [
          {name: "Jānis Bērziņš"},
          {name: "Alfrēds Bērziņš"},
          {name: "Jānis Vītoliņš"}
        ]
      }
    }
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
      name: "LU Atlase 2024",
      isLocal: true,
      pdfLink: "lupo-data/competition-archive/2010/euc2025-official.pdf",
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
      name: "LU Atlase 2025",
      isLocal: true,
      teams: {
        connect: allTeams.map((team) => ({ id: team.id })),
      }
    },
  })
  const A2025 = await prisma.contestTask.create({
    data : {
      identifier: "A",
      contestId: contest2025.id
    }
  })
  const B2025 = await prisma.contestTask.create({
    data : {
      identifier: "B",
      contestId: contest2025.id
    }
  })
  const C2025 = await prisma.contestTask.create({
    data : {
      identifier: "C",
      contestId: contest2025.id
    }
  })
  const D2025 = await prisma.contestTask.create({
    data : {
      identifier: "D",
      contestId: contest2025.id
    }
  })
  // -------------------------
  // Submissions
  // -------------------------
  await prisma.contestSubmission.createMany({
    data: [
      {
        teamId: allTeams[0].id,
        taskId: 1,
        contestId: contest2024.id,
        submissionTime: 15,
        isVerdictOk: true,
      },
      {
        teamId: allTeams[0].id,
        taskId: 2,
        contestId: contest2024.id,
        submissionTime: 32,
        isVerdictOk: false,
      },
      {
        teamId: allTeams[1].id,
        taskId: 3,
        contestId: contest2024.id,
        submissionTime: 20,
        isVerdictOk: true,
      },
    ],
  })
  await prisma.contestSubmission.createMany({
    data: [
      {
        teamId: allTeams[0].id,
        taskId: C2025.id,
        contestId: contest2025.id,
        submissionTime: 10,
        isVerdictOk: false
      },
      {
        teamId: allTeams[0].id,
        taskId: C2025.id,
        contestId: contest2025.id,
        submissionTime: 11,
        isVerdictOk: false
      },
      {
        teamId: allTeams[0].id,
        taskId: D2025.id,
        contestId: contest2025.id,
        submissionTime: 15,
        isVerdictOk: true
      },
      {
        teamId: allTeams[0].id,
        taskId: C2025.id,
        contestId: contest2025.id,
        submissionTime: 50,
        isVerdictOk: true
      },
    ]
  })
  // -------------
  // Photos
  // -------------
  const album1 = await prisma.album.create({
    data : {
      title: "CERC 2025",
      photos: {
        create: [
          {photoLink : "example/gallery/Main Album/csm_CERC_2025__5__9af5e6cb38.png"},
          {photoLink : "example/gallery/Main Album/csm_CERC_2025__6__f8c554989a.png"},
          {photoLink : "example/gallery/Main Album/csm_CERC_2025__7__3ef5eca4fa.png"}
        ]
      }
    }
  })  

  const album2 = await prisma.album.create({
    data : {
      title: "CERC 2025 v2",
      photos: {
        create: [
          {photoLink : "example/gallery/Second Album/csm_CERC_2025__2__b3e2278f17.png"},
          {photoLink : "example/gallery/Second Album/csm_CERC_2025__3__8c486b5d05.png"},
          {photoLink : "example/gallery/Second Album/csm_CERC_2025__4__08c3b1bae1.png"}
        ]
      }
    }
  })

  //

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
