import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Trophy, Zap } from "lucide-react";
import type { UserProgress } from "@shared/schema";

interface ProgressTrackerProps {
  progress: UserProgress[];
}

export default function ProgressTracker({ progress }: ProgressTrackerProps) {
  return (
    <div className="space-y-6">
      <Card className="glass-panel border-0 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="text-primary" size={20} />
            Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {progress.map((item, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-white capitalize">
                    {item.category.replace('-', ' ')}
                  </h3>
                  <Badge className="bg-primary/20 text-primary">
                    Level {item.skillLevel}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm text-gray-300 mb-1">
                      <span>Problems Solved</span>
                      <span>{item.problemsSolved}</span>
                    </div>
                    <Progress 
                      value={(item.problemsSolved / 100) * 100} 
                      className="h-2" 
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-300 mb-1">
                      <span>Accuracy</span>
                      <span>{Math.round((item.correctAnswers / Math.max(item.problemsSolved, 1)) * 100)}%</span>
                    </div>
                    <Progress 
                      value={(item.correctAnswers / Math.max(item.problemsSolved, 1)) * 100} 
                      className="h-2" 
                    />
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300 flex items-center gap-1">
                      <Zap size={12} />
                      Current Streak
                    </span>
                    <span className="text-yellow-400 font-medium">
                      {item.currentStreak}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}