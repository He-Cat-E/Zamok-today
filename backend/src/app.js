import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import healthRoutes from "./routes/health.routes.js";
import localeRoutes from "./routes/locale.routes.js";
import flightRoutes from "./routes/flight.routes.js";
import authRoutes from "./routes/auth.routes.js";
import walletRoutes from "./routes/wallet.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import adminRoutes from "./routes/admin.routes.js";

function parseOrigins(...values) {
  return values
    .flatMap((v) => String(v || "").split(","))
    .map((s) => s.trim())
    .filter(Boolean);
}

export function createApp() {
  const app = express();
  const allowedOrigins = [
    ...new Set(
      parseOrigins(
        process.env.CLIENT_ORIGIN || "http://localhost:3000",
        process.env.ADMIN_ORIGIN || "http://localhost:3001"
      )
    )
  ];
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
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cookieParser());

  app.use(healthRoutes);
  app.use("/api/locale", localeRoutes);
  app.use("/api/flights", flightRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/wallet", walletRoutes);
  app.use("/api/profile", profileRoutes);
  app.use("/api/admin", adminRoutes);

  return app;
}
