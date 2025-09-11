import * as contentful from "contentful";
import type { EntryFieldTypes } from "contentful";

export interface BlogPost {
  contentTypeId: "blogPost",
  fields: {
    title: EntryFieldTypes.Text
    content: EntryFieldTypes.RichText,
    date: EntryFieldTypes.Date,
    description: EntryFieldTypes.Text,
    slug: EntryFieldTypes.Text,
    banner: EntryFieldTypes.AssetLink,
    author: EntryFieldTypes.EntryLink<'author'>
  }
}

// Publicações (publicacoes)
export interface Publication {
  contentTypeId: "publicacoes",
  fields: {
    title: EntryFieldTypes.Symbol,
    banner: EntryFieldTypes.AssetLink,
    description: EntryFieldTypes.RichText,
    links: EntryFieldTypes.Symbol,
    tags?: EntryFieldTypes.EntryLink<'tags'> | EntryFieldTypes.Array<EntryFieldTypes.EntryLink<'tags'>>
  }
}

// Tags (tags)
export interface TagEntry {
  contentTypeId: "tags",
  fields: {
    name: EntryFieldTypes.Symbol,
    description: EntryFieldTypes.Text
  }
}

// Gallery (gallery)
export interface GalleryEntry {
  contentTypeId: "gallery",
  fields: {
    photos: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>,
    tags: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<'tags'>>
  }
}

// About (about)
export interface AboutEntry {
  contentTypeId: "about",
  fields: {
    banner: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>,
    title: EntryFieldTypes.Symbol,
    description: EntryFieldTypes.RichText
  }
}

// Experiences (experiences)
export interface ExperienceEntry {
  contentTypeId: "experiences",
  fields: {
    img: EntryFieldTypes.AssetLink,
    title: EntryFieldTypes.Symbol,
    description: EntryFieldTypes.RichText
  }
}

export const contentfulClient = contentful.createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.DEV
    ? import.meta.env.CONTENTFUL_PREVIEW_TOKEN
    : import.meta.env.CONTENTFUL_DELIVERY_TOKEN,
  host: import.meta.env.DEV ? "preview.contentful.com" : "cdn.contentful.com",
});