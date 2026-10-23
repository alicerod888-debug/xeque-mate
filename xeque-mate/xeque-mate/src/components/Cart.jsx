import { brl, finalPrice, maxQty } from "../lib/pricing.js";
import { config } from "../data/config.js";
import { products } from "../data/products.js";

const byId = (id) => products.find((p) => p.id === id);
export const lineUnit = (l) => {
  const p = byId(l.id);
  return finalPrice(p) + l.addons.reduce((s, a) => s + finalPrice(byId(a)), 0);
};
export const lineTotal = (l) => lineUnit(l) * l.qty;

export function buildMessage(lines, note) {
  let t = `*Pedido - ${config.name}*\n\n`;
  lines.forEach((l, i) => {
    const p = byId(l.id);
    t += `${i + 1}) ${l.qty}x ${p.name}\n   Preço unit.: ${p.priceFrom ? "a partir de " : ""}${brl(finalPrice(p))}`;
    if (finalPrice(p) < p.price) t += ` (promoção; de ${brl(p.price)})`;
    t += "\n";
    l.addons.forEach((a) => (t += `   + ${byId(a).name}: ${brl(finalPrice(byId(a)))}\n`));
    t += `   Subtotal: ${brl(lineTotal(l))}\n`;
  });
  const total = lines.reduce((s, l) => s + lineTotal(l), 0);
  t += `\n*Total dos produtos: ${brl(total)}*\n(Entrega e pagamento: a combinar com a loja)\n`;
  if (note.trim()) t += `\nObservações: ${note.trim()}\n`;
  return t;
}

export default function Cart({ lines, setLines, note, setNote, open, setOpen, storeOpen = true, recheckStore = () => true }) {
  const qtyOf = (id) => lines.filter((l) => l.id === id).reduce((s, l) => s + l.qty, 0);
  const change = (key, d) => setLines((ls) => ls.flatMap((l) => {
    if (l.key !== key) return [l];
    const q = l.qty + d;
    if (q <= 0) return [];
    if (d > 0 && qtyOf(l.id) >= maxQty(byId(l.id))) return [l];
    return [{ ...l, qty: q }];
  }));
  const toggleAddon = (key, a) => setLines((ls) => ls.map((l) => l.key !== key ? l :
    { ...l, addons: l.addons.includes(a) ? l.addons.filter((x) => x !== a) : [...l.addons, a] }));
  const total = lines.reduce((s, l) => s + lineTotal(l), 0);
  const send = () => {
    if (!recheckStore()) return; // confere o horário de novo no momento do clique
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(buildMessage(lines, note))}`, "_blank");
  };
  if (!open) return null;
  return (
    <aside className="cart" role="dialog" aria-label="Carrinho">
      <header><h2>Seu pedido</h2><button className="x" onClick={() => setOpen(false)} aria-label="Fechar">✕</button></header>
      {lines.length === 0 ? <p className="muted">Carrinho vazio.</p> : lines.map((l) => {
        const p = byId(l.id);
        const opts = (p.allowedAddons || []).map(byId).filter((a) => a && a.available === true && finalPrice(a));
        return (
          <div className="line" key={l.key}>
            <div><b>{p.name}</b><div className="muted">{brl(lineUnit(l))} cada</div></div>
            <div className="qty"><button onClick={() => change(l.key, -1)}>−</button><span>{l.qty}</span>
              <button onClick={() => change(l.key, 1)} disabled={qtyOf(l.id) >= maxQty(p)}>+</button></div>
            <b>{brl(lineTotal(l))}</b>
            {opts.length > 0 && <div className="addons">{opts.map((a) => (
              <label key={a.id}><input type="checkbox" checked={l.addons.includes(a.id)} onChange={() => toggleAddon(l.key, a.id)} /> {a.name} (+{brl(finalPrice(a))})</label>))}</div>}
          </div>);
      })}
      <textarea placeholder="Observações do pedido" value={note} onChange={(e) => setNote(e.target.value)} />
      <div className="total">Total dos produtos <b>{brl(total)}</b></div>
      <p className="muted">Entrega: {config.deliveryFee}. Pagamento: {config.paymentInfo}. O pedido só vale após a resposta da loja no WhatsApp.</p>
      {!storeOpen && <p className="closed-msg">Estamos fechados no momento. Funcionamos todos os dias, das 17h às 23h. Seu pedido continua salvo aqui e poderá ser enviado a partir das 17h.</p>}
      <button className="wa" disabled={!lines.length || !storeOpen} onClick={send}>Enviar pedido pelo WhatsApp</button>
    </aside>
  );
}
