# Solbjor.github.io

Personal site of Andrew Solbjor — https://solbjor.github.io/

Built with React + TypeScript + Vite, deployed to GitHub Pages via GitHub Actions on every push to `master`.

## Develop

```sh
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
npm run preview  # serve the production build
```

## Editing content

All text (experience, projects, education, links) lives in [`src/data/content.ts`](src/data/content.ts).

## Layout

- `src/components/` — UI components
- `src/data/content.ts` — site content
- `public/` — static files served as-is (images, favicon)
- `docs/legacy-design.md` — notes on the original site's design, kept for reuse
