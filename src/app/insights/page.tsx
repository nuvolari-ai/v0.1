import { HydrateClient } from "@nuvolari/trpc/server";
import { InsightsPage } from "./_components/insights-page";

export default async function Home() {
  return (
    <HydrateClient>
      <InsightsPage />
    </HydrateClient>
  );
}
