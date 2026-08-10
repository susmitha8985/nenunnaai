import { env } from "../config/env";

export async function sendTextMessage(to: string, message: string) {
  if (env.DEMO_MODE === "true") {
    return { demo: true, to, message, id: `demo-${Date.now()}` };
  }

  if (!env.META_WHATSAPP_ACCESS_TOKEN || !env.META_WHATSAPP_PHONE_NUMBER_ID) {
    throw new Error("Meta WhatsApp credentials are not configured");
  }

  const response = await fetch(
    `https://graph.facebook.com/v23.0/${env.META_WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.META_WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message }
      })
    }
  );

  if (!response.ok) throw new Error(`WhatsApp API error: ${response.status}`);
  return response.json();
}

export const sendAppointmentConfirmation = (to: string, p: any) =>
  sendTextMessage(to,
    `Hello ${p.patient_name}, your appointment with ${p.doctor_name} is confirmed.\n\nDate: ${p.date}\nTime: ${p.time}\nBooking ID: ${p.booking_id}\n\nThank you for choosing NENUNNA AI.`);

export const sendLabConfirmation = (to: string, p: any) =>
  sendTextMessage(to,
    `Your lab test booking is confirmed.\n\nTest: ${p.test_name}\nDate: ${p.date}\nTime: ${p.time}\nCollection: ${p.collection_type}\nBooking ID: ${p.booking_id}.`);