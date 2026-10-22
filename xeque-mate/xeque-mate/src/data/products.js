// CADASTRO CENTRAL DE PRODUTOS — único lugar para editar produtos.
// available: true (à venda) | false (esgotado) | "unavailable" (temporariamente indisponível)
// Vagas com pending:true ainda não têm nome/preço do cardápio real.

export const categories = [
  { id: "sobremesas", name: "Sobremesas", count: 1 },
  { id: "barcas", name: "Barcas", count: 5 },
  { id: "entradas", name: "Entradas", count: 8 },
  { id: "burguer-bovino", name: "Burguer Bovino", count: 17 },
  { id: "especiais", name: "Especiais", count: 3 },
  { id: "toscano-burgers", name: "Toscano Burgers", count: 2 },
  { id: "combos", name: "Combos", count: 10 },
  { id: "bebidas", name: "Bebidas", count: 20 },
  { id: "adicionais", name: "Adicionais", count: 12 },
  { id: "cervejas", name: "Cervejas", count: 6 },
];

const slot = (cat, n) => {
  const num = String(n).padStart(2, "0");
  return {
    id: `${cat.id}-${num}`, name: `${cat.name} ${num} (a preencher)`, category: cat.id,
    description: "", price: null, promotionalPrice: null, discountActive: false,
    stockManaged: false, stockQuantity: 0, available: false,
    image: `/images/${cat.id}/${cat.id}-${num}.jpg`, order: n, featured: false,
    allowedAddons: [], pending: true,
  };
};
const slots = categories.flatMap((c) => Array.from({ length: c.count }, (_, i) => slot(c, i + 1)));

// ITENS REAIS: copie o modelo, preencha e use o MESMO id da vaga para substituí-la
// (ex.: "burguer-bovino-01"), ou use um id novo (a vaga continua, apague-a depois).
// {
//   id: "basic-01-cheddar", name: "Basic 01 Cheddar", category: "burguer-bovino",
//   description: "Descrição real.", price: 15.0, promotionalPrice: null, discountActive: false,
//   stockManaged: true, stockQuantity: 20, available: true,
//   image: "/images/burguer-bovino/basic-01-cheddar.jpg", order: 1, featured: false,
//   allowedAddons: [],   // ids de itens da categoria "adicionais"
// },
const realProducts = [];

const real = new Set(realProducts.map((p) => p.id));
export const products = [...realProducts, ...slots.filter((s) => !real.has(s.id))]
  .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
