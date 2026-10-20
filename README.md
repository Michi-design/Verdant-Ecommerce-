# VERDANT LIVING storefront

A responsive React and Vite storefront prototype using a locally defined demo catalog. Product, cart, wishlist, checkout, and contact interactions run in the browser; no orders, payments, email subscriptions, or contact messages are sent.

## Run locally

Requirements: Node.js 20 or newer.

```sh
npm install
npm run dev
```

Create a production build with `npm run build`, or preview it locally with `npm run preview`.

## Publish on GitHub Pages

1. Create a GitHub repository and upload this project, including `package-lock.json` and `.github/workflows/static.yml`. If the repository already contains a GitHub-created `static.yml`, replace it with this project's version.
2. Push the project to the repository's `main` branch. The GitHub Actions workflow installs dependencies, builds the site, and deploys the `dist` folder.
3. In the repository, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.
4. After the workflow completes, open the Pages URL shown in its deployment job. Project sites use the repository path, which the build configures automatically.

The app uses hash-based URLs (for example, `/#/shop`) so client-side pages also work when refreshed on GitHub Pages. If the repository uses a branch other than `main`, update the branch in `.github/workflows/static.yml`. A custom domain can be configured in GitHub Pages settings.

GitHub Pages hosts static files only. This storefront still uses demo products and browser-local cart/wishlist data; it does not process orders, payments, newsletter signups, or contact messages. Connect a real commerce backend before accepting customers or payments.

## Project structure

- `src/data/config.js` — demo product catalog, category data, configurable currency, and image URL helper.
- `src/services/productService.js` — demo product service methods (`getProducts`, `getProductBySlug`, `getCategories`, `getFeaturedProducts`, `searchProducts`, `getRelatedProducts`).
- `src/context/StoreContext.jsx` — browser-local cart and wishlist state.
- `src/App.jsx` — routes, shared navigation, storefront pages, user interactions, and route-aware page titles and descriptions.
- `vite.config.js` — Vite build base path for local development and GitHub Pages project sites.
- `.github/workflows/static.yml` — build and deploy the static site to GitHub Pages.
- `src/styles.css` — brand tokens, page styling, responsive layouts, and reduced-motion support.

The demo catalog and state are not authoritative store data. Cart and wishlist data are browser-specific and stored in local storage when the browser permits it. Prices use `VITE_CURRENCY` (defaults to `USD`); product inventory and currency have not been confirmed for a real store.

## WooCommerce integration plan

1. Confirm the WordPress/WooCommerce URL, market, currency, catalog, policies, and supported payment gateways.
2. Replace the demo implementation behind `src/services/productService.js` with a WooCommerce Store API adapter and map responses to the existing product model. Add loading, empty, and visible error states when connecting remote data.
3. Verify the Store API's current authentication, nonce, session/cart, checkout, and gateway support for the target WooCommerce setup before implementing cart or checkout behavior. If a gateway does not support headless checkout, hand off to the native WooCommerce checkout.
4. Keep private WooCommerce REST API credentials and payment secrets on a secure server-side integration only. The Vite client must contain public configuration only; `.env.example` contains placeholders, not credentials.
5. Replace browser-local cart behavior with the supported WooCommerce cart/session flow and use WooCommerce for real order creation, taxes, shipping, and payment.
6. Replace the clearly marked policy and business-contact placeholders with verified store-owner content and appropriate legal review before launch.

Do not deploy this demo checkout as a payment or order flow.
