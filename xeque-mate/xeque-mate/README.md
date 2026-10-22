# Xeque-Mate Hamburgueria — Manual de manutenção

> **Administração atual:** feita editando arquivos do projeto. **Não existe painel com login nem banco de dados ainda.** O estoque NÃO baixa sozinho quando alguém pede pelo WhatsApp: você altera manualmente.

Tudo de produtos fica em **`src/data/products.js`**. Configurações da loja (WhatsApp, horários, entrega) ficam em **`src/data/config.js`**.

## 1. Abrir o projeto
Instale o [Node.js](https://nodejs.org) e o [VS Code](https://code.visualstudio.com). Abra a pasta no VS Code, abra o terminal (Terminal > Novo) e rode `npm install` (só na primeira vez).

## 2. Nome e descrição
Em `products.js`, ache o item e mude `name` e `description` (mantenha as aspas).

## 3. Preço original
Mude `price: 15.0` (use ponto, não vírgula).

## 4. Descontos
```js
price: 30.0, promotionalPrice: 24.0, discountActive: true   // liga: mostra R$30 riscado, R$24 e "20% OFF"
discountActive: false                                       // desliga: volta ao preço normal (nada é apagado)
```
Se o preço promocional for igual ou maior que o original, o site ignora o desconto.

## 5. Esgotado / indisponível
`available: false` = ESGOTADO · `available: "unavailable"` = temporariamente indisponível · `available: true` = à venda.

## 6. Estoque por quantidade
`stockManaged: true, stockQuantity: 20` — o cliente não passa de 20 no carrinho. Com `stockQuantity: 0` aparece ESGOTADO. Para repor, mude o número. Use `stockManaged: false` para não controlar quantidade.

## 7. Cadastrar produto novo
Copie o modelo comentado em `products.js` para dentro de `realProducts = [ ... ]`, com `id` único (sem espaços/acentos). Para ocupar uma das 84 vagas "a preencher", use o mesmo id dela (ex.: `"burguer-bovino-01"`). Nada de nome, preço ou ingrediente foi inventado: as vagas estão vazias até você preencher.

## 8. Adicionar foto
Coloque o arquivo (ex.: `basic-01-cheddar.jpg`, sem espaços/acentos) em `public/images/burguer-bovino/` e confira se `image: "/images/burguer-bovino/basic-01-cheddar.jpg"` é igual. Sem foto, aparece um espaço reservado.

## 9. Trocar foto
Salve a nova imagem com o **mesmo nome** (substitui) ou com nome novo e atualize `image`.

## 10. Categorias e adicionais
Categorias: lista `categories` no topo de `products.js` (id = nome da pasta de imagens). Adicionais são itens da categoria `adicionais`; para liberar num burger: `allowedAddons: ["id-do-adicional"]`.

## 11. WhatsApp
`config.js` → `whatsapp: "5575988381283"` (55 + DDD + número, só dígitos).

## 12. Testar
`npm run dev` e abra o endereço mostrado (http://localhost:5173). Teste no celular com o modo responsivo do navegador (F12).

## 13. Enviar ao GitHub
```
git add .
git commit -m "Atualiza cardápio"
git push
```
## 14. Vercel
Importe o repositório na Vercel (framework Vite, build `npm run build`, saída `dist`). A cada `git push` ela publica sozinha; veja o status em *Deployments*.

## 15. Problemas
- Foto não aparece: nome/pasta/extensão diferentes do `image` (maiúsculas importam).
- Tela branca: veja o erro no terminal (`npm run dev`) — geralmente falta vírgula ou aspas em `products.js`.
- Ao publicar, ponha `showPending: false` em `config.js` para esconder vagas sem dados.
- O vídeo está em `public/videos/abertura.mp4`, cópia idêntica ao original, sem edição.

## Futuro
A interface lê dados só de `src/data/products.js`; para criar um painel com login, basta trocar essa fonte por uma API/banco de dados.
