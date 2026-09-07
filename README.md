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
**This is** a self-contained repository with the runnable source tracked under `src/` and `public/`.

## Demo data

All catalogue items, prices, stock states, consultation details, and concierge responses are fictional demo fixtures. They must not be treated as real inventory, customer, or operational information.

## Run the eval build

Requires Bun 1.2.23.

```bash
git clone https://github.com/d33pm3/jewelry-product-showcase.git
cd jewelry-product-showcase
bun install --frozen-lockfile
bun run dev
```

Validate the same baseline used by CI:

```bash
bun run lint
bun run test
bun run build
```

## What is not deployed

- There is no hosted URL, GitHub Pages site, or live storefront.
- There is no cart, checkout, or payment API.
- Catalogue items are demo data, not inventory.
- Do not treat prices or product pages as an offer for sale.

## License

MIT. See `LICENSE`.

You may use this code; this is not a live store and not a checkout.
