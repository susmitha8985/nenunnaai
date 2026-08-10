import { Router } from "express";
import { supabase } from "../config/supabase";

const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const { email, password, name, phone, role = "patient" } = req.body;
    if (!email || !password || !name) return res.status(400).json({ success: false, error: "email, password and name are required" });

    const { data: auth, error } = await supabase.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { name, phone, role }
    });
    if (error) throw error;

    const { data, error: profileError } = await supabase.from("users")
      .insert({ id: auth.user.id, name, email, phone, role }).select().single();
    if (profileError) throw profileError;

    res.status(201).json({ success: true, data });
  } catch (e) { next(e); }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    res.json({ success: true, data: { user: data.user, session: data.session } });
  } catch (e) { next(e); }
});

export default router;