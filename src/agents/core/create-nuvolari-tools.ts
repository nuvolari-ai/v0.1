import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { getPoolsByRiskScoreRange } from "@nuvolari/agents/core/_resolvers/pool-risks";
import { db } from "@nuvolari/server/db";
import { getPoolsByRiskTool } from "../tools/quant";

/**
 * Creates and returns all Nuvolari LangChain tools
 * @returns An array of LangChain tools
 */
export function createNuvolariLangTools() {
  return [
    getPoolsByRiskTool,
    // Add more tools here as needed
  ];
}