import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, Check, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

export type ThemeColor = "teal" | "blue" | "purple" | "orange" | "rose" | "emerald";

interface ThemeOption {
  id: ThemeColor;
  label: string;
  preview: string;
  hue: string;
}

const themes: ThemeOption[] = [
  { id: "teal", label: "Teal", preview: "bg-teal-500", hue: "185" },
  { id: "blue", label: "Ocean Blue", preview: "bg-blue-500", hue: "217" },
  { id: "purple", label: "Royal Purple", preview: "bg-purple-500", hue: "270" },
  { id: "orange", label: "Sunset Orange", preview: "bg-orange-500", hue: "25" },
  { id: "rose", label: "Rose Pink", preview: "bg-rose-500", hue: "350" },
  { id: "emerald", label: "Emerald", preview: "bg-emerald-500", hue: "160" },
];

const applyTheme = (themeId: ThemeColor) => {
  const theme = themes.find((t) => t.id === themeId);
  if (!theme) return;

  const root = document.documentElement;
  const hue = theme.hue;

  // Update CSS variables based on selected theme
  root.style.setProperty("--primary", `${hue} 61% 30%`);
  root.style.setProperty("--accent", `${hue} 61% 34%`);
  root.style.setProperty("--ring", `${hue} 61% 34%`);
  root.style.setProperty("--chart-1", `${hue} 61% 34%`);
  root.style.setProperty("--chart-2", `${hue} 70% 45%`);

  // Update gradient
  root.style.setProperty(
    "--gradient-primary",
    `linear-gradient(135deg, hsl(${hue} 61% 34%) 0%, hsl(${hue} 70% 45%) 100%)`
  );

  // Update shadows with theme color
  const shadowColor = `hsl(${hue} 61% 30%)`;
  root.style.setProperty(
    "--shadow-sm",
    `0 1px 2px 0 ${shadowColor}10`
  );
  root.style.setProperty(
    "--shadow-md",
    `0 4px 6px -1px ${shadowColor}15, 0 2px 4px -2px ${shadowColor}10`
  );
  root.style.setProperty(
    "--shadow-lg",
    `0 10px 15px -3px ${shadowColor}18, 0 4px 6px -4px ${shadowColor}10`
  );
  root.style.setProperty(
    "--shadow-xl",
    `0 20px 25px -5px ${shadowColor}20, 0 8px 10px -6px ${shadowColor}10`
  );

  // Update glow
  root.style.setProperty("--glow-primary", `0 0 20px ${shadowColor}25`);

  // Store in localStorage
  localStorage.setItem("dashboard-theme", themeId);
};

export const ThemeSelector = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeColor>("teal");

  useEffect(() => {
    const saved = localStorage.getItem("dashboard-theme") as ThemeColor | null;
    if (saved && themes.some((t) => t.id === saved)) {
      setCurrentTheme(saved);
      applyTheme(saved);
    }
  }, []);

  const handleThemeChange = (themeId: ThemeColor) => {
    setCurrentTheme(themeId);
    applyTheme(themeId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-background/50 backdrop-blur hover:bg-background"
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Theme Color
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className={cn("w-4 h-4 rounded-full", theme.preview)} />
              <span>{theme.label}</span>
            </div>
            {currentTheme === theme.id && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
