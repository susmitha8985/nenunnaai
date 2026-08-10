import { Router } from "express";
import { z } from "zod";
import { supabase } from "../config/supabase";
import { bookingId } from "../utils/id";
import { triggerAutomation } from "../services/automationService";
import { sendAppointmentConfirmation } from "../services/whatsappService";
import { validateBody } from "../middleware/validate";

const router = Router();

const createSchema = z.object({
  patient_id: z.string().uuid(),
  doctor_id: z.string().uuid(),
  appointment_date: z.string(),
  appointment_time: z.string(),
  consultation_type: z.enum(["clinic", "video"]).default("clinic"),
  patient_name: z.string().min(2),
  phone: z.string().min(8),
  fee: z.coerce.number().nonnegative().default(0)
});

router.post("/", validateBody(createSchema), async (req, res, next) => {
  try {
    const id = bookingId("APT");
    const { data, error } = await supabase.from("appointments").insert({
      booking_id: id,
      patient_id: req.body.patient_id,
      doctor_id: req.body.doctor_id,
      appointment_date: req.body.appointment_date,
      appointment_time: req.body.appointment_time,
      consultation_type: req.body.consultation_type,
      status: "confirmed",
      payment_status: "pending"
    }).select().single();
    if (error) throw error;

    const { data: doctor } = await supabase.from("doctors").select("name").eq("id", req.body.doctor_id).single();
    const payload = {
      booking_id: id, patient_name: req.body.patient_name, phone: req.body.phone,
      doctor_name: doctor?.name ?? "Doctor", date: req.body.appointment_date,
      time: req.body.appointment_time, fee: req.body.fee
    };

    await triggerAutomation("appointment.confirmed", payload);
    await sendAppointmentConfirmation(req.body.phone, payload);

    res.status(201).json({ success: true, data, booking_id: id });
  } catch (e) { next(e); }
});

router.get("/", async (req, res, next) => {
  try {
    let query = supabase.from("appointments").select("*, doctors(name)").order("appointment_date", { ascending: false });
    if (req.query.patient_id) query = query.eq("patient_id", req.query.patient_id);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("appointments").select("*, doctors(name)").eq("id", req.params.id).single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("appointments").update(req.body).eq("id", req.params.id).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

router.post("/:id/cancel", async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("appointments").update({ status: "cancelled" }).eq("id", req.params.id).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

export default router;