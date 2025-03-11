import { getOpportunitiesByRiskTool } from "../tools/quant";

/**
 * Creates and returns all Nuvolari LangChain tools
 * @returns An array of LangChain tools
 */
export function createNuvolariLangTools() {
  return [
    getOpportunitiesByRiskTool,
  ];
}