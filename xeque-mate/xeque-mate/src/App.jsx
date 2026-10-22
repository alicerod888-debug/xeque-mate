import { useMemo, useState } from "react";
import Hero from "./components/Hero.jsx";
import ProductCard from "./components/ProductCard.jsx";
import Cart from "./components/Cart.jsx";
import { products, categories } from "./data/products.js";
import { config } from "./data/config.js";
import { maxQty } from "./lib/pricing.js";

export default function App() {
  const [cat, setCat] = useState("todos");
  const [q, setQ] = useState("");
  const [lines, setLines] = useState([]);
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);

  const list = useMemo(() => products.filter((p) =>
    (config.showPending || !p.pending) &&
    (cat === "todos" || p.category === cat) &&
    p.name.toLowerCase().includes(q.toLowerCase())), [cat, q]);

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
        <input className="search" type="search" placeholder="Buscar no cardápio…" value={q} onChange={(e) => setQ(e.target.value)} />
        <nav className="cats">
          {[{ id: "todos", name: "Todos" }, ...categories].map((c) => (
            <button key={c.id} className={cat === c.id ? "on" : ""} onClick={() => setCat(c.id)}>{c.name}</button>))}
        </nav>
        <div className="grid">{list.map((p) => <ProductCard key={p.id} p={p} onAdd={add} />)}</div>
        {list.length === 0 && <p className="muted">Nenhum item encontrado.</p>}
      </main>
      <footer id="contato">
        <h2>Contato</h2>
        <p>{config.address}</p>
        <p>Horário: {config.openingHours} · Entrega: {config.deliveryTime}</p>
        <p><a href={config.instagram} target="_blank" rel="noreferrer">Instagram</a> · <a href={config.mapsUrl} target="_blank" rel="noreferrer">Ver no Google Maps</a> · <a href={`https://wa.me/${config.whatsapp}`} target="_blank" rel="noreferrer">Pedir pelo WhatsApp</a></p>
      </footer>
      <Cart lines={lines} setLines={setLines} note={note} setNote={setNote} open={open} setOpen={setOpen} />
    </>
  );
}
