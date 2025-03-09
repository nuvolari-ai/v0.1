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