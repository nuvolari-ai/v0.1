// app/page.tsx
import { HydrateClient } from "@nuvolari/trpc/server";
import { MoodPage } from "./_components/mood-page";
import { Footer } from "@nuvolari/components/ui/footer";

export default async function Home() {
  return (
    <HydrateClient>
      <div className="flex flex-col h-screen">
        <div className="flex-grow overflow-auto">
          <MoodPage />
        </div>
        <Footer />
      </div>
    </HydrateClient>
  );
}