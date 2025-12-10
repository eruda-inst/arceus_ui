import { ReactNode } from "react";
import type { Metadata } from "next";
import { Header } from "@/ui/Header/Header";
import { Conteudo } from "@/ui/Conteudo/Conteudo";
import { Nav } from "@/ui/Nav/Nav";

export const metadata: Metadata = {
  title: "Absol",
  description: "Monitora requisições realizadas à API Aggregator.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <Header />
      <Nav />
      <Conteudo>{children}</Conteudo>
    </>
  );
}

RootLayout.displayName = "RootLayout";
