import { ReactNode } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/ui/PageHeader/PageHeader";
import { PageContent } from "@/ui/PageContent/PageContent";
import { Nav } from "@/ui/Nav/Nav";

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
    <>
      <PageHeader />
      <Nav />
      <PageContent>{children}</PageContent>
    </>
  );
}

RootLayout.displayName = "RootLayout";
