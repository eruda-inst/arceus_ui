import { ReactNode } from "react";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { inter } from "@/config/fonts";
import { Provedores } from "@/ui/Provedores/Provedores";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Absol",
  description: "Monitora requisições realizadas ao Arceus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${inter.className} antialiased`}>
        <Provedores>{children}</Provedores>
        <Toaster />
      </body>
    </html>
  );
}

RootLayout.displayName = "RootLayout";
