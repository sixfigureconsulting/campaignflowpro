import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { 
  Settings, 
  Check, 
  Palette, 
  Users, 
  DollarSign, 
  Globe, 
  LayoutGrid,
  Grid3X3,
  List,
  LayoutDashboard,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export type ThemeColor = "teal" | "blue" | "purple" | "orange" | "rose" | "emerald";
export type LayoutStyle = "grid" | "list" | "compact";
export type Currency = "USD" | "EUR" | "GBP" | "INR" | "AUD";
export type Language = "en" | "es" | "fr" | "de" | "pt";

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

const currencies = [
  { id: "USD" as Currency, label: "USD ($)", symbol: "$" },
  { id: "EUR" as Currency, label: "EUR (€)", symbol: "€" },
  { id: "GBP" as Currency, label: "GBP (£)", symbol: "£" },
  { id: "INR" as Currency, label: "INR (₹)", symbol: "₹" },
  { id: "AUD" as Currency, label: "AUD (A$)", symbol: "A$" },
];

const languages = [
  { id: "en" as Language, label: "English", flag: "🇺🇸" },
  { id: "es" as Language, label: "Español", flag: "🇪🇸" },
  { id: "fr" as Language, label: "Français", flag: "🇫🇷" },
  { id: "de" as Language, label: "Deutsch", flag: "🇩🇪" },
  { id: "pt" as Language, label: "Português", flag: "🇧🇷" },
];

const layouts = [
  { id: "grid" as LayoutStyle, label: "Card Grid", icon: Grid3X3 },
  { id: "list" as LayoutStyle, label: "List View", icon: List },
  { id: "compact" as LayoutStyle, label: "Compact", icon: LayoutDashboard },
];

const applyTheme = (themeId: ThemeColor) => {
  const theme = themes.find((t) => t.id === themeId);
  if (!theme) return;

  const root = document.documentElement;
  const hue = theme.hue;

  root.style.setProperty("--primary", `${hue} 61% 30%`);
  root.style.setProperty("--accent", `${hue} 61% 34%`);
  root.style.setProperty("--ring", `${hue} 61% 34%`);
  root.style.setProperty("--chart-1", `${hue} 61% 34%`);
  root.style.setProperty("--chart-2", `${hue} 70% 45%`);

  root.style.setProperty(
    "--gradient-primary",
    `linear-gradient(135deg, hsl(${hue} 61% 34%) 0%, hsl(${hue} 70% 45%) 100%)`
  );

  const shadowColor = `hsl(${hue} 61% 30%)`;
  root.style.setProperty("--shadow-sm", `0 1px 2px 0 ${shadowColor}10`);
  root.style.setProperty("--shadow-md", `0 4px 6px -1px ${shadowColor}15, 0 2px 4px -2px ${shadowColor}10`);
  root.style.setProperty("--shadow-lg", `0 10px 15px -3px ${shadowColor}18, 0 4px 6px -4px ${shadowColor}10`);
  root.style.setProperty("--shadow-xl", `0 20px 25px -5px ${shadowColor}20, 0 8px 10px -6px ${shadowColor}10`);
  root.style.setProperty("--glow-primary", `0 0 20px ${shadowColor}25`);

  localStorage.setItem("dashboard-theme", themeId);
};

export const ThemeSelector = () => {
  const { toast } = useToast();
  const [currentTheme, setCurrentTheme] = useState<ThemeColor>("teal");
  const [currentCurrency, setCurrentCurrency] = useState<Currency>("USD");
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");
  const [currentLayout, setCurrentLayout] = useState<LayoutStyle>("grid");

  useEffect(() => {
    const savedTheme = localStorage.getItem("dashboard-theme") as ThemeColor | null;
    const savedCurrency = localStorage.getItem("dashboard-currency") as Currency | null;
    const savedLanguage = localStorage.getItem("dashboard-language") as Language | null;
    const savedLayout = localStorage.getItem("dashboard-layout") as LayoutStyle | null;

    if (savedTheme && themes.some((t) => t.id === savedTheme)) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    }
    if (savedCurrency) setCurrentCurrency(savedCurrency);
    if (savedLanguage) setCurrentLanguage(savedLanguage);
    if (savedLayout) setCurrentLayout(savedLayout);
  }, []);

  const handleThemeChange = (themeId: ThemeColor) => {
    setCurrentTheme(themeId);
    applyTheme(themeId);
    toast({ title: "Theme updated", description: `Switched to ${themes.find(t => t.id === themeId)?.label}` });
  };

  const handleCurrencyChange = (currencyId: Currency) => {
    setCurrentCurrency(currencyId);
    localStorage.setItem("dashboard-currency", currencyId);
    toast({ title: "Currency updated", description: `Display currency set to ${currencyId}` });
  };

  const handleLanguageChange = (langId: Language) => {
    setCurrentLanguage(langId);
    localStorage.setItem("dashboard-language", langId);
    toast({ 
      title: "Language preference saved", 
      description: "Full translation support coming soon!" 
    });
  };

  const handleLayoutChange = (layoutId: LayoutStyle) => {
    setCurrentLayout(layoutId);
    localStorage.setItem("dashboard-layout", layoutId);
    toast({ 
      title: "Layout updated", 
      description: `Switched to ${layouts.find(l => l.id === layoutId)?.label}` 
    });
  };

  const handleInviteTeam = () => {
    toast({ 
      title: "Team invitations", 
      description: "Team collaboration feature coming soon!" 
    });
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
        {/* Theme Color */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <Palette className="mr-2 h-4 w-4" />
            Theme Color
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
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
                  {currentTheme === theme.id && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        {/* Layout Style */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <LayoutGrid className="mr-2 h-4 w-4" />
            Layout Style
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {layouts.map((layout) => (
                <DropdownMenuItem
                  key={layout.id}
                  onClick={() => handleLayoutChange(layout.id)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <layout.icon className="h-4 w-4" />
                    <span>{layout.label}</span>
                  </div>
                  {currentLayout === layout.id && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Currency */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <DollarSign className="mr-2 h-4 w-4" />
            Currency
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {currencies.map((currency) => (
                <DropdownMenuItem
                  key={currency.id}
                  onClick={() => handleCurrencyChange(currency.id)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span>{currency.label}</span>
                  {currentCurrency === currency.id && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        {/* Language */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <Globe className="mr-2 h-4 w-4" />
            Language
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.id}
                  onClick={() => handleLanguageChange(lang.id)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </div>
                  {currentLanguage === lang.id && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Invite Team */}
        <DropdownMenuItem onClick={handleInviteTeam} className="cursor-pointer">
          <Users className="mr-2 h-4 w-4" />
          Invite Team
          <span className="ml-auto text-xs text-muted-foreground">Soon</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
