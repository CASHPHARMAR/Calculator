import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ThreeBackground from "@/components/ThreeBackground";
import ProblemInput from "../components/ProblemInput";
import SolutionViewer from "../components/SolutionViewer";
import ProgressTracker from "../components/ProgressTracker";
import StudySession from "../components/StudySession";
import ProblemHistory from "../components/ProblemHistory";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import ThemeCustomizer from "@/components/ThemeCustomizer";
import { useTheme } from "@/components/ThemeProvider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calculator, TrendingUp, History, Star, Brain, Zap } from "lucide-react";
import type { MathProblem, MathSolution } from "@shared/schema";

type ActiveTab = 'solve' | 'progress' | 'history' | 'study';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('solve');
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [currentSolution, setCurrentSolution] = useState<MathSolution | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch recent problems
  const { data: recentProblems = [] } = useQuery({
    queryKey: ['/api/problems'],
    queryFn: async () => {
      const response = await fetch('/api/problems');
      if (!response.ok) throw new Error('Failed to fetch problems');
      return response.json() as Promise<MathProblem[]>;
    },
  });

  // Fetch user progress  
  const { data: userProgress = [] } = useQuery({
    queryKey: ['/api/progress'],
    queryFn: async () => {
      const response = await fetch('/api/progress');
      if (!response.ok) throw new Error('Failed to fetch progress');
      return response.json() as Promise<any[]>;
    },
  });

  // Solve problem mutation
  const solveProblemMutation = useMutation({
    mutationFn: async (problemData: {
      problemText: string;
      category: string;
      difficulty: number;
      imageData?: string;
    }) => {
      const response = await fetch('/api/problems/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(problemData),
      });
      if (!response.ok) throw new Error('Failed to solve problem');
      return response.json() as Promise<{ problem: MathProblem; solution: MathSolution }>;
    },
    onSuccess: (data) => {
      setCurrentProblem(data.problem);
      setCurrentSolution(data.solution);
      queryClient.invalidateQueries({ queryKey: ['/api/problems'] });
      queryClient.invalidateQueries({ queryKey: ['/api/progress'] });
      toast({
        title: "Problem Solved!",
        description: "Your solution is ready with step-by-step explanation.",
      });
    },
    onError: (error) => {
      console.error('Error solving problem:', error);
      toast({
        title: "Solution Failed",
        description: "Unable to solve the problem. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSolveProblem = async (problemData: {
    problemText: string;
    category: string;
    difficulty: number;
    imageData?: string;
  }) => {
    setIsLoading(true);
    try {
      await solveProblemMutation.mutateAsync(problemData);
    } finally {
      setIsLoading(false);
    }
  };

  const tabConfig = {
    solve: {
      icon: Brain,
      label: "AI Solver",
      description: "Solve math problems with AI-powered explanations",
    },
    progress: {
      icon: TrendingUp,
      label: "Progress",
      description: "Track your learning progress and achievements",
    },
    history: {
      icon: History,
      label: "History",
      description: "Review previously solved problems",
    },
    study: {
      icon: BookOpen,
      label: "Study",
      description: "Organized study sessions and practice",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden relative">
      {/* 3D Background */}
      <ThreeBackground />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-6 backdrop-blur-md bg-white/5 border-b border-white/10">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold text-white font-mono tracking-wide"
          >
            <span className="text-primary">3D</span> Math Solver
          </motion.h1>
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <KeyboardShortcuts />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ThemeCustomizer />
            </motion.div>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="neon-button px-4 py-2 rounded-lg text-white font-medium"
              data-testid="button-theme-toggle"
            >
              {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
            </motion.button>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="flex justify-center mb-6 p-4">
          <div className="glass-panel rounded-2xl p-2">
            <div className="flex gap-2">
              {Object.entries(tabConfig).map(([key, config]) => {
                const Icon = config.icon;
                const isActive = activeTab === key;
                return (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(key as ActiveTab)}
                    className={`
                      flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300
                      ${isActive 
                        ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }
                    `}
                    data-testid={`tab-${key}`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{config.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 px-6 pb-6">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'solve' && (
                <motion.div
                  key="solve"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  {/* Problem Input Section */}
                  <div className="space-y-6">
                    <Card className="glass-panel border-0 text-white">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calculator className="text-primary" size={20} />
                          Problem Input
                        </CardTitle>
                        <CardDescription className="text-gray-300">
                          Enter your math problem or upload an image
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ProblemInput 
                          onSolve={handleSolveProblem}
                          isLoading={isLoading}
                        />
                      </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="glass-panel border-0 text-white">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Zap className="text-primary" size={16} />
                            <span className="text-sm text-gray-300">Problems Solved</span>
                          </div>
                          <p className="text-2xl font-bold mt-1">{Array.isArray(recentProblems) ? recentProblems.length : 0}</p>
                        </CardContent>
                      </Card>
                      <Card className="glass-panel border-0 text-white">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2">
                            <Star className="text-yellow-400" size={16} />
                            <span className="text-sm text-gray-300">AI Confidence</span>
                          </div>
                          <p className="text-2xl font-bold mt-1">
                            {currentSolution ? `${currentSolution.confidence}%` : '---'}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Solution Display Section */}
                  <div className="space-y-6">
                    {currentSolution ? (
                      <SolutionViewer 
                        problem={currentProblem}
                        solution={currentSolution}
                      />
                    ) : (
                      <Card className="glass-panel border-0 text-white h-full">
                        <CardContent className="flex items-center justify-center h-full min-h-[400px]">
                          <div className="text-center">
                            <Brain size={64} className="text-gray-500 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-300 mb-2">
                              Ready to Solve
                            </h3>
                            <p className="text-gray-400">
                              Enter a math problem to see the AI-powered solution with step-by-step explanations
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'progress' && (
                <motion.div
                  key="progress"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ProgressTracker progress={userProgress} />
                </motion.div>
              )}

              {activeTab === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ProblemHistory 
                    problems={recentProblems}
                    onSelectProblem={(problem: MathProblem) => setCurrentProblem(problem)}
                  />
                </motion.div>
              )}

              {activeTab === 'study' && (
                <motion.div
                  key="study"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <StudySession />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}