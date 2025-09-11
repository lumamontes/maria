# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

| Command | Purpose |
|---------|---------|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start development server at localhost:4321 |
| `pnpm build` | Build production site to ./dist/ |
| `pnpm preview` | Preview production build locally |
| `pnpm astro ...` | Run Astro CLI commands |

## Architecture Overview

This is an Astro-based blog site with the following key integrations:

### Content Management
- **Dual Content System**: Uses both local Markdown files (`src/content/blog/`) and Contentful CMS
- **Contentful Integration**: Client configured in `src/lib/contentful.ts` with environment-specific tokens
- **Content Collections**: Defined in `src/content.config.ts` with Zod schema validation for frontmatter

### Technology Stack
- **Framework**: Astro v5 with React integration
- **Styling**: TailwindCSS v4 with Vite plugin
- **Type Safety**: TypeScript with strict configuration
- **Content**: MDX support for rich content authoring

### Key Architecture Patterns
- **File-based Routing**: Pages in `src/pages/` become routes
- **Component Organization**: Astro components in `src/components/`, layouts in `src/layouts/`
- **Asset Management**: Static assets in `public/`, processed assets in `src/assets/`
- **Environment Configuration**: Contentful credentials via environment variables

### Content Structure
- Blog posts support both local `.md/.mdx` files and Contentful entries
- Schema validation ensures consistent frontmatter: title, description, pubDate, updatedDate, heroImage
- RSS feed generation and sitemap support included

### Environment Variables
Required Contentful environment variables:
- `CONTENTFUL_SPACE_ID`
- `CONTENTFUL_PREVIEW_TOKEN` (development)
- `CONTENTFUL_DELIVERY_TOKEN` (production)