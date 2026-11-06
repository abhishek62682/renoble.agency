# renoble.agency

Website for renoble.agency, a web development agency based in Navi Mumbai, Maharashtra, India.

Static site, no build step: open `public/index.html` or run `npm start`.

- `public/` – everything that gets deployed (Cloudflare Worker assets directory)
  - `index.html` – home page (project cards link out to each client's live site)
  - `privacy-policy.html`, `terms.html`, `404.html`
  - `assets/` – css, js, images, video
- `src/worker.js` – the Cloudflare Worker (serves `/api/geo`, falls through to `public/` for everything else)
