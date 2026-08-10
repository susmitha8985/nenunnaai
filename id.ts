export function bookingId(prefix: "APT" | "LAB" | "TXN") {
  return `NEN-${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}