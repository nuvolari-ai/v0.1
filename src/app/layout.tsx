import "@nuvolari/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { type Metadata } from "next";
import { Providers } from "./_components/providers";
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
          {children}
        </Providers>
      </body>
    </html>
  );
}
