# Cardápio Cumbuco Beach (página separada)

Página só do cardápio da Barraca Cumbuco Beach. É um site estático: basta hospedar a pasta inteira.
Não tem carrinho nem pedido: é para ler, baixar o PDF e compartilhar.

## Arquivos

| Arquivo | Para que serve |
| --- | --- |
| `index.html` | A página |
| `css/cardapio.css` | Aparência e efeitos |
| `js/dados.js` | **Todos os itens, descrições e preços** (e as traduções) |
| `js/cardapio.js` | Idiomas, busca, QR Code, efeitos |
| `js/qr.js` | Gerador de QR Code |
| `cardapio.pdf` | PDF do botão "Baixar cardápio agora" |
| `img/`, `fonts/` | Logo, ícones do cardápio, fotos e fontes |

## Trocar item ou preço

Abra `js/dados.js`. Cada linha é um item: `["NOME", "R$ 00,00", "descrição"]`.
Mude só o texto entre aspas e salve. Os textos estão iguais aos do cardápio em PDF.

Se o nome de um item mudar, ajuste também a tradução dele em `tr.en.itens` e `tr.es.itens`
(a chave é `categoria:posição`, começando em 0, por exemplo `peixes:4`).

Quando o cardápio impresso mudar, troque também o arquivo `cardapio.pdf` (mesmo nome).

## Fotos

Ficam em `img/fotos/`. Para trocar, salve a foto nova com o mesmo nome (JPG, cerca de 600 x 750 px).
Quais fotos aparecem em cada categoria está em `fotos:[...]`, dentro de `js/dados.js`.
As fotos atuais são recortes de publicações do Instagram da barraca (imagens ilustrativas).

## Idiomas

Português, inglês e espanhol. Em inglês e espanhol, o nome e a descrição traduzidos ficam em
destaque e o original em português aparece menor logo abaixo. Marcas (Heineken, Tanqueray,
whiskies) não têm tradução.

Para abrir direto num idioma: `.../?lang=en` ou `.../?lang=es`.
Para abrir direto numa categoria: `.../#peixes`, `.../#bebidas`, `.../#whiskies`.

## QR Code e compartilhar

Usam o endereço em que a página estiver aberta. Depois de publicada, o QR Code já aponta para o
link certo. Se quiser fixar um endereço, preencha `url` no começo de `js/cardapio.js`.

## Publicar no GitHub Pages

### 1. Link de teste (não mexe no site de reservas)

1. No GitHub, na mesma conta do site de reservas, crie um repositório novo e público chamado `cardapio`.
2. Na página do repositório, clique em **Add file > Upload files**.
3. Arraste para lá tudo o que está dentro desta pasta (`index.html`, `cardapio.pdf` e as pastas
   `css`, `js`, `img`, `fonts`). O `index.html` precisa ficar na raiz do repositório.
4. Clique em **Commit changes**.
5. Vá em **Settings > Pages**. Em **Build and deployment**, em **Source**, escolha
   **Deploy from a branch**. Em **Branch**, escolha `main` e `/ (root)` e clique em **Save**.
6. Aguarde um ou dois minutos e recarregue a página. O endereço aparece no alto de
   **Settings > Pages**, no formato `https://SUA-CONTA.github.io/cardapio/`.

### 2. Transformar em subdomínio (cardapio.seudominio.com.br)

1. No mesmo repositório, em **Settings > Pages**, no campo **Custom domain**, digite
   `cardapio.seudominio.com.br` e clique em **Save**. O GitHub cria um arquivo `CNAME` no repositório.
2. No painel onde o DNS do domínio é gerenciado, crie um registro:
   - Tipo: `CNAME`
   - Nome (host): `cardapio`
   - Valor (destino): `SUA-CONTA.github.io` (sem o nome do repositório)
3. A propagação do DNS pode levar até 24 horas.
4. Quando o GitHub liberar, marque **Enforce HTTPS** em **Settings > Pages**.

Faça nessa ordem: primeiro o domínio no GitHub, depois o registro no DNS.

Para atualizar o cardápio depois, basta enviar os arquivos alterados de novo pelo **Upload files**.

## Observações

- A etiqueta "Pratos para 2 pessoas" (Peixes, Frutos do mar, Carnes e aves) vem do ícone de duas
  pessoas que aparece no cardápio impresso ao lado dessas categorias. Se não for esse o sentido,
  apague `duas:true` dessas categorias em `js/dados.js`.
- As traduções para inglês e espanhol foram feitas para esta página. Vale uma revisão antes de publicar.
