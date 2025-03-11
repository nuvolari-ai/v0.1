import "@nuvolari/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { type Metadata } from "next";
import { Providers } from "./_components/providers";
import { MenuBar } from "./_components/menu-bar";

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

    <div className="h-full flex flex-col">
      <div className="w-full max-w-[720px] mx-auto px-4">
        <MenuBar />
      </div>
          {children}
          </div>
        </div>
      </div>
      </Providers>
      </body>
    </html>
  );
}
