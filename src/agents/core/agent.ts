import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { createNuvolariLangTools } from "./create-nuvolari-tools";
import { systemPrompt } from "./_prompts/system";

const agentTools = [
  ...createNuvolariLangTools(),
];

/**
 * Create a LangGraph agent with Nuvolari tools
 * @param apiKey OpenAI API key
 * @returns A compiled LangGraph agent
 */
export async function createLangGraphAgent(apiKey: string) {
    const llm = new ChatOpenAI({
      modelName: "gpt-4o",
      temperature: 0,
      openAIApiKey: apiKey,
    });
    
    const agent = await createReactAgent({
      llm,
      tools: agentTools,
    });
    return systemPrompt.pipe(agent)
}


export type NuvolariAgent = Awaited<ReturnType<typeof createLangGraphAgent>>;
