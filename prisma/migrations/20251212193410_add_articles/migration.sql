-- CreateTable
CREATE TABLE "NewsArticle" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "NewsArticle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsArticle_title_key" ON "NewsArticle"("title");

-- CreateIndex
CREATE UNIQUE INDEX "NewsArticle_text_key" ON "NewsArticle"("text");
