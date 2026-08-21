import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

export const reader = createReader(process.cwd(), keystaticConfig);

export type SiteSettings = Awaited<ReturnType<typeof reader.singletons.site.read>>;
export type Page = Awaited<ReturnType<typeof reader.collections.pages.read>>;
export type Service = Awaited<ReturnType<typeof reader.collections.services.read>>;
export type Testimonial = Awaited<ReturnType<typeof reader.collections.testimonials.read>>;
export type Industry = Awaited<ReturnType<typeof reader.collections.industries.read>>;
export type ReusableSection = Awaited<ReturnType<typeof reader.collections.reusableSections.read>>;
export type PageSection = NonNullable<Page>['sections'][number];

export function getImageSrc(image?: string | { src: string } | null): string {
  if (!image) return '';
  const src = typeof image === 'string' ? image : image.src;
  if (!src) return '';
  if (src.startsWith('http') || src.startsWith('/')) return src;
  return `/assets/${src}`;
}

export async function getSite() {
  const site = await reader.singletons.site.read();
  if (!site) throw new Error('Site settings not found');
  return site;
}

export async function getPage(slug: string) {
  return reader.collections.pages.read(slug);
}

export async function getAllPages() {
  return reader.collections.pages.all();
}

export async function getService(key: string) {
  return reader.collections.services.read(key);
}

export async function getAllServices() {
  return reader.collections.services.all();
}

export async function getAllTestimonials() {
  return reader.collections.testimonials.all();
}

export async function getAllIndustries() {
  return reader.collections.industries.all();
}

export async function getAllReusableSections() {
  return reader.collections.reusableSections.all();
}

export async function getReusableSection(slug: string) {
  return reader.collections.reusableSections.read(slug);
}
