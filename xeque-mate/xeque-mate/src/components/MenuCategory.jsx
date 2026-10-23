import ProductCard from "./ProductCard.jsx";
// Uma seção do cardápio: título, subtítulo e os produtos da categoria.
export default function MenuCategory({ category, items, onAdd }) {
  return (
    <section className="menu-sec" id={`cat-${category.id}`} aria-labelledby={`h-${category.id}`}>
      <h2 id={`h-${category.id}`}>{category.name}</h2>
      {category.subtitle && <p className="sub">{category.subtitle}</p>}
      <div className="grid">{items.map((p) => <ProductCard key={p.id} p={p} onAdd={onAdd} />)}</div>
    </section>
  );
}
