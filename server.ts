import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs/promises";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  const PORT = 3000;
  const DATA_DIR = path.join(process.cwd(), "data");
  const JOURNAL_FILE = path.join(DATA_DIR, "journal.json");
  const STRATEGY_FILE = path.join(DATA_DIR, "strategies.json");

  // Ensure data directory exists
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    // Initialize mock data if empty
    const trades = await loadData(JOURNAL_FILE, []);
    if (trades.length === 0) {
      await saveData(JOURNAL_FILE, [
        { id: '1', date: new Date().toISOString(), symbol: 'BTC/USD', direction: 'LONG', entryPrice: 65000, exitPrice: 67000, size: 0.1, pnl: 200, strategy: 'Trend Follower 3.0', mode: 'PAPER' },
        { id: '2', date: new Date().toISOString(), symbol: 'AAPL', direction: 'SHORT', entryPrice: 180, exitPrice: 175, size: 50, pnl: 250, strategy: 'Mean Reversion v2', mode: 'LIVE' },
      ]);
    }
  } catch (e) {}

  async function loadData(file: string, def: any) {
    try {
      const data = await fs.readFile(file, "utf-8");
      return JSON.parse(data);
    } catch (e) {
      return def;
    }
  }

  async function saveData(file: string, data: any) {
    await fs.writeFile(file, JSON.stringify(data, null, 2));
  }

  app.use(express.json());

  // API Routes
  app.get("/api/journal", async (req, res) => {
    const data = await loadData(JOURNAL_FILE, []);
    res.json(data);
  });

  app.post("/api/journal", async (req, res) => {
    const trades = await loadData(JOURNAL_FILE, []);
    const newTrade = { ...req.body, id: Date.now().toString() };
    trades.push(newTrade);
    await saveData(JOURNAL_FILE, trades);
    res.json(newTrade);
  });

  app.get("/api/strategies", async (req, res) => {
    const data = await loadData(STRATEGY_FILE, []);
    res.json(data);
  });

  // Risk Engine / Webhook Receiver
  app.post("/api/webhook", async (req, res) => {
    const signal = req.body;
    console.log("Received Signal:", signal);

    // Basic Risk Filter Simulation
    // In a real app, logic would check max positions, daily loss, etc.
    const riskCheck = { passed: true, reason: "" };
    
    // Simulate real-time broadcast
    io.emit("signal", { ...signal, timestamp: new Date(), riskCheck });
    
    res.json({ status: "received", riskCheck });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
