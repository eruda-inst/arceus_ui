import type { Metadata } from "next";

export const metadata: Metadata = { title: "Arceus · Registros" };

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
