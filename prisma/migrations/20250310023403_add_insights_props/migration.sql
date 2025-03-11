-- DropForeignKey
ALTER TABLE "Insight" DROP CONSTRAINT "Insight_poolOutId_fkey";

-- AlterTable
ALTER TABLE "Insight" ADD COLUMN     "tokenOutId" TEXT,
ALTER COLUMN "poolOutId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Insight" ADD CONSTRAINT "Insight_poolOutId_fkey" FOREIGN KEY ("poolOutId") REFERENCES "Pool"("id") ON DELETE SET NULL ON UPDATE CASCADE;
