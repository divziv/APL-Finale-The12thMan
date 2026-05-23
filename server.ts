/**
 * @file server.ts
 * @description Express/Vite server for Crowdflow Stadium Command. Includes server-side Gemini API client.
 */

import express, { Request, Response } from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

/**
 * Initializes the GoogleGenAI instance.
 * Uses the API key stored in process.env.GEMINI_API_KEY.
 * Set User-Agent to 'aistudio-build' for telemetry.
 */
let ai: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI Features will fall back to simulation.");
    }
    ai = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY_FOR_STANDALONE",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  const PORT = 3000;

  /**
   * Endpoint for real-time AI security coordination advice.
   * Leverages gemini-3.5-flash for context analysis of stadium gates, incidents and threats.
   */
  app.post("/api/ai/coordinate", async (req: Request, res: Response): Promise<void> => {
    try {
      const { userQuery, gateMetrics, activeIncidents, chatHistory } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        // Safe, beautiful mock response fallback to survive missing API key on sandbox boots
        console.log("No GEMINI_API_KEY found, returning premium mock operation recommendation.");
        setTimeout(() => {
          res.json({
            text: `[SIMULATED COORDINATOR RESPONSE]\n\nBased on the active gate metrics and the crowd buildup, here is the strategic coordinator plan:\n\n1. **Dynamic Shift Dispatch**: Deploy 4 extra turnstile officers from VIP Gate 3 to **congested Gate 4** immediately to lower scanning speeds below 2.0s.\n2. **Digital Rerouting Trigger**: Push alerts to the Stadium Mobile App directing Western Stand seat holders to use Concourse C/Gate 1 instead.\n3. **Transit Advisory**: Advise Metro Central to stand-by with extra high-frequency shuttles to handle the immediate outflow after full clearance.`
          });
        }, 1200);
        return;
      }

      const client = getAiClient();

      // System instruction for the Stadium Command model
      const systemInstruction = 
        "You are Chief AI Stadium Operations Coordinator & Safety Officer. " +
        "Your job is to provide direct, professional, expert directives and recommendations to ground security, ticketing, and crowd volunteers. " +
        "You analyze camera logs, gate statistics, and emergency alerts. Keep your feedback highly tactical, clear, bulleted, and structured. " +
        "Use active matchday operations terminology (e.g., turnstile throughput, egress lines, sector cordons, digital board rerouting).";

      // Formulate stadium context structure for Gemini
      const formattedContext = `
STADIUM STATUS REPORT:
- Active Spectator Gates:
${JSON.stringify(gateMetrics, null, 2)}

- Active Security Incidents:
${JSON.stringify(activeIncidents, null, 2)}

- User Request/Incident: "${userQuery}"
      `;

      // Build message flow with history
      const formattedMessages = [
        { role: "user", parts: [{ text: `Here is the current stadium status and my inquiry:\n${formattedContext}\n\nHistory of conversation:\n${JSON.stringify(chatHistory || [])}\n\nWhat is your tactical directive?` }] }
      ];

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedMessages,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "Direct command established. Keep current parameters armed.";
      res.json({ text: replyText });

    } catch (err: any) {
      console.error("Gemini coordination endpoint error:", err);
      res.status(500).json({ error: "Failed to query crowd intelligence system: " + err.message });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting backend with Vite middleware in development...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting backend in production static mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Command Server booted on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical server bootstrap failure:", err);
});
