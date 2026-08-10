import { env } from "../config/env";

export async function triggerAutomation(event: string, data: any) {
  if (env.DEMO_MODE === "true" || !env.N8N_WEBHOOK_URL) {
    console.log("[DEMO n8n]", event, data);
    return { demo: true, event, data };
  }

  const response = await fetch(env.N8N_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, ...data })
  });

  if (!response.ok) throw new Error(`n8n webhook failed: ${response.status}`);
  return response.json().catch(() => ({ ok: true }));
}