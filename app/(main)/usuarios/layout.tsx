import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Arceus · Usuários" };

export interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: Readonly<UserLayoutProps>) {
  return <>{children}</>;
}
