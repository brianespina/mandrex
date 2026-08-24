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

// Service entry slugs (CMS keys) don't match the page routes under src/pages/services/
const serviceUrls: Record<string, string> = {
  admin: '/services/administrative-support',
  bookkeeping: '/services/bookkeeping',
  customer: '/services/customer-support',
  executive: '/services/executive-assistance',
};

export function getServiceUrl(key: string): string {
  return serviceUrls[key] ?? `/services/${key}`;
}

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

// `.all()` returns entries in slug order, which is not the order they should
// appear on the site. Sort centrally so every consumer agrees.
const byNumber = (a: string | number | null, b: string | number | null) =>
  (Number(a ?? Infinity) || Infinity) - (Number(b ?? Infinity) || Infinity);

export async function getAllServices() {
  const services = await reader.collections.services.all();
  return services.sort((a, b) => byNumber(a.entry.index, b.entry.index));
}

export async function getAllTestimonials() {
  return reader.collections.testimonials.all();
}

// Order comes from the drag-reorderable "Sector order" list in Site Settings,
// since a collection cannot be reordered in the CMS. Anything missing from
// that list still renders, alphabetically, after everything that is listed.
export async function getAllIndustries() {
  const [industries, site] = await Promise.all([
    reader.collections.industries.all(),
    reader.singletons.site.read(),
  ]);
  const rank = new Map(
    (site?.sectorOrder ?? []).filter(Boolean).map((slug, i) => [slug, i]),
  );
  return industries.sort((a, b) => {
    const ra = rank.get(a.slug) ?? Infinity;
    const rb = rank.get(b.slug) ?? Infinity;
    return ra - rb || a.entry.name.localeCompare(b.entry.name);
  });
}

export async function getAllReusableSections() {
  return reader.collections.reusableSections.all();
}

export async function getReusableSection(slug: string) {
  return reader.collections.reusableSections.read(slug);
}
