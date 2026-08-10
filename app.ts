import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import auth from "./routes/auth";
import doctors from "./routes/doctors";
import appointments from "./routes/appointments";
import labTests from "./routes/labTests";
import labBookings from "./routes/labBookings";
import reports from "./routes/reports";
import whatsapp from "./routes/whatsapp";
import automation from "./routes/automation";
import { errorHandler, notFound } from "./middleware/error";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "NENUNNA AI", demoMode: env.DEMO_MODE === "true" }));

app.use("/api/auth", auth);
app.use("/api/doctors", doctors);
app.use("/api/appointments", appointments);
app.use("/api/lab-tests", labTests);
app.use("/api/lab-bookings", labBookings);
app.use("/api/reports", reports);
app.use("/api/whatsapp", whatsapp);
app.use("/api/automation", automation);

app.use(notFound);
app.use(errorHandler);