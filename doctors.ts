import { Router } from "express";
import { supabase } from "../config/supabase";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    let query = supabase.from("doctors").select("*").eq("status", "active");
    if (req.query.specialty) query = query.eq("specialty", req.query.specialty);
    if (req.query.search) query = query.ilike("name", `%${req.query.search}%`);
    const { data, error } = await query.order("name");
    if (error) throw error;
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("doctors").select("*").eq("id", req.params.id).single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

router.post("/", async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("doctors").insert(req.body).select().single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (e) { next(e); }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("doctors").update(req.body).eq("id", req.params.id).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { error } = await supabase.from("doctors").update({ status: "inactive" }).eq("id", req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (e) { next(e); }
});

export default router;