import { useEffect, useRef, useState } from "react";
// Botões de categoria (rolam na horizontal no celular). Destaca a seção visível.
export default function CategoryNav({ categories }) {
  const [active, setActive] = useState(categories[0]?.id);
  const bar = useRef(null);
  const ids = categories.map((c) => c.id).join("|");

  useEffect(() => {
    const els = categories.map((c) => document.getElementById(`cat-${c.id}`)).filter(Boolean);
    if (!els.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.isIntersecting && setActive(e.target.id.replace("cat-", "")));
    }, { rootMargin: "-130px 0px -70% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);

  useEffect(() => {
    bar.current?.querySelector(".on")?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [active]);

  const go = (id) => {
    setActive(id);
    document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <nav className="menunav" ref={bar} aria-label="Categorias do cardápio">
      {categories.map((c) => (
        <button key={c.id} className={active === c.id ? "on" : ""} onClick={() => go(c.id)}>{c.short || c.name}</button>
      ))}
    </nav>
  );
}
