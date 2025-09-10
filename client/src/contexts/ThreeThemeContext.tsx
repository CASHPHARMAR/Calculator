import { createContext, useContext, useState, useEffect } from "react";

export interface ThreeThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  particles: string;
  glow: string;
}

export interface AnimationSettings {
  speed: number;
  intensity: number;
  particleCount: number;
  particleSize: number;
}

export interface ThreeThemeConfig {
  name: string;
  colors: ThreeThemeColors;
  animations: AnimationSettings;
  patterns: 'default' | 'spiral' | 'wave' | 'chaos';
  effects: 'subtle' | 'moderate' | 'intense';
}

const DEFAULT_THEMES: Record<string, ThreeThemeConfig> = {
  neon: {
    name: "Neon Cyber",
    colors: {
      primary: "#00ffff",
      secondary: "#ff10f0", 
      accent: "#00ff41",
      particles: "#00ffff",
      glow: "#ff10f0"
    },
    animations: {
      speed: 1,
      intensity: 1,
      particleCount: 200,
      particleSize: 0.05
    },
    patterns: 'default',
    effects: 'moderate'
  },
  ocean: {
    name: "Ocean Depths",
    colors: {
      primary: "#1e40af",
      secondary: "#0891b2",
      accent: "#06b6d4",
      particles: "#0ea5e9",
      glow: "#3b82f6"
    },
    animations: {
      speed: 0.7,
      intensity: 0.8,
      particleCount: 150,
      particleSize: 0.04
    },
    patterns: 'wave',
    effects: 'subtle'
  },
  sunset: {
    name: "Sunset Glow",
    colors: {
      primary: "#f59e0b",
      secondary: "#ef4444",
      accent: "#ec4899",
      particles: "#f97316",
      glow: "#dc2626"
    },
    animations: {
      speed: 0.8,
      intensity: 1.2,
      particleCount: 180,
      particleSize: 0.06
    },
    patterns: 'spiral',
    effects: 'intense'
  },
  forest: {
    name: "Mystic Forest",
    colors: {
      primary: "#22c55e",
      secondary: "#10b981",
      accent: "#84cc16",
      particles: "#16a34a",
      glow: "#059669"
    },
    animations: {
      speed: 0.6,
      intensity: 0.9,
      particleCount: 120,
      particleSize: 0.03
    },
    patterns: 'chaos',
    effects: 'subtle'
  },
  galaxy: {
    name: "Deep Galaxy",
    colors: {
      primary: "#8b5cf6",
      secondary: "#a855f7",
      accent: "#c084fc",
      particles: "#9333ea",
      glow: "#7c3aed"
    },
    animations: {
      speed: 1.3,
      intensity: 1.5,
      particleCount: 300,
      particleSize: 0.04
    },
    patterns: 'spiral',
    effects: 'intense'
  }
};

interface ThreeThemeContextType {
  currentTheme: ThreeThemeConfig;
  availableThemes: Record<string, ThreeThemeConfig>;
  setTheme: (themeKey: string) => void;
  customizeTheme: (changes: Partial<ThreeThemeConfig>) => void;
  resetTheme: () => void;
}

const ThreeThemeContext = createContext<ThreeThemeContextType | undefined>(undefined);

export function ThreeThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThreeThemeConfig>(DEFAULT_THEMES.neon);
  const [availableThemes] = useState<Record<string, ThreeThemeConfig>>(DEFAULT_THEMES);

  // Load saved theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('three-theme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        // Try to find by preset key first
        if (parsedTheme.presetKey && availableThemes[parsedTheme.presetKey]) {
          setCurrentTheme(availableThemes[parsedTheme.presetKey]);
        } else {
          // Custom theme or legacy format
          setCurrentTheme(parsedTheme);
        }
      } catch (error) {
        console.warn('Failed to load saved theme:', error);
      }
    }
  }, [availableThemes]);

  const setTheme = (themeKey: string) => {
    if (availableThemes[themeKey]) {
      const newTheme = availableThemes[themeKey];
      setCurrentTheme(newTheme);
      localStorage.setItem('three-theme', JSON.stringify({ ...newTheme, presetKey: themeKey }));
    }
  };

  const customizeTheme = (changes: Partial<ThreeThemeConfig>) => {
    const customTheme: ThreeThemeConfig = {
      ...currentTheme,
      ...changes,
      name: changes.name || 'Custom',
      colors: { ...currentTheme.colors, ...changes.colors },
      animations: { ...currentTheme.animations, ...changes.animations }
    };
    setCurrentTheme(customTheme);
    localStorage.setItem('three-theme', JSON.stringify(customTheme));
  };

  const resetTheme = () => {
    setCurrentTheme(DEFAULT_THEMES.neon);
    localStorage.removeItem('three-theme');
  };

  return (
    <ThreeThemeContext.Provider
      value={{
        currentTheme,
        availableThemes,
        setTheme,
        customizeTheme,
        resetTheme
      }}
    >
      {children}
    </ThreeThemeContext.Provider>
  );
}

export function useThreeTheme() {
  const context = useContext(ThreeThemeContext);
  if (context === undefined) {
    throw new Error('useThreeTheme must be used within a ThreeThemeProvider');
  }
  return context;
}