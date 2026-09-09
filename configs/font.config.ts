// Import the Inter font loader from Next.js's Google Fonts integration.
// This allows us to use the Inter typeface in our Next.js application with
// optimal performance (automatic self-hosting, preloading, etc.).
import { Inter } from "next/font/google";

/**
 * Configures and initializes the Inter font family for use throughout the app.
 * The configuration includes character subsets, font weights, display strategy,
 * a CSS custom property for styling, and fallback fonts.
 */
const fontInter = Inter({
  // Load only the Latin character subset to reduce bundle size.
  subsets: ["latin"],

  // Explicitly request all available weights (100–900) for flexibility.
  // This ensures we can use any weight (e.g., thin, regular, bold) without
  // additional network requests.
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],

  // Use 'swap' to display fallback text while the font loads,
  // preventing invisible text (FOIT) and improving perceived performance.
  display: "swap",

  // Define a CSS custom property (--font-inter) that can be used in styles
  // to apply this font family via CSS variables.
  variable: "--font-inter",

  // Provide generic fallback fonts in case the Inter font fails to load.
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

// Export the configured font instance so it can be used in layout files
// (e.g., in `_app.tsx` or `layout.tsx`) to apply the font globally.
export { fontInter };
