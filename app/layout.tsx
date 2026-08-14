import type { Metadata, Viewport } from "next";
import { fontInter } from "@/configs/font.config";
import Providers from "@/app/providers";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Arceus · Login",
  description:
    "Plataforma para monitoramento de requisições HTTP realizadas ao Arceus, exibição de métricas e dashboards.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-br"
      className={`dark bg-black h-full antialiased ${fontInter.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
