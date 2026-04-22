import express from "express";
import cors from "cors";
import { api } from "../shared/routes";
import { sendContactEmails } from "./contact-email";
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

app.post("/api/contact", async (req, res) => {
  try {
    const payload = api.contact.submit.input.parse(req.body ?? {});
    const result = await sendContactEmails(payload);

    return res.status(201).json({
      success: true,
      acknowledgementSent: result.acknowledgementSent,
    });
  } catch (error) {
    console.error("Contact submission failed", error);

    return res.status(502).json({
      message: error instanceof Error ? error.message : "Unable to submit contact form",
    });
  }
});

const port = Number(process.env.PORT) || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
