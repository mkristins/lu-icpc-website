-- CreateTable
CREATE TABLE "Contest" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "from" TIMESTAMP(3) NOT NULL,
    "to" TIMESTAMP(3) NOT NULL,
    "taskIdentifiers" TEXT[],

    CONSTRAINT "Contest_pkey" PRIMARY KEY ("id")
);
