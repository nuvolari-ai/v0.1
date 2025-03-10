import { llmRouter } from "@nuvolari/server/api/routers/llm";
import { accountRouter } from "@nuvolari/server/api/routers/account";
import { createCallerFactory, createTRPCRouter } from "@nuvolari/server/api/trpc";
import { insightRouter } from "@nuvolari/server/api/routers/insights";
import { tokensRouter } from "@nuvolari/server/api/routers/tokens";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  llm: llmRouter,
  account: accountRouter,
  insight: insightRouter,
  tokens: tokensRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
