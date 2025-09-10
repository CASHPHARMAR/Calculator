import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Play, Pause, RotateCcw } from "lucide-react";

export default function StudySession() {
  return (
    <div className="space-y-6">
      <Card className="glass-panel border-0 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="text-primary" size={20} />
            Study Session
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Play size={48} className="text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              Start Your Study Session
            </h3>
            <p className="text-gray-400 mb-6">
              Begin a focused practice session to improve your math skills
            </p>
            <Button className="neon-button">
              <Play size={16} className="mr-2" />
              Start Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}