// Regras de preço e estoque (não precisa editar).
export const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const hasPrice = (p) => typeof p.price === "number" && p.price > 0;
export const promoValid = (p) =>
  hasPrice(p) && p.discountActive === true && typeof p.promotionalPrice === "number" &&
  p.promotionalPrice > 0 && p.promotionalPrice < p.price;
export const finalPrice = (p) => (promoValid(p) ? p.promotionalPrice : p.price);
export const discountPct = (p) => (promoValid(p) ? Math.round((1 - p.promotionalPrice / p.price) * 100) : 0);
export const status = (p) => {
  if (p.pending || !hasPrice(p)) return "pending";
  if (p.available === "unavailable") return "unavailable";
  if (p.available !== true || (p.stockManaged && (p.stockQuantity || 0) <= 0)) return "soldout";
  return "ok";
};
export const maxQty = (p) => (status(p) !== "ok" ? 0 : p.stockManaged ? p.stockQuantity : Infinity);
