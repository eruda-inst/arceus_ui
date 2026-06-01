import type { Metadata } from "next";
import { fontInter } from "@/configs/font.config";
import Providers from "@/app/providers";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Absol · Login",
  description:
    "Plataforma para monitoramento de requisições HTTP realizadas ao Arceus, exibição de métricas e dashboards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className="dark bg-black">
      <body className={`${fontInter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
