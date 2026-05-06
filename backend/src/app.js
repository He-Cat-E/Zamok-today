import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes.js";
import localeRoutes from "./routes/locale.routes.js";
import flightRoutes from "./routes/flight.routes.js";

export function createApp() {
  const app = express();
  const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";
  app.set("trust proxy", true);

  app.use(
    cors({
      origin: CLIENT_ORIGIN,
      credentials: true
    })
  );
  app.use(express.json({ limit: "1mb" }));

  app.use(healthRoutes);
  app.use("/api/locale", localeRoutes);
  app.use("/api/flights", flightRoutes);

  return app;
}
