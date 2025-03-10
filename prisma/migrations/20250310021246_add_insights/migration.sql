-- CreateEnum
CREATE TYPE "InsightType" AS ENUM ('YIELD_POOL', 'TOKEN_OPPORTUNITY');

-- CreateEnum
CREATE TYPE "InsightStatus" AS ENUM ('PENDING', 'EXECUTED', 'STALE');

-- CreateTable
CREATE TABLE "Insight" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "InsightType" NOT NULL,
    "userAddress" TEXT NOT NULL,
    "insightShort" TEXT NOT NULL,
    "insightDetailed" TEXT NOT NULL,
    "protocolSlug" TEXT NOT NULL,
    "apiCall" TEXT NOT NULL,
    "tokenInId" TEXT NOT NULL,
    "tokenInAmount" TEXT NOT NULL,
    "tokenInDecimals" INTEGER NOT NULL,
    "poolOutId" TEXT NOT NULL,
    "status" "InsightStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Insight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Insight_userAddress_idx" ON "Insight"("userAddress");

-- AddForeignKey
ALTER TABLE "Insight" ADD CONSTRAINT "Insight_tokenInId_fkey" FOREIGN KEY ("tokenInId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insight" ADD CONSTRAINT "Insight_poolOutId_fkey" FOREIGN KEY ("poolOutId") REFERENCES "Pool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
