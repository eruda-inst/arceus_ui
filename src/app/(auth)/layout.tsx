import { ReactNode } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/app/components/PageHeader";
import { PageSidebar } from "@/app/components/PageSidebar";
import { SidebarTitle } from "@/app/components/SidebarTitle";
import { SidebarNav } from "@/app/components/SidebarNav";
import { PageContent } from "@/app/components/PageContent";
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
    <>
      <PageHeader />
      <PageSidebar>
        <SidebarTitle />
        <SidebarNav />
      </PageSidebar>
      <PageContent>{children}</PageContent>
    </>
  );
}

RootLayout.displayName = "RootLayout";
