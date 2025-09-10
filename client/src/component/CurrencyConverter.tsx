import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import CalcButton from "./CalcButton";

interface CurrencyConverterProps {
  onCalculation: (expression: string, result: string) => void;
}

interface ConversionResult {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  date: string;
}

const CURRENCIES = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "INR", name: "Indian Rupee" },
  { code: "BRL", name: "Brazilian Real" },
];

export default function CurrencyConverter({ onCalculation }: CurrencyConverterProps) {
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [result, setResult] = useState<ConversionResult | null>(null);
  const { toast } = useToast();

  const convertMutation = useMutation({
    mutationFn: async (data: { from: string; to: string; amount: number }) => {
      const response = await apiRequest("POST", "/api/currency/convert", data);
      return response.json();
    },
    onSuccess: (data: ConversionResult) => {
      setResult(data);
      onCalculation(
        `${data.amount} ${data.from}`,
        `${data.result.toFixed(2)} ${data.to}`
      );
      toast({
        title: "Conversion Successful",
        description: `${data.amount} ${data.from} = ${data.result.toFixed(2)} ${data.to}`,
      });
    },
    onError: () => {
      toast({
        title: "Conversion Failed",
        description: "Unable to fetch exchange rates. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleConvert = () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive number.",
        variant: "destructive",
      });
      return;
    }

    convertMutation.mutate({
      from: fromCurrency,
      to: toCurrency,
      amount: amountNum,
    });
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel rounded-3xl p-6 max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Currency Converter
      </h2>

      <div className="space-y-6">
        {/* Amount Input */}
        <div>
          <label className="block text-white font-medium mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black/20 border border-cyan-500/30 text-white text-xl font-mono focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none backdrop-blur-sm"
            placeholder="Enter amount"
            min="0"
            step="0.01"
            data-testid="input-amount"
          />
        </div>

        {/* Currency Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white font-medium mb-2">From</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/20 border border-cyan-500/30 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none backdrop-blur-sm"
              data-testid="select-from-currency"
            >
              {CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">To</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/20 border border-cyan-500/30 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none backdrop-blur-sm"
              data-testid="select-to-currency"
            >
              {CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <CalcButton
            onClick={swapCurrencies}
            className="flex-1 py-3 text-sm"
            data-testid="button-swap-currencies"
          >
            ⇄ Swap
          </CalcButton>
          <CalcButton
            onClick={handleConvert}
            variant="operator"
            className="flex-[2] py-4 text-lg"
            disabled={convertMutation.isPending}
            data-testid="button-convert"
          >
            {convertMutation.isPending ? "Converting..." : "Convert Currency"}
          </CalcButton>
        </div>

        {/* Result Display */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="display-screen rounded-2xl p-6 text-center"
        >
          {result ? (
            <div data-testid="conversion-result">
              <div className="text-white text-3xl font-mono">
                {result.amount} {result.from} = {result.result.toFixed(2)} {result.to}
              </div>
              <div className="text-gray-400 text-sm mt-2">
                Rate: 1 {result.from} = {result.rate.toFixed(6)} {result.to}
              </div>
              <div className="text-gray-500 text-xs mt-1">
                Updated: {new Date(result.date).toLocaleDateString()}
              </div>
            </div>
          ) : (
            <div className="text-white text-3xl font-mono" data-testid="conversion-placeholder">
              Ready to convert
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
