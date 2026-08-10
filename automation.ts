import { Router } from "express";
import { triggerAutomation } from "../services/automationService";

const router = Router();

router.post("/appointment-confirmed", async (req, res, next) => {
  try { res.json({ success: true, data: await triggerAutomation("appointment.confirmed", req.body) }); }
  catch (e) { next(e); }
});

router.post("/lab-confirmed", async (req, res, next) => {
  try { res.json({ success: true, data: await triggerAutomation("lab.confirmed", req.body) }); }
  catch (e) { next(e); }
});

router.post("/report-ready", async (req, res, next) => {
  try { res.json({ success: true, data: await triggerAutomation("report.ready", req.body) }); }
  catch (e) { next(e); }
});

export default router;