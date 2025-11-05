import { ReactNode } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/app/components/PageHeader";
import { PageContent } from "@/app/components/PageContent";
import { Nav } from "@/app/components/Nav";

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
