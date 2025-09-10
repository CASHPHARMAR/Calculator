import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Math categories enum
export const mathCategories = [
  'algebra',
  'calculus',
  'geometry',
  'trigonometry', 
  'statistics',
  'linear-algebra',
  'differential-equations',
  'discrete-math',
  'precalculus',
  'number-theory'
] as const;

export const mathProblems = pgTable("math_problems", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  problemText: text("problem_text").notNull(), // The original problem as text
  category: varchar("category", { length: 50 }).notNull(), // Math category
  difficulty: integer("difficulty").notNull().default(1), // 1-5 scale
  imageUrl: text("image_url"), // For uploaded handwritten problems
  latexRepresentation: text("latex_representation"), // LaTeX format for rendering
  isFavorite: boolean("is_favorite").notNull().default(false),
  tags: text("tags").array(), // Array of tags for categorization
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mathSolutions = pgTable("math_solutions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  problemId: varchar("problem_id").notNull().references(() => mathProblems.id),
  solution: jsonb("solution").notNull(), // Structured solution with steps
  finalAnswer: text("final_answer").notNull(),
  confidence: integer("confidence").notNull().default(95), // AI confidence 0-100
  timeToSolve: integer("time_to_solve"), // Time in milliseconds
  method: varchar("method", { length: 100 }), // Solution method used
  visualization: jsonb("visualization"), // 3D visualization data if applicable
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const studySessions = pgTable("study_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionName: text("session_name"),
  problemsSolved: integer("problems_solved").notNull().default(0),
  totalTime: integer("total_time").notNull().default(0), // Time in minutes
  averageDifficulty: integer("average_difficulty").default(1),
  categories: text("categories").array(), // Categories studied
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: varchar("category", { length: 50 }).notNull(),
  problemsSolved: integer("problems_solved").notNull().default(0),
  correctAnswers: integer("correct_answers").notNull().default(0),
  averageTime: integer("average_time").default(0), // Average time per problem in seconds
  currentStreak: integer("current_streak").notNull().default(0),
  bestStreak: integer("best_streak").notNull().default(0),
  lastStudied: timestamp("last_studied").defaultNow().notNull(),
  skillLevel: integer("skill_level").notNull().default(1), // 1-10 scale
});

export const problemAttempts = pgTable("problem_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  problemId: varchar("problem_id").notNull().references(() => mathProblems.id),
  userAnswer: text("user_answer"),
  isCorrect: boolean("is_correct").notNull().default(false),
  hintsUsed: integer("hints_used").notNull().default(0),
  timeSpent: integer("time_spent").notNull().default(0), // Time in seconds
  attemptedAt: timestamp("attempted_at").defaultNow().notNull(),
});

// Insert schemas
export const insertMathProblemSchema = createInsertSchema(mathProblems).omit({
  id: true,
  createdAt: true,
}).extend({
  category: z.enum(mathCategories),
  difficulty: z.number().min(1).max(5),
  tags: z.array(z.string()).optional(),
});

export const insertMathSolutionSchema = createInsertSchema(mathSolutions).omit({
  id: true,
  createdAt: true,
}).extend({
  solution: z.object({
    steps: z.array(z.object({
      step: z.number(),
      description: z.string(),
      formula: z.string().optional(),
      result: z.string().optional(),
    })),
    explanation: z.string(),
    concepts: z.array(z.string()).optional(),
  }),
  confidence: z.number().min(0).max(100),
  visualization: z.object({
    type: z.string().optional(),
    data: z.any().optional(),
  }).optional(),
});

export const insertStudySessionSchema = createInsertSchema(studySessions).omit({
  id: true,
  startedAt: true,
}).extend({
  categories: z.array(z.string()).optional(),
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  lastStudied: true,
}).extend({
  category: z.enum(mathCategories),
  skillLevel: z.number().min(1).max(10),
});

export const insertProblemAttemptSchema = createInsertSchema(problemAttempts).omit({
  id: true,
  attemptedAt: true,
});

// Types
export type MathCategory = typeof mathCategories[number];
export type InsertMathProblem = z.infer<typeof insertMathProblemSchema>;
export type MathProblem = typeof mathProblems.$inferSelect;
export type InsertMathSolution = z.infer<typeof insertMathSolutionSchema>;
export type MathSolution = typeof mathSolutions.$inferSelect;
export type InsertStudySession = z.infer<typeof insertStudySessionSchema>;
export type StudySession = typeof studySessions.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertProblemAttempt = z.infer<typeof insertProblemAttemptSchema>;
export type ProblemAttempt = typeof problemAttempts.$inferSelect;

// Solution step interface for structured solutions
export interface SolutionStep {
  step: number;
  description: string;
  formula?: string;
  result?: string;
}

export interface MathSolutionData {
  steps: SolutionStep[];
  explanation: string;
  concepts?: string[];
}

export interface VisualizationData {
  type?: string;
  data?: any;
}