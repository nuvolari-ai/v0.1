import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { createNuvolariLangTools } from "./create-nuvolari-tools";

/**
 * Create a LangGraph agent with Nuvolari tools
 * @param apiKey OpenAI API key
 * @returns A compiled LangGraph agent
 */
export async function createLangGraphAgent(apiKey: string) {
  // Initialize the LLM
  const llm = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0,
    openAIApiKey: apiKey,
  });

  // Get all Nuvolari tools
  const tools = createNuvolariLangTools();

  // Create a ReAct agent with our tools
  const agent = await createReactAgent({
    llm,
    tools,
    // Optional system message to provide additional context or instructions
    prompt: `You are a financial analysis assistant that helps users find investment pools based on risk profiles.
            When the user wants to find pools with specific risk characteristics, use the get_pools_by_risk tool to retrieve appropriate options.
            Risk scores range from 1 (lowest risk) to 5 (highest risk).`
  });

  // Compile the agent
  return agent;
}