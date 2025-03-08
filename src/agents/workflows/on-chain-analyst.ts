import { pull } from "langchain/hub";
import { type ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createStructuredChatAgent } from "langchain/agents";

import { getOnChainTools } from "@goat-sdk/adapter-langchain";
import { viem } from "@goat-sdk/wallet-viem";

import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sonic } from "viem/chains";

import { nuvolariQuantPlugin } from "../plugins/quant";


/**
* On-Chain Data Analyst Workflow
* @param chainName The blockchain to analyze
* @param walletAddress The wallet address to analyze
* @param privateKey Optional private key for authenticated requests
* @returns Analysis results as a string
*/

async function analyzeOnChainData(
 chainName: "sonic",
 walletAddress: string,
 privateKey: string
): Promise<string> {
 const account = privateKeyToAccount(privateKey as `0x${string}`);
 const walletClient = createWalletClient({
   account: account,
   transport: http(),
   chain: sonic
 });

 // Initialize GOAT tools with wallet and plugins
 const tools = await getOnChainTools({
   // @ts-ignore
   wallet: viem(walletClient),
   plugins: [
    nuvolariQuantPlugin()
   ]
 });

 // Set up the LLM
 const llm = new ChatOpenAI({
   model: "gpt-4o",
   temperature: 0.2,
 });

 // Get a prompt from LangChain Hub
 const prompt = await pull<ChatPromptTemplate>("hwchase17/structured-chat-agent");

 // Create an agent with the tools
 const agent = await createStructuredChatAgent({
   llm,
   tools,
   prompt
 });

 // Create an executor for the agent
 const agentExecutor = new AgentExecutor({
   agent,
   tools,
   verbose: false, // Set to true for debugging
 });

 // Define the analysis task based on the wallet address
 const task = `
You are an On-Chain Data Analyst specialized in DeFi. Analyze the wallet at ${walletAddress} on ${chainName}.
Provide a comprehensive report with the following insights:

1. Wallet Balance Analysis:
  - Check the wallet's current token balances
  - Identify significant holdings

2. Token Movement Analysis:
  - Detect any recent significant token movements
  - Identify patterns in transaction history

3. DEX Interaction Analysis:
  - Check if this address interacts with major DEXes
  - Estimate trading volume and frequency
  - Identify preferred trading pairs

4. Smart Contract Risk Analysis:
  - Analyze smart contract interactions
  - Identify any interactions with risky or flagged contracts
  - Evaluate security posture based on interaction patterns

5. DeFi Position Analysis:
  - Monitor for signs of liquidation risks
  - Identify active lending/borrowing positions
  - Calculate health factors where possible

6. Whale Classification:
  - Determine if this is a whale wallet based on holdings
  - Analyze influence on specific tokens

Compile your findings into a well-structured, detailed report with sections for each area of analysis.
`;

 // Execute the agent
 const result = await agentExecutor.invoke({
   input: task
 });

 // Return the result
 return result.output as string;
}




