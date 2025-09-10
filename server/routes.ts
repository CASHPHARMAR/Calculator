import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertMathProblemSchema, 
  insertMathSolutionSchema,
  insertStudySessionSchema,
  insertUserProgressSchema,
  insertProblemAttemptSchema 
} from "@shared/schema";
import { z } from "zod";
import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const solveProblemSchema = z.object({
  problemText: z.string(),
  category: z.enum(['algebra', 'calculus', 'geometry', 'trigonometry', 'statistics', 'linear-algebra', 'differential-equations', 'discrete-math', 'precalculus', 'number-theory']),
  difficulty: z.number().min(1).max(5),
  imageData: z.string().optional(), // base64 image data
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get recent math problems
  app.get("/api/problems", async (req, res) => {
    try {
      const problems = await storage.getRecentProblems(10);
      res.json(problems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch problems" });
    }
  });

  // Create new math problem
  app.post("/api/problems", async (req, res) => {
    try {
      const problemData = insertMathProblemSchema.parse(req.body);
      const problem = await storage.createProblem(problemData);
      res.json(problem);
    } catch (error) {
      res.status(400).json({ error: "Invalid problem data" });
    }
  });

  // Solve math problem using AI
  app.post("/api/problems/solve", async (req, res) => {
    try {
      const { problemText, category, difficulty, imageData } = solveProblemSchema.parse(req.body);
      
      const startTime = Date.now();
      
      let messages = [];
      
      if (imageData) {
        // Handle image-based problems
        messages = [
          {
            role: "system" as const,
            content: `You are an expert mathematics tutor specializing in ${category}. Analyze the mathematical problem in the image and provide a detailed step-by-step solution. 
            
            Respond with JSON in this format:
            {
              "steps": [
                {
                  "step": 1,
                  "description": "Clear explanation of this step",
                  "formula": "Mathematical formula used (if applicable)",
                  "result": "Result of this step (if applicable)"
                }
              ],
              "explanation": "Overall explanation of the solution approach",
              "concepts": ["concept1", "concept2"],
              "finalAnswer": "The final answer",
              "confidence": 95
            }`
          },
          {
            role: "user" as const,
            content: [
              {
                type: "text" as const,
                text: `Please solve this ${category} problem with difficulty level ${difficulty}/5. If there's additional text context: ${problemText}`
              },
              {
                type: "image_url" as const,
                image_url: {
                  url: `data:image/jpeg;base64,${imageData}`
                }
              }
            ]
          }
        ];
      } else {
        // Handle text-based problems
        messages = [
          {
            role: "system" as const,
            content: `You are an expert mathematics tutor specializing in ${category}. Provide detailed step-by-step solutions with clear explanations.
            
            Respond with JSON in this format:
            {
              "steps": [
                {
                  "step": 1,
                  "description": "Clear explanation of this step",
                  "formula": "Mathematical formula used (if applicable)",
                  "result": "Result of this step (if applicable)"
                }
              ],
              "explanation": "Overall explanation of the solution approach",
              "concepts": ["concept1", "concept2"],
              "finalAnswer": "The final answer",
              "confidence": 95
            }`
          },
          {
            role: "user" as const,
            content: `Solve this ${category} problem (difficulty ${difficulty}/5): ${problemText}`
          }
        ];
      }

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages,
        response_format: { type: "json_object" },
        max_tokens: 1500,
      });

      const solutionData = JSON.parse(response.choices[0].message.content || "{}");
      const timeToSolve = Date.now() - startTime;

      // Create problem and solution
      const problem = await storage.createProblem({
        problemText,
        category,
        difficulty,
        imageUrl: imageData ? "data:image/jpeg;base64," + imageData : undefined,
      });

      const solution = await storage.createSolution({
        problemId: problem.id,
        solution: {
          steps: solutionData.steps || [],
          explanation: solutionData.explanation || "",
          concepts: solutionData.concepts || [],
        },
        finalAnswer: solutionData.finalAnswer || "Unable to determine",
        confidence: solutionData.confidence || 75,
        timeToSolve,
        method: "AI-powered solution",
      });

      res.json({
        problem,
        solution,
      });
    } catch (error) {
      console.error("Error solving problem:", error);
      res.status(500).json({ error: "Failed to solve problem" });
    }
  });

  // Get solution for a problem
  app.get("/api/problems/:problemId/solution", async (req, res) => {
    try {
      const { problemId } = req.params;
      const solution = await storage.getSolution(problemId);
      if (!solution) {
        return res.status(404).json({ error: "Solution not found" });
      }
      res.json(solution);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch solution" });
    }
  });

  // Get user progress by category
  app.get("/api/progress", async (req, res) => {
    try {
      const progress = await storage.getUserProgress();
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  // Start new study session
  app.post("/api/study-session", async (req, res) => {
    try {
      const sessionData = insertStudySessionSchema.parse(req.body);
      const session = await storage.createStudySession(sessionData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid session data" });
    }
  });

  // Get favorite problems
  app.get("/api/favorites", async (req, res) => {
    try {
      const favorites = await storage.getFavoriteProblems();
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch favorites" });
    }
  });

  // Toggle problem favorite status
  app.patch("/api/problems/:problemId/favorite", async (req, res) => {
    try {
      const { problemId } = req.params;
      const { isFavorite } = req.body;
      await storage.updateProblemFavorite(problemId, isFavorite);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update favorite status" });
    }
  });

  // Submit problem attempt
  app.post("/api/problems/:problemId/attempt", async (req, res) => {
    try {
      const { problemId } = req.params;
      const attemptData = insertProblemAttemptSchema.parse({
        ...req.body,
        problemId,
      });
      const attempt = await storage.recordAttempt(attemptData);
      res.json(attempt);
    } catch (error) {
      res.status(400).json({ error: "Invalid attempt data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}