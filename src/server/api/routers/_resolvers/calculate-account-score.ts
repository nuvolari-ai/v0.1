import { type PrismaClient } from "@prisma/client";
import { type PortfolioMoodSummary } from "@nuvolari/agents/interfaces/resolver-types";
import { type OctavAPI } from "@nuvolari/agents/tools/octav-fi/api";
import { fromHex, Hex, parseUnits, toHex } from "viem";
import { bigint } from "zod";

/**
 * Calculates the mod details including token values, positions,
 * percentages, and risk scores
 */
export async function calculateAccountMood(
  octav: OctavAPI,
  address: string
): Promise<PortfolioMoodSummary> {
  // const txs = await octav.getTransactions([address]);
  const txs = [];
  const saverScore = 200;
  const degenScore = 200;
  const balancedScore = 300;

  const tokenRisk = 0.33;

  const protocolRisk = Number(
    fromHex(address as Hex, { size: 20, to: "bigint" }) % 255n
  ) / 255;

  const txCount = txs.length;
  // const avgTxVolume = txs.reduce((a, b) => a + Number(b.valueFiat), 0);
  const avgTxVolume = 1;
  const txFreq = 1;

  const walletScore =
    200 +
    ((1 - tokenRisk) * 0.25 +
      txCount * 0.15 +
      avgTxVolume * 0.15 +
      txFreq * 0.25 +
      (1 - protocolRisk) * 0.2) *
      800;

  return {
    mood: { saver: saverScore, balanced: balancedScore, degen: degenScore },
    totalScore: walletScore,
    userAddress: address,
  };
}
