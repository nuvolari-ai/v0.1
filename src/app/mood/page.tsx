import { HydrateClient } from "@nuvolari/trpc/server";
import { MoodPage } from "./_components/mood-page";

export default async function Home() {
  return (
    <HydrateClient>
      <MoodPage />
    </HydrateClient>
  );
}
