import { useEffect } from "react";
import { useUIStore } from "../store/uiStore";

// Applies the current theme to <html> + <body> so Tailwind & CSS react.
export function useTheme() {
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === "light") {
      root.classList.add("light");
      body.classList.add("light");
    } else {
      root.classList.remove("light");
      body.classList.remove("light");
    }
  }, [theme]);

  return { theme, toggleTheme };
}
