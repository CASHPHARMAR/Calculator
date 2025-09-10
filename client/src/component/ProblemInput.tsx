import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Camera, Type, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { mathCategories } from "@shared/schema";

interface ProblemInputProps {
  onSolve: (data: {
    problemText: string;
    category: string;
    difficulty: number;
    imageData?: string;
  }) => void;
  isLoading: boolean;
}

export default function ProblemInput({ onSolve, isLoading }: ProblemInputProps) {
  const [problemText, setProblemText] = useState("");
  const [category, setCategory] = useState<string>("algebra");
  const [difficulty, setDifficulty] = useState(1);
  const [imageData, setImageData] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        const base64Data = base64.split(',')[1]; // Remove data:image/...;base64, prefix
        setImageData(base64Data);
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSolve = () => {
    if (!problemText.trim() && !imageData) {
      return;
    }

    onSolve({
      problemText: problemText.trim(),
      category,
      difficulty,
      imageData: imageData || undefined,
    });
  };

  const difficultyLabels = {
    1: "Elementary",
    2: "Intermediate", 
    3: "Advanced",
    4: "Expert",
    5: "Research"
  };

  return (
    <div className="space-y-6">
      {/* Problem Text Input */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-white">
          <Type size={16} />
          Math Problem Description
        </Label>
        <Textarea
          placeholder="Enter your math problem here... (e.g., 'Solve for x: 2x + 5 = 15' or 'Find the derivative of x²')"
          value={problemText}
          onChange={(e) => setProblemText(e.target.value)}
          className="glass-input min-h-[120px] text-white placeholder-gray-400 bg-white/5 border-white/20"
          data-testid="input-problem-text"
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-white">
          <Camera size={16} />
          Upload Problem Image (Optional)
        </Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="glass-button text-white border-white/20"
            data-testid="button-upload-image"
          >
            <Upload size={16} className="mr-2" />
            Choose Image
          </Button>
          {imagePreview && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setImageData("");
                setImagePreview("");
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="glass-button text-red-300 border-red-300/20"
              data-testid="button-remove-image"
            >
              Remove
            </Button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          data-testid="file-input-image"
        />
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-2"
          >
            <img
              src={imagePreview}
              alt="Problem preview"
              className="max-w-full h-40 object-contain rounded-lg border border-white/20"
              data-testid="image-preview"
            />
          </motion.div>
        )}
      </div>

      {/* Category and Difficulty */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-white">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="glass-input text-white border-white/20" data-testid="select-category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {mathCategories.map((cat) => (
                <SelectItem key={cat} value={cat} className="text-white hover:bg-gray-700">
                  {cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-white">Difficulty</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((level) => (
              <Button
                key={level}
                type="button"
                variant={difficulty === level ? "default" : "outline"}
                size="sm"
                onClick={() => setDifficulty(level)}
                className={`
                  flex-1 text-xs transition-all
                  ${difficulty === level 
                    ? 'bg-primary text-white' 
                    : 'glass-button text-gray-300 border-white/20'
                  }
                `}
                data-testid={`difficulty-${level}`}
              >
                {level}
              </Button>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center">
            {difficultyLabels[difficulty as keyof typeof difficultyLabels]}
          </p>
        </div>
      </div>

      {/* Solve Button */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          onClick={handleSolve}
          disabled={(!problemText.trim() && !imageData) || isLoading}
          className="w-full neon-button text-white font-semibold py-3 text-lg"
          data-testid="button-solve"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Solving Problem...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Zap size={20} />
              Solve with AI
            </div>
          )}
        </Button>
      </motion.div>

      {/* Hints */}
      <div className="text-xs text-gray-400 space-y-1">
        <p>💡 <strong>Tips:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Be specific in your problem description</li>
          <li>Upload clear images of handwritten problems</li>
          <li>Select the appropriate category for better results</li>
          <li>Higher difficulty may take longer to solve</li>
        </ul>
      </div>
    </div>
  );
}