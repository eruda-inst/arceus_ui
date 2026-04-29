import { Inter } from "next/font/google";

const fontInter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

export { fontInter };
