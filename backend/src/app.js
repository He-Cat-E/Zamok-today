import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import healthRoutes from "./routes/health.routes.js";
import localeRoutes from "./routes/locale.routes.js";
import flightRoutes from "./routes/flight.routes.js";
import authRoutes from "./routes/auth.routes.js";
import walletRoutes from "./routes/wallet.routes.js";
import profileRoutes from "./routes/profile.routes.js";

export function createApp() {
  const app = express();
  const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";
  const allowedOrigins = String(CLIENT_ORIGIN)
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  app.set("trust proxy", true);

  app.use(
    cors({
      origin(origin, callback) {
        // Allow non-browser clients/tools without Origin header.
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`CORS blocked for origin: ${origin}`), false);
      },
      credentials: true
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());

  app.use(healthRoutes);
  app.use("/api/locale", localeRoutes);
  app.use("/api/flights", flightRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/wallet", walletRoutes);
  app.use("/api/profile", profileRoutes);

  return app;
}
