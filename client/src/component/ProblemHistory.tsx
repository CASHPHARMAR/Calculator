import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Calendar } from "lucide-react";
import type { MathProblem } from "@shared/schema";

interface ProblemHistoryProps {
  problems: MathProblem[];
  onSelectProblem: (problem: MathProblem) => void;
}

export default function ProblemHistory({ problems, onSelectProblem }: ProblemHistoryProps) {
  return (
    <div className="space-y-6">
      <Card className="glass-panel border-0 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="text-primary" size={20} />
            Problem History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {problems.length === 0 ? (
            <div className="text-center py-12">
              <History size={48} className="text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                No Problems Yet
              </h3>
              <p className="text-gray-400">
                Start solving problems to see your history here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {problems.map((problem, index) => (
                <div
                  key={index}
                  onClick={() => onSelectProblem(problem)}
                  className="bg-white/5 hover:bg-white/10 rounded-lg p-4 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-white font-medium line-clamp-2">{problem.problemText}</p>
                    <Badge className="bg-primary/20 text-primary ml-2">
                      {problem.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar size={14} />
                    <span>{new Date(problem.createdAt).toLocaleDateString()}</span>
                    <Badge variant="outline" className="border-white/20 text-gray-300">
                      Difficulty: {problem.difficulty}/5
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}