import { Router } from "express";
import { supabase } from "../config/supabase";
import { triggerAutomation } from "../services/automationService";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("reports").insert(req.body).select().single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (e) { next(e); }
});

router.get("/", async (req, res, next) => {
  try {
    if (!req.query.patient_id) return res.status(400).json({ success: false, error: "patient_id is required" });
    const { data, error } = await supabase.from("reports")
      .select("id, patient_id, lab_booking_id, report_name, status, uploaded_at")
      .eq("patient_id", req.query.patient_id)
      .order("uploaded_at", { ascending: false });
    if (error) throw error;
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { data: report, error } = await supabase.from("reports").select("*").eq("id", req.params.id).single();
    if (error) throw error;
    if (!report.storage_path) return res.status(404).json({ success: false, error: "Report file unavailable" });

    // IMPORTANT: in production, verify authenticated patient ownership/role here.
    const { data: signed, error: signError } = await supabase.storage
      .from("medical-reports")
      .createSignedUrl(report.storage_path, 60);
    if (signError) throw signError;

    res.json({ success: true, report: { ...report, storage_path: undefined }, signed_url: signed.signedUrl });
  } catch (e) { next(e); }
});

router.post("/:id/ready", async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("reports").update({ status: "ready" }).eq("id", req.params.id).select().single();
    if (error) throw error;
    await triggerAutomation("report.ready", { report_id: data.id, patient_id: data.patient_id, report_name: data.report_name });
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

export default router;