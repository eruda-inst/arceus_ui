import { ReactNode } from "react";
import type { Metadata } from "next";
import { inter } from "@/config/fonts";
import { Providers } from "@/ui/Providers/Providers";
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
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

RootLayout.displayName = "RootLayout";
