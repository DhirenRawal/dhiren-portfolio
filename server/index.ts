import express from "express";
import cors from "cors";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://dhiren-portfolio.vercel.app",
];

const corsOptions: cors.CorsOptions = {
  origin(origin, callback) {
    // allow non-browser requests like curl/postman or same-origin/no-origin cases
    if (!origin) return callback(null, true);

    // exact allowlist
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // allow ALL Vercel preview deployments
    if (/^https:\/\/dhiren-portfolio-[a-z0-9-]+-dhiren-rawals-projects\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }

    // optional broader Vercel allowance if you rename previews later
    if (/^https:\/\/.*\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

// useful temporary debug
app.use((req, _res, next) => {
  console.log("Origin:", req.headers.origin);
  console.log("Method:", req.method, "Path:", req.path);
  next();
});

app.get("/", (_req, res) => {
  res.json({ ok: true, message: "Railway backend is alive" });
});

app.post("/api/contact", (req, res) => {
  console.log("Contact body:", req.body);
  return res.status(201).json({
    success: true,
    message: "Contact route test passed",
  });
});