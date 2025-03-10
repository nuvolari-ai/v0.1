import "@nuvolari/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { type Metadata } from "next";
import { Providers } from "./_components/providers";
import { Footer } from "@nuvolari/components/ui/footer";

export const metadata: Metadata = {
  title: "NuvolariAI",
  description: "NuvolariAI",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>

      <div className="flex flex-col h-screen">
        <div className="flex-grow overflow-auto">
          {children}
        </div>
        <Footer />
      </div>
      </Providers>
      </body>
    </html>
  );
}
