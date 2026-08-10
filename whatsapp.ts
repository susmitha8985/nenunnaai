import { Router } from "express";
import { env } from "../config/env";
import { supabase } from "../config/supabase";
import { sendTextMessage } from "../services/whatsappService";

const router = Router();

router.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === env.META_WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

router.post("/webhook", async (req, res, next) => {
  try {
    // Production: validate Meta webhook authenticity/signature before processing.
    const value = req.body?.entry?.[0]?.changes?.[0]?.value;
    const message = value?.messages?.[0];
    if (message) {
      const phone = message.from;
      const text = message.text?.body ?? "[non-text message]";

      const { data: conversation } = await supabase.from("whatsapp_conversations")
        .upsert({ phone_number: phone, status: "active", last_message: text }, { onConflict: "phone_number" })
        .select().single();

      if (conversation) {
        await supabase.from("whatsapp_messages").insert({
          conversation_id: conversation.id, direction: "inbound",
          message: text, message_type: message.type, external_message_id: message.id, status: "received"
        });
      }

      if (env.DEMO_MODE === "true") console.log("[DEMO WhatsApp inbound]", phone, text);
    }
    res.sendStatus(200);
  } catch (e) { next(e); }
});

router.post("/send", async (req, res, next) => {
  try {
    const { to, message } = req.body;
    if (!to || !message) return res.status(400).json({ success: false, error: "to and message are required" });
    const result = await sendTextMessage(to, message);
    res.json({ success: true, data: result });
  } catch (e) { next(e); }
});

export default router;