import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      aria-label="Toggle theme"
      className={cn(
        "transition-colors rounded-full border border-border shadow-md bg-background hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary flex items-center gap-2 px-4 py-2",
        "h-11 md:h-12 min-w-[70px] relative"
      )}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <span className="sr-only">Toggle theme</span>
      <span className="flex items-center gap-2">
        {theme === "dark" ? (
          <Moon className="text-blue-400 w-6 h-6" />
        ) : (
          <Sun className="text-yellow-400 w-6 h-6" />
        )}
        <span
          className={cn(
            "text-xs font-semibold transition-colors duration-300",
            theme === "dark" ? "text-blue-400" : "text-yellow-500"
          )}
        >
          {theme === "dark" ? "Dark" : "Light"}
        </span>
      </span>
    </button>
  );
}
