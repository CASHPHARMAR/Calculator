import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, X } from "lucide-react";

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { category: "Navigation", items: [
      { key: "Alt + 1", description: "Switch to Basic Calculator" },
      { key: "Alt + 2", description: "Switch to Scientific Calculator" },
      { key: "Alt + 3", description: "Switch to Currency Converter" },
      { key: "Alt + Y", description: "Toggle theme (Light/Dark)" },
    ]},
    { category: "Basic Operations", items: [
      { key: "0-9", description: "Enter numbers" },
      { key: ".", description: "Decimal point" },
      { key: "+", description: "Addition" },
      { key: "-", description: "Subtraction" },
      { key: "*", description: "Multiplication" },
      { key: "/", description: "Division" },
      { key: "=", description: "Calculate result" },
      { key: "Enter", description: "Calculate result" },
      { key: "Escape", description: "Clear all" },
      { key: "Backspace", description: "Delete last character" },
    ]},
    { category: "Scientific Functions", items: [
      { key: "S", description: "Sine" },
      { key: "C", description: "Cosine" },
      { key: "T", description: "Tangent" },
      { key: "Shift + S", description: "Arc sine" },
      { key: "Shift + C", description: "Arc cosine" },
      { key: "Shift + T", description: "Arc tangent" },
      { key: "Shift + H", description: "Hyperbolic cosine" },
      { key: "Shift + J", description: "Hyperbolic sine" },
      { key: "Shift + K", description: "Hyperbolic tangent" },
      { key: "Alt + S", description: "Inverse hyperbolic sine" },
      { key: "Alt + C", description: "Inverse hyperbolic cosine" },
      { key: "Alt + T", description: "Inverse hyperbolic tangent" },
      { key: "Q", description: "Square root" },
      { key: "R", description: "Square (x²)" },
      { key: "F", description: "Factorial" },
      { key: "Shift + 1", description: "Factorial (!)" },
      { key: "P", description: "Pi (π)" },
      { key: "E", description: "Euler's number (e)" },
      { key: "I", description: "Inverse (1/x)" },
      { key: "N", description: "Negate (+/-)" },
      { key: "^", description: "Power" },
      { key: "Alt + L", description: "Logarithm (log)" },
      { key: "Alt + N", description: "Natural logarithm (ln)" },
    ]},
  ];

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="glass-panel p-3 rounded-xl text-white hover:bg-white/10 transition-colors"
        data-testid="button-shortcuts"
        title="Keyboard Shortcuts"
      >
        <Keyboard size={20} />
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
                className="glass-panel rounded-3xl p-6 max-w-4xl max-h-[80vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Keyboard Shortcuts</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors p-1"
                    data-testid="button-close-shortcuts"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {shortcuts.map((category, index) => (
                    <div key={index} className="space-y-3">
                      <h3 className="text-lg font-semibold text-primary border-b border-primary/30 pb-1">
                        {category.category}
                      </h3>
                      <div className="space-y-2">
                        {category.items.map((shortcut, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <span className="bg-gray-800 px-2 py-1 rounded font-mono text-xs">
                              {shortcut.key}
                            </span>
                            <span className="text-gray-300 text-right ml-3 flex-1">
                              {shortcut.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-700 text-center">
                  <p className="text-sm text-gray-400">
                    💡 Note: Scientific functions work only in Scientific Calculator mode.
                    Currency converter input fields will override keyboard shortcuts when focused.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}