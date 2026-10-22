import { useState } from "react";
import { brl, finalPrice, promoValid, discountPct, status } from "../lib/pricing.js";
export default function ProductCard({ p, onAdd }) {
  const [imgOk, setImgOk] = useState(true);
  const st = status(p);
  const buyable = st === "ok";
  return (
    <article className={`card ${buyable ? "" : "off"}`}>
      <div className="thumb">
        {imgOk ? <img src={p.image} alt={p.name} loading="lazy" onError={() => setImgOk(false)} />
          : <div className="ph">♞<small>Foto em breve</small></div>}
        {st === "soldout" && <span className="tag red">ESGOTADO</span>}
        {st === "unavailable" && <span className="tag red">INDISPONÍVEL</span>}
        {buyable && promoValid(p) && <span className="tag">OFERTA</span>}
      </div>
      <h3>{p.name}</h3>
      {p.description && <p className="desc">{p.description}</p>}
      <div className="price">
        {st === "pending" ? <span className="muted">Preço a definir</span>
          : buyable && promoValid(p) ? (<><s>{brl(p.price)}</s> <b>{brl(finalPrice(p))}</b> <em>{discountPct(p)}% OFF</em></>)
          : <b className={buyable ? "" : "muted"}>{brl(p.price)}</b>}
      </div>
      <button disabled={!buyable} onClick={() => onAdd(p)}>
        {buyable ? "Adicionar" : st === "pending" ? "Em breve" : "Indisponível"}
      </button>
    </article>
  );
}
