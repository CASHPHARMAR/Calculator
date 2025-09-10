import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CalcButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  variant?: "default" | "operator" | "equals";
  disabled?: boolean;
  "data-testid"?: string;
}

export default function CalcButton({
  children,
  onClick,
  className,
  variant = "default",
  disabled = false,
  "data-testid": testId,
}: CalcButtonProps) {
  const baseClasses = "neon-button text-white font-semibold rounded-xl transition-all duration-300";
  
  const variantClasses = {
    default: "",
    operator: "operator-button",
    equals: "operator-button text-xl",
  };

  return (
    <motion.button
      data-testid={testId}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95, y: 0 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        variantClasses[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17,
      }}
    >
      {children}
    </motion.button>
  );
}
