import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Brain, BookOpen, Star, Heart } from "lucide-react";
import type { MathProblem, MathSolution } from "@shared/schema";

interface SolutionViewerProps {
  problem: MathProblem | null;
  solution: MathSolution | null;
}

export default function SolutionViewer({ problem, solution }: SolutionViewerProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!problem || !solution) {
    return null;
  }

  const solutionData = solution.solution as any;
  const steps = solutionData?.steps || [];
  const explanation = solutionData?.explanation || "";
  const concepts = solutionData?.concepts || [];

  const confidenceColor = solution.confidence >= 90 ? 'text-green-400' : 
                         solution.confidence >= 75 ? 'text-yellow-400' : 'text-red-400';

  return (
    <Card className="glass-panel border-0 text-white">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="text-green-400" size={20} />
            Solution
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`${confidenceColor} border-current`}>
              <Brain size={12} className="mr-1" />
              {solution.confidence}% confident
            </Badge>
            {solution.timeToSolve && (
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                <Clock size={12} className="mr-1" />
                {(solution.timeToSolve / 1000).toFixed(1)}s
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Problem Summary */}
        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-primary">Problem</h3>
          <p className="text-gray-200">{problem.problemText}</p>
          <div className="flex gap-2 mt-2">
            <Badge className="bg-primary/20 text-primary">
              {problem.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
            <Badge variant="outline" className="border-white/20 text-gray-300">
              Difficulty: {problem.difficulty}/5
            </Badge>
          </div>
        </div>

        {/* Final Answer */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-green-400">Final Answer</h3>
          <p className="text-xl font-mono text-green-300">{solution.finalAnswer}</p>
        </div>

        {/* Step-by-Step Solution */}
        {steps.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-primary">Step-by-Step Solution</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-400 hover:text-white"
                data-testid="button-toggle-steps"
              >
                {isExpanded ? 'Collapse' : 'Expand'} Steps
              </Button>
            </div>
            {isExpanded && (
              <div className="space-y-4">
                {steps.map((step: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 border-l-4 border-primary/50 rounded-r-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        {step.step || index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-200 mb-2">{step.description}</p>
                        {step.formula && (
                          <div className="bg-gray-800 rounded p-2 mb-2">
                            <code className="text-blue-300 font-mono text-sm">{step.formula}</code>
                          </div>
                        )}
                        {step.result && (
                          <p className="text-primary font-medium">Result: {step.result}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Explanation */}
        {explanation && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-blue-400 flex items-center gap-2">
              <BookOpen size={16} />
              Explanation
            </h3>
            <p className="text-gray-200 leading-relaxed">{explanation}</p>
          </div>
        )}

        {/* Related Concepts */}
        {concepts.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2 text-purple-400">Related Concepts</h3>
            <div className="flex flex-wrap gap-2">
              {concepts.map((concept: string, index: number) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-purple-300 border-purple-300/20"
                >
                  {concept}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-white/10">
          <Button
            variant="outline"
            size="sm"
            className="glass-button text-white border-white/20"
            data-testid="button-save-favorite"
          >
            <Heart size={16} className="mr-2" />
            Save Favorite
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="glass-button text-white border-white/20"
            data-testid="button-practice-similar"
          >
            Practice Similar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}