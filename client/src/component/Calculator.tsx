import { useState, forwardRef, useImperativeHandle } from "react";
import { motion } from "framer-motion";
import CalcButton from "./CalcButton";
import { useToast } from "@/hooks/use-toast";

interface CalculatorProps {
  onCalculation: (expression: string, result: string) => void;
}

export interface CalculatorRef {
  handleNumber: (num: string) => void;
  handleOperator: (op: string) => void;
  handleClear: () => void;
  handleBackspace: () => void;
  handleEquals: () => void;
}

const Calculator = forwardRef<CalculatorRef, CalculatorProps>(({ onCalculation }, ref) => {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  const { toast } = useToast();

  const appendToDisplay = (value: string) => {
    if (shouldResetDisplay) {
      setDisplay(value);
      setShouldResetDisplay(false);
    } else {
      setDisplay(prev => prev === "0" ? value : prev + value);
    }
  };

  const handleNumber = (num: string) => {
    appendToDisplay(num);
  };

  const handleOperator = (op: string) => {
    setExpression(display + " " + op + " ");
    setShouldResetDisplay(true);
  };

  const handleClear = () => {
    setDisplay("0");
    setExpression("");
    setShouldResetDisplay(false);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(prev => prev.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const handleEquals = () => {
    try {
      const fullExpression = expression + display;
      const result = evaluateExpression(fullExpression);
      setDisplay(result.toString());
      setExpression("");
      setShouldResetDisplay(true);
      onCalculation(fullExpression, result.toString());
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid calculation",
        variant: "destructive",
      });
      handleClear();
    }
  };

  // Expose handler functions to parent via ref
  useImperativeHandle(ref, () => ({
    handleNumber,
    handleOperator,
    handleClear,
    handleBackspace,
    handleEquals,
  }));

  const evaluateExpression = (expr: string): number => {
    // Replace display operators with JS operators
    const jsExpression = expr
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/−/g, "-");
    
    // Basic validation
    if (!/^[0-9+\-*/.() ]+$/.test(jsExpression)) {
      throw new Error("Invalid expression");
    }
    
    // Use Function constructor for safer evaluation
    const result = new Function("return " + jsExpression)();
    
    if (isNaN(result) || !isFinite(result)) {
      throw new Error("Invalid result");
    }
    
    return Math.round(result * 100000000) / 100000000; // Round to 8 decimal places
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel rounded-3xl p-6 max-w-md mx-auto"
    >
      {/* Display Screen */}
      <div className="display-screen rounded-2xl p-6 mb-6 text-right">
        <div className="text-sm text-gray-400 h-6 overflow-hidden">
          {expression}
        </div>
        <div className="text-4xl text-white font-mono mt-2" data-testid="display-result">
          {display}
        </div>
      </div>

      {/* Calculator Buttons */}
      <div className="grid grid-cols-4 gap-3">
        {/* Row 1 */}
        <CalcButton
          onClick={handleClear}
          variant="operator"
          className="col-span-2 py-4"
          data-testid="button-clear"
        >
          Clear
        </CalcButton>
        <CalcButton
          onClick={handleBackspace}
          variant="operator"
          className="py-4"
          data-testid="button-backspace"
        >
          ⌫
        </CalcButton>
        <CalcButton
          onClick={() => handleOperator("÷")}
          variant="operator"
          className="py-4"
          data-testid="button-divide"
        >
          ÷
        </CalcButton>

        {/* Row 2 */}
        <CalcButton onClick={() => handleNumber("7")} className="py-4 text-lg" data-testid="button-7">7</CalcButton>
        <CalcButton onClick={() => handleNumber("8")} className="py-4 text-lg" data-testid="button-8">8</CalcButton>
        <CalcButton onClick={() => handleNumber("9")} className="py-4 text-lg" data-testid="button-9">9</CalcButton>
        <CalcButton
          onClick={() => handleOperator("×")}
          variant="operator"
          className="py-4"
          data-testid="button-multiply"
        >
          ×
        </CalcButton>

        {/* Row 3 */}
        <CalcButton onClick={() => handleNumber("4")} className="py-4 text-lg" data-testid="button-4">4</CalcButton>
        <CalcButton onClick={() => handleNumber("5")} className="py-4 text-lg" data-testid="button-5">5</CalcButton>
        <CalcButton onClick={() => handleNumber("6")} className="py-4 text-lg" data-testid="button-6">6</CalcButton>
        <CalcButton
          onClick={() => handleOperator("−")}
          variant="operator"
          className="py-4"
          data-testid="button-subtract"
        >
          −
        </CalcButton>

        {/* Row 4 */}
        <CalcButton onClick={() => handleNumber("1")} className="py-4 text-lg" data-testid="button-1">1</CalcButton>
        <CalcButton onClick={() => handleNumber("2")} className="py-4 text-lg" data-testid="button-2">2</CalcButton>
        <CalcButton onClick={() => handleNumber("3")} className="py-4 text-lg" data-testid="button-3">3</CalcButton>
        <CalcButton
          onClick={() => handleOperator("+")}
          variant="operator"
          className="py-4"
          data-testid="button-add"
        >
          +
        </CalcButton>

        {/* Row 5 */}
        <CalcButton onClick={() => handleNumber("0")} className="col-span-2 py-4 text-lg" data-testid="button-0">0</CalcButton>
        <CalcButton onClick={() => handleNumber(".")} className="py-4 text-lg" data-testid="button-decimal">.</CalcButton>
        <CalcButton
          onClick={handleEquals}
          variant="equals"
          className="py-4"
          data-testid="button-equals"
        >
          =
        </CalcButton>
      </div>
    </motion.div>
  );
});

Calculator.displayName = "Calculator";

export default Calculator;
