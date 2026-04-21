import express from "express";
import cors from "cors";
import { fetchMarketSnapshot } from "./market";

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  console.log("Origin:", req.headers.origin ?? "no-origin");
  console.log("Method:", req.method, "Path:", req.path);
  next();
});

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    message: "Railway backend is alive",
  });
});

app.get("/api/market", async (_req, res) => {
  try {
    const quotes = await fetchMarketSnapshot();
    res.json(quotes);
  } catch (error) {
    console.error("Failed to load market snapshot", error);
    res.status(502).json({
      message: "Unable to fetch live market data right now.",
    });
  }
});

app.post("/api/contact", (req, res) => {
  console.log("Contact body:", req.body);

  return res.status(201).json({
    success: true,
    message: "Contact route test passed",
  });
});

const port = Number(process.env.PORT) || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
