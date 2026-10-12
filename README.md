# Maria Clara Prudêncio

![Maria Clara Prudêncio homepage](assets/home.png)

Personal portfolio and publishing site for **Maria Clara Prudêncio**, a journalist based in Macapá, Amapá. The site presents her work in journalism, freelance coverage, publications, photography, and contact channels, with content managed through Contentful.

Live site: [mariaclaraprudencio.netlify.app](https://mariaclaraprudencio.netlify.app/)

## Features

- Responsive portfolio homepage with hero presentation and featured work
- Blog powered by Contentful entries and rich text
- Publications index with category filters
- Contentful-backed photo gallery with detail pages
- Contact form submitted through a server endpoint and Resend
- RSS feed, sitemap, Open Graph metadata, and optimized image formats
- React islands for interactive UI such as the contact form, galleries, and marquees

## Tech Stack

- Astro 5 with the React integration
- TypeScript
- Tailwind CSS 4 through the Vite plugin
- Contentful for blog, publication, gallery, experience, and about content
- Netlify adapter for deployment
- MDX, RSS, sitemap, Sharp, and Resend integrations

## Requirements

- Node.js with Corepack enabled
- pnpm
- Contentful credentials for pages that query CMS content
- Resend API key for the contact form endpoint

## Getting Started

```sh
pnpm install
```

Create a local `.env` file with the credentials used by the application:

```env
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_PREVIEW_TOKEN=your_preview_token
CONTENTFUL_DELIVERY_TOKEN=your_delivery_token
RESEND_API_KEY=your_resend_api_key
```

Start the development server:

```sh
pnpm dev
```

The site is available at `http://localhost:4321`.

## Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the local Astro development server |
| `pnpm build` | Build the production site into `dist/` |
| `pnpm preview` | Preview the production build locally |
| `pnpm astro ...` | Run an Astro CLI command |

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Portfolio homepage |
| `/about` | About page populated from Contentful |
| `/blog` | Blog index |
| `/blog/[slug]` | Individual blog post |
| `/publications` | Filterable publication list |
| `/gallery` | Photo gallery |
| `/gallery/p/[slug]` | Gallery image detail page |
| `/contato` | Contact form |
| `/rss.xml` | RSS feed |

## Project Structure

```text
src/
├── components/   Astro and React UI components
├── layouts/      Shared page and blog layouts
├── lib/          Contentful, image, link preview, and email helpers
├── pages/        File-based routes and API endpoints
├── assets/       Processed local assets
└── consts.ts     Site title, description, and social links
public/           Static fonts, metadata assets, and robots.txt
astro.config.mjs  Astro, Netlify, sitemap, React, and Tailwind configuration
```

Contentful is queried at build time for the main content pages. In development, the preview API is selected; production builds use the delivery API.

## License

No license file is currently included in this repository.
