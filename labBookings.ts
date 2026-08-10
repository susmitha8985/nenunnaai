import { Router } from "express";
import { z } from "zod";
import { supabase } from "../config/supabase";
import { bookingId } from "../utils/id";
import { triggerAutomation } from "../services/automationService";
import { sendLabConfirmation } from "../services/whatsappService";
import { validateBody } from "../middleware/validate";

const router = Router();

const schema = z.object({
  patient_id: z.string().uuid(),
  test_id: z.string().uuid(),
  patient_name: z.string().min(2),
  phone: z.string().min(8),
  booking_date: z.string(),
  booking_time: z.string(),
  collection_type: z.enum(["home", "lab"]),
  address: z.string().optional()
});

router.post("/", validateBody(schema), async (req, res, next) => {
  try {
    const id = bookingId("LAB");
    const { data, error } = await supabase.from("lab_bookings").insert({
      booking_id: id, patient_id: req.body.patient_id, test_id: req.body.test_id,
      booking_date: req.body.booking_date, booking_time: req.body.booking_time,
      collection_type: req.body.collection_type, address: req.body.address ?? null,
      status: "booked", payment_status: "pending"
    }).select().single();
    if (error) throw error;

    const { data: test } = await supabase.from("lab_tests").select("name").eq("id", req.body.test_id).single();
    const payload = {
      booking_id: id, patient_name: req.body.patient_name, phone: req.body.phone,
      test_name: test?.name ?? "Lab test", date: req.body.booking_date,
      time: req.body.booking_time, collection_type: req.body.collection_type
    };
    await triggerAutomation("lab.confirmed", payload);
    await sendLabConfirmation(req.body.phone, payload);

    res.status(201).json({ success: true, data, booking_id: id });
  } catch (e) { next(e); }
});

router.get("/", async (req, res, next) => {
  try {
    let query = supabase.from("lab_bookings").select("*, lab_tests(name, price)").order("created_at", { ascending: false });
    if (req.query.patient_id) query = query.eq("patient_id", req.query.patient_id);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

router.put("/:id/status", async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("lab_bookings").update({ status: req.body.status }).eq("id", req.params.id).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

export default router;