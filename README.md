# Ornativa — Jewellery showcase

**Author:** DK Mendiratta

Unofficial Ornativa jewellery showcase + concierge demo: catalogue and product-style pages. Demo data only.

Neighbour repo: [ecommerce-business-webapp-chatbot](https://github.com/d33pm3/ecommerce-business-webapp-chatbot) is a separate catalogue + deterministic concierge prototype. This repo is the Ornativa jewellery showcase.

## This is / this is not

**This is** an unofficial Ornativa jewellery **showcase + concierge** demo (catalogue and product-style pages).
**This is** a local React / TanStack app.
**This is** an evaluation UI with demo catalogue data.
**This is not** a live store, cart, or payment system.
**This is not** official Ornativa or marketplace software.
**This is not** the [ecommerce-business-webapp-chatbot](https://github.com/d33pm3/ecommerce-business-webapp-chatbot) prototype (separate catalogue + concierge).
**This is not** a multi-agent runtime — `AGENTS.md` is Lovable editor notes.
**This is not** a complete `src/` tree on `main` — the runnable source is in `Codebase.zip`.

## Where the source is

The **complete application source** is in [`Codebase.zip`](Codebase.zip), under:

- `New folder/src/`
- `New folder/public/`

There is no runnable `src/` on `main`. Extract the zip before `npm run dev`.

## Run the eval build

Requires Node.js 18+ and npm or Bun.

```bash
git clone https://github.com/d33pm3/jewelry-product-showcase.git
cd jewelry-product-showcase
unzip -o Codebase.zip
cp -a "New folder/src/." src/
cp -a "New folder/public/." public/
npm i
npm run dev
```

After extract, `src/routes/catalogue.tsx` must exist. If it does not, the zip did not unpack.

```bash
npm run build
```

## What is not deployed

- There is no hosted URL, GitHub Pages site, or live storefront.
- There is no cart, checkout, or payment API.
- Catalogue items are demo data, not inventory.
- Do not treat prices or product pages as an offer for sale.

## License

MIT. See `LICENSE`.

You may use this code; this is not a live store and not a checkout.
