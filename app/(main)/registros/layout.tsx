import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Arceus · Registros" };

export interface LogLayoutProps {
  children: ReactNode;
}

export default function LogLayout({ children }: Readonly<LogLayoutProps>) {
  return <>{children}</>;
}
