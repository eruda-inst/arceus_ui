import { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import clsx from "clsx";
import Providers from "@/app/providers";
import { fontInter } from "@/configs/font.config";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Arceus · Login",
  description: "Plataforma para monitoramento de requisições HTTP.",
};

export const viewport: Viewport = { themeColor: "#000" };

export interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html
      lang="pt-br"
      suppressHydrationWarning
      className={clsx(
        "bg-white dark:bg-black text-gray-800 dark:text-gray-200 h-full antialiased",
        fontInter.className,
      )}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
