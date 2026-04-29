import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Absol · Registros",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
