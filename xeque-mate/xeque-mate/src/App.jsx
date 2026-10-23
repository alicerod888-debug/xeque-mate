import { useMemo, useState } from "react";
import Hero from "./components/Hero.jsx";
import MenuCategory from "./components/MenuCategory.jsx";
import CategoryNav from "./components/CategoryNav.jsx";
import Cart from "./components/Cart.jsx";
import { products, categories } from "./data/products.js";
import { config } from "./data/config.js";
import { maxQty } from "./lib/pricing.js";
import useStoreOpen from "./lib/useStoreOpen.js";

const norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function App() {
  const [q, setQ] = useState("");
  const [lines, setLines] = useState([]);
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);
  const [storeOpen, recheckStore] = useStoreOpen();

  // Agrupa os produtos por categoria automaticamente (ordem = ordem de `categories`).
  const sections = useMemo(() => {
    const term = norm(q);
    const visible = products.filter((p) => (config.showPending || !p.pending) && norm(p.name).includes(term));
    const known = new Set(categories.map((c) => c.id));
    const list = categories.map((c) => ({ category: c, items: visible.filter((p) => p.category === c.id) }));
    const orphans = visible.filter((p) => !known.has(p.category)); // categoria não cadastrada
    if (orphans.length) list.push({ category: { id: "outros", name: "Outros", short: "Outros" }, items: orphans });
    return list.filter((s) => s.items.length);
  }, [q]);

  const add = (p) => {
    const have = lines.filter((l) => l.id === p.id).reduce((s, l) => s + l.qty, 0);
    if (have >= maxQty(p)) return alert("Quantidade máxima disponível já está no carrinho.");
    setLines((ls) => {
      const i = ls.findIndex((l) => l.id === p.id && l.addons.length === 0);
      if (i >= 0) return ls.map((l, k) => (k === i ? { ...l, qty: l.qty + 1 } : l));
      return [...ls, { key: crypto.randomUUID?.() ?? String(Math.random()), id: p.id, qty: 1, addons: [] }];
    });
    setOpen(true);
  };
  const count = lines.reduce((s, l) => s + l.qty, 0);

  return (
    <>
      <header className="top"><span className="logo">♞ Xeque-<span className="gold">Mate</span></span>
        <button className="cartbtn" onClick={() => setOpen(true)}>Carrinho ({count})</button></header>
      <Hero />
      <main>
        <div className={`store-status ${storeOpen ? "is-open" : "is-closed"}`} role="status">
          <b>{storeOpen ? "ABERTO AGORA" : "FECHADO AGORA"}</b>
          {!storeOpen && <span> · Funcionamos todos os dias, das 17h às 23h.</span>}
        </div>
        <input className="search" type="search" placeholder="Buscar no cardápio…" value={q} onChange={(e) => setQ(e.target.value)} />
        <CategoryNav categories={sections.map((s) => s.category)} />
        {sections.map((s) => <MenuCategory key={s.category.id} category={s.category} items={s.items} onAdd={add} />)}
        {sections.length === 0 && <p className="muted">Nenhum item encontrado.</p>}
      </main>
      <footer id="contato">
        <h2>Contato</h2>
        <p>{config.address}</p>
        <p>Horário: {config.openingHours} · {config.deliveryTime}</p>
        <p><a href={config.instagram} target="_blank" rel="noreferrer">Instagram</a> · <a href={config.mapsUrl} target="_blank" rel="noreferrer">Ver no Google Maps</a> · <a href={`https://wa.me/${config.whatsapp}`} target="_blank" rel="noreferrer">Pedir pelo WhatsApp</a></p>
      </footer>
      <Cart lines={lines} setLines={setLines} note={note} setNote={setNote} open={open} setOpen={setOpen} storeOpen={storeOpen} recheckStore={recheckStore} />
    </>
  );
}
