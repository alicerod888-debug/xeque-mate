// Horário de funcionamento (fuso configurado em config.js, não o do aparelho do cliente).
import { config } from "../data/config.js";

export function getStoreStatus(now = new Date(), cfg = config.storeHours) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: cfg.timeZone, hour: "numeric", minute: "numeric", second: "numeric",
    weekday: "long", hourCycle: "h23",
  }).formatToParts(now);
  const get = (t) => parts.find((x) => x.type === t).value;
  const hour = Number(get("hour"));
  // Aberto de cfg.open:00:00 até antes de cfg.close:00:00 — todos os dias da semana.
  return { open: hour >= cfg.open && hour < cfg.close, hour, weekday: get("weekday") };
}
