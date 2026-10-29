import { useCallback, useState } from "react";

function readTheme(): boolean {
  try {
    return localStorage.getItem("assina-theme") !== "light";
  } catch {
    return true;
  }
}

export function useTheme() {
  const [darkMode, setDarkMode] = useState(readTheme);

  const toggleTheme = useCallback(() => {
    setDarkMode((current) => {
      const next = !current;
      try {
        localStorage.setItem("assina-theme", next ? "dark" : "light");
      } catch {
        // storage unavailable
      }
      return next;
    });
  }, []);

  return { darkMode, toggleTheme } as const;
}
