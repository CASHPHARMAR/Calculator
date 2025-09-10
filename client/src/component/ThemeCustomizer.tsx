import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, X, RotateCcw, Save } from "lucide-react";
import { useThreeTheme } from "@/contexts/ThreeThemeContext";
import { useToast } from "@/hooks/use-toast";

export default function ThemeCustomizer() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, availableThemes, setTheme, customizeTheme, resetTheme } = useThreeTheme();
  const { toast } = useToast();

  const handleThemeSelect = (themeKey: string) => {
    setTheme(themeKey);
    toast({
      title: "Theme Applied",
      description: `Switched to ${availableThemes[themeKey].name}`,
    });
  };

  const handleColorChange = (colorType: string, color: string) => {
    customizeTheme({
      colors: {
        ...currentTheme.colors,
        [colorType]: color
      }
    });
  };

  const handleAnimationChange = (animationType: string, value: number) => {
    customizeTheme({
      animations: {
        ...currentTheme.animations,
        [animationType]: value
      }
    });
  };

  const handlePatternChange = (pattern: 'default' | 'spiral' | 'wave' | 'chaos') => {
    customizeTheme({ patterns: pattern });
  };

  const handleEffectChange = (effect: 'subtle' | 'moderate' | 'intense') => {
    customizeTheme({ effects: effect });
  };

  const handleReset = () => {
    resetTheme();
    toast({
      title: "Theme Reset",
      description: "Theme has been reset to default",
    });
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="glass-panel p-3 rounded-xl text-white hover:bg-white/10 transition-colors"
        data-testid="button-theme-customizer"
        title="3D Theme Customizer"
      >
        <Palette size={20} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-panel rounded-3xl p-6 max-w-4xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">3D Theme Customizer</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleReset}
                      className="text-gray-400 hover:text-white transition-colors p-1"
                      title="Reset to default theme"
                      data-testid="button-reset-theme"
                    >
                      <RotateCcw size={20} />
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-gray-400 hover:text-white transition-colors p-1"
                      data-testid="button-close-customizer"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                {/* Preset Themes */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-primary mb-4">Preset Themes</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(availableThemes).map(([key, theme]) => (
                      <motion.button
                        key={key}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleThemeSelect(key)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          currentTheme.name === theme.name
                            ? 'border-primary bg-primary/10'
                            : 'border-gray-600 hover:border-gray-400'
                        }`}
                        data-testid={`theme-${key}`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex gap-1">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.secondary }} />
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
                          </div>
                        </div>
                        <h4 className="text-white font-medium text-sm">{theme.name}</h4>
                        <p className="text-gray-400 text-xs mt-1 capitalize">
                          {theme.patterns} • {theme.effects}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Color Customization */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-primary mb-4">Colors</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(currentTheme.colors).map(([colorType, color]) => (
                      <div key={colorType} className="space-y-2">
                        <label className="text-sm text-gray-300 capitalize">
                          {colorType.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={color}
                            onChange={(e) => handleColorChange(colorType, e.target.value)}
                            className="w-12 h-8 rounded border-0 bg-transparent cursor-pointer"
                            data-testid={`color-${colorType}`}
                          />
                          <input
                            type="text"
                            value={color}
                            onChange={(e) => handleColorChange(colorType, e.target.value)}
                            className="flex-1 px-3 py-1 rounded bg-gray-800 text-white text-sm font-mono"
                            data-testid={`color-input-${colorType}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Animation Settings */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-primary mb-4">Animation Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">
                        Speed: {currentTheme.animations.speed}x
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="3"
                        step="0.1"
                        value={currentTheme.animations.speed}
                        onChange={(e) => handleAnimationChange('speed', parseFloat(e.target.value))}
                        className="w-full"
                        data-testid="slider-speed"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">
                        Intensity: {currentTheme.animations.intensity}x
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.1"
                        value={currentTheme.animations.intensity}
                        onChange={(e) => handleAnimationChange('intensity', parseFloat(e.target.value))}
                        className="w-full"
                        data-testid="slider-intensity"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">
                        Particle Count: {currentTheme.animations.particleCount}
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="500"
                        step="25"
                        value={currentTheme.animations.particleCount}
                        onChange={(e) => handleAnimationChange('particleCount', parseInt(e.target.value))}
                        className="w-full"
                        data-testid="slider-particles"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">
                        Particle Size: {currentTheme.animations.particleSize}
                      </label>
                      <input
                        type="range"
                        min="0.01"
                        max="0.1"
                        step="0.005"
                        value={currentTheme.animations.particleSize}
                        onChange={(e) => handleAnimationChange('particleSize', parseFloat(e.target.value))}
                        className="w-full"
                        data-testid="slider-particle-size"
                      />
                    </div>
                  </div>
                </div>

                {/* Pattern Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-primary mb-4">Animation Pattern</h3>
                  <div className="flex flex-wrap gap-2">
                    {(['default', 'spiral', 'wave', 'chaos'] as const).map((pattern) => (
                      <button
                        key={pattern}
                        onClick={() => handlePatternChange(pattern)}
                        className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                          currentTheme.patterns === pattern
                            ? 'bg-primary text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                        data-testid={`pattern-${pattern}`}
                      >
                        {pattern}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Effect Intensity */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-primary mb-4">Effect Intensity</h3>
                  <div className="flex flex-wrap gap-2">
                    {(['subtle', 'moderate', 'intense'] as const).map((effect) => (
                      <button
                        key={effect}
                        onClick={() => handleEffectChange(effect)}
                        className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                          currentTheme.effects === effect
                            ? 'bg-primary text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                        data-testid={`effect-${effect}`}
                      >
                        {effect}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-center text-sm text-gray-400">
                  💡 Changes are saved automatically. The 3D background will update in real-time.
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}