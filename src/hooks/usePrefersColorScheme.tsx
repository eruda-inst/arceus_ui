import { useState, useEffect } from "react";

type ColorScheme = "dark" | "light";
type UsePrefersColorSchemeReturn = ColorScheme;

export function usePrefersColorScheme(): UsePrefersColorSchemeReturn {
  const [prefersColorScheme, setPrefersColorScheme] =
    useState<ColorScheme>("light");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateColorScheme = () => {
      setPrefersColorScheme(mediaQuery.matches ? "dark" : "light");
    };

    updateColorScheme();

    const handleChange = (e: MediaQueryListEvent) => {
      updateColorScheme();
    };

    // Usando addEventListener que é mais moderno que addListener
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersColorScheme;
}
