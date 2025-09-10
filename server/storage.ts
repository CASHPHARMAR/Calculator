import { 
  type MathProblem, 
  type InsertMathProblem,
  type MathSolution,
  type InsertMathSolution,
  type StudySession,
  type InsertStudySession,
  type UserProgress,
  type InsertUserProgress,
  type ProblemAttempt,
  type InsertProblemAttempt 
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Math Problems
  createProblem(problem: InsertMathProblem): Promise<MathProblem>;
  getRecentProblems(limit: number): Promise<MathProblem[]>;
  getFavoriteProblems(): Promise<MathProblem[]>;
  updateProblemFavorite(problemId: string, isFavorite: boolean): Promise<void>;

  // Math Solutions
  createSolution(solution: InsertMathSolution): Promise<MathSolution>;
  getSolution(problemId: string): Promise<MathSolution | null>;

  // Study Sessions
  createStudySession(session: InsertStudySession): Promise<StudySession>;
  getStudySessions(): Promise<StudySession[]>;

  // User Progress
  getUserProgress(): Promise<UserProgress[]>;
  updateProgress(progress: InsertUserProgress): Promise<UserProgress>;

  // Problem Attempts
  recordAttempt(attempt: InsertProblemAttempt): Promise<ProblemAttempt>;
  getAttempts(problemId: string): Promise<ProblemAttempt[]>;
}

export class MemStorage implements IStorage {
  private problems: Map<string, MathProblem>;
  private solutions: Map<string, MathSolution>;
  private sessions: Map<string, StudySession>;
  private progress: Map<string, UserProgress>;
  private attempts: Map<string, ProblemAttempt>;

  constructor() {
    this.problems = new Map();
    this.solutions = new Map();
    this.sessions = new Map();
    this.progress = new Map();
    this.attempts = new Map();
  }

  async createProblem(insertProblem: InsertMathProblem): Promise<MathProblem> {
    const id = randomUUID();
    const problem: MathProblem = {
      ...insertProblem,
      id,
      isFavorite: insertProblem.isFavorite || false,
      tags: insertProblem.tags || null,
      imageUrl: insertProblem.imageUrl || null,
      latexRepresentation: insertProblem.latexRepresentation || null,
      createdAt: new Date(),
    };
    this.problems.set(id, problem);
    return problem;
  }

  async getRecentProblems(limit: number): Promise<MathProblem[]> {
    const problems = Array.from(this.problems.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
    return problems;
  }

  async getFavoriteProblems(): Promise<MathProblem[]> {
    const problems = Array.from(this.problems.values())
      .filter(p => p.isFavorite)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return problems;
  }

  async updateProblemFavorite(problemId: string, isFavorite: boolean): Promise<void> {
    const problem = this.problems.get(problemId);
    if (problem) {
      problem.isFavorite = isFavorite;
      this.problems.set(problemId, problem);
    }
  }

  async createSolution(insertSolution: InsertMathSolution): Promise<MathSolution> {
    const id = randomUUID();
    const solution: MathSolution = {
      ...insertSolution,
      id,
      timeToSolve: insertSolution.timeToSolve || null,
      method: insertSolution.method || null,
      visualization: insertSolution.visualization || null,
      createdAt: new Date(),
    };
    this.solutions.set(id, solution);
    return solution;
  }

  async getSolution(problemId: string): Promise<MathSolution | null> {
    const solutions = Array.from(this.solutions.values());
    return solutions.find(s => s.problemId === problemId) || null;
  }

  async createStudySession(insertSession: InsertStudySession): Promise<StudySession> {
    const id = randomUUID();
    const session: StudySession = {
      ...insertSession,
      id,
      sessionName: insertSession.sessionName || null,
      problemsSolved: insertSession.problemsSolved || 0,
      totalTime: insertSession.totalTime || 0,
      averageDifficulty: insertSession.averageDifficulty || null,
      categories: insertSession.categories || null,
      startedAt: new Date(),
      endedAt: insertSession.endedAt ? new Date(insertSession.endedAt) : null,
    };
    this.sessions.set(id, session);
    return session;
  }

  async getStudySessions(): Promise<StudySession[]> {
    const sessions = Array.from(this.sessions.values())
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
    return sessions;
  }

  async getUserProgress(): Promise<UserProgress[]> {
    const progress = Array.from(this.progress.values());
    return progress;
  }

  async updateProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const existing = Array.from(this.progress.values())
      .find(p => p.category === insertProgress.category);
    
    if (existing) {
      const updated: UserProgress = {
        ...existing,
        ...insertProgress,
        lastStudied: new Date(),
      };
      this.progress.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const newProgress: UserProgress = {
        ...insertProgress,
        id,
        problemsSolved: insertProgress.problemsSolved || 0,
        correctAnswers: insertProgress.correctAnswers || 0,
        averageTime: insertProgress.averageTime || null,
        currentStreak: insertProgress.currentStreak || 0,
        bestStreak: insertProgress.bestStreak || 0,
        skillLevel: insertProgress.skillLevel || 1,
        lastStudied: new Date(),
      };
      this.progress.set(id, newProgress);
      return newProgress;
    }
  }

  async recordAttempt(insertAttempt: InsertProblemAttempt): Promise<ProblemAttempt> {
    const id = randomUUID();
    const attempt: ProblemAttempt = {
      ...insertAttempt,
      id,
      userAnswer: insertAttempt.userAnswer || null,
      isCorrect: insertAttempt.isCorrect || false,
      hintsUsed: insertAttempt.hintsUsed || 0,
      timeSpent: insertAttempt.timeSpent || 0,
      attemptedAt: new Date(),
    };
    this.attempts.set(id, attempt);
    return attempt;
  }

  async getAttempts(problemId: string): Promise<ProblemAttempt[]> {
    const attempts = Array.from(this.attempts.values())
      .filter(a => a.problemId === problemId)
      .sort((a, b) => b.attemptedAt.getTime() - a.attemptedAt.getTime());
    return attempts;
  }
}

export const storage = new MemStorage();