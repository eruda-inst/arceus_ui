import { ReactNode } from "react";
import type { Metadata } from "next";
import { inter } from "@/utils/fonts";
import "@/app/globals.css";
import { Providers } from "@/app/provider";

export const metadata: Metadata = {
  title: "Aggregator · Monitor",
  description: "Monitora requisições realizadas à API Aggregator.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${inter.className} antialiased bg-body-bg-light text-text-light dark:bg-body-bg-dark dark:text-text-dark`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

RootLayout.displayName = "RootLayout";
