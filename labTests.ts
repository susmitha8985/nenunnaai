import { Router } from "express";
import { supabase } from "../config/supabase";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const { data, error } = await supabase.from("lab_tests").select("*").eq("status", "active").order("name");
    if (error) throw error;
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

router.post("/", async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("lab_tests").insert(req.body).select().single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (e) { next(e); }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("lab_tests").update(req.body).eq("id", req.params.id).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { error } = await supabase.from("lab_tests").update({ status: "inactive" }).eq("id", req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (e) { next(e); }
});

export default router;