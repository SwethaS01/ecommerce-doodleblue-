# HomeHaven — Home Essentials Store

A React + Vite shopping demo for home decor, furniture, and kitchen essentials. It uses Redux Toolkit for cart and wishlist state, a limited collection from the free DummyJSON products API, add-to-cart confirmation messages, and a demo checkout that generates a printable receipt.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Notes

- The product collection is limited to 12 products across home-related categories.
- Product images come from the API; if an image fails, a HomeHaven-themed placeholder is shown.
- Checkout is a frontend demo only. It does not process real payments or collect card details. The receipt can be printed using the browser print dialog.
- API prices are displayed as approximate INR demo prices using a fixed conversion factor; they are not live exchange-rate calculations.
