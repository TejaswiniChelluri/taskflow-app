import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { connectDB } from "./server/config/db.ts";
import taskRoutes from "./server/routes/taskRoutes.ts";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize DB Connection (attempts Mongo Atlas, falls back to file on error)
  await connectDB();

  // Middleware
  app.use(express.json());

  // API Routes
  app.use("/api/tasks", taskRoutes);

  // Simple overall health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date() });
  });

  // Centralized Error Handling Middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("🔥 Server Error:", err);
    res.status(500).json({
      success: false,
      message: "An unexpected server error occurred",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  });

  // Serve Frontend with Vite in Dev, or Static Assets in Prod
  if (process.env.NODE_ENV !== "production") {
    console.log("🛠️  Running in Development Mode. Mounting Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("🚀 Running in Production Mode. Serving static assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`📡 TaskFlow server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("🔴 Server crash during startup:", err);
});
