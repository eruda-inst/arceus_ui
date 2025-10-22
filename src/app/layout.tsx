import { ReactNode } from "react";
import type { Metadata } from "next";
import { inter } from "@/utils/fonts";
import "@/app/globals.css";

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
        className={`${inter.className} antialiased bg-[var(--body-bg-light)] text-[var(--body-fg-light)] dark:bg-[var(--body-bg-dark)] dark:text-[var(--body-fg-dark)]`}
      >
        {children}
      </body>
    </html>
  );
}

RootLayout.displayName = "RootLayout";
