import { readdir, readFile, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

/**
 * Build-time image optimisation.
 *
 * Keystatic writes whatever the editor uploads, which in practice has meant
 * 6000px camera JPEGs. This caps those at MAX_WIDTH and converts them to WebP,
 * then repoints the built HTML and CSS at the new files — so an oversized
 * upload cannot quietly undo the work, and nobody has to remember to resize
 * anything before uploading.
 *
 * It only ever touches `dist/`. Source files in `public/` and the paths stored
 * in the CMS are left exactly as they are.
 */

const MAX_WIDTH = 1920;
const QUALITY = 82;
const CONVERTIBLE = new Set(['.jpg', '.jpeg', '.png']);
const REWRITABLE = new Set(['.html', '.css', '.js']);

// Left as-is on purpose:
//   the social card — scrapers handle WebP poorly, and a broken preview costs
//   more than the bytes save
//   the logos — they double as the favicon, where WebP support is uneven
const KEEP_ORIGINAL = [/mandrex-og\./, /mandrex-logo/];

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const kb = (n) => `${Math.round(n / 1024)}KB`;

export default function optimizeImages() {
  return {
    name: 'mandrex:optimize-images',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = path.join(dir.pathname, 'assets');
        const files = await walk(root);

        const targets = files.filter((f) => {
          const ext = path.extname(f).toLowerCase();
          if (!CONVERTIBLE.has(ext)) return false;
          return !KEEP_ORIGINAL.some((re) => re.test(path.basename(f)));
        });

        if (!targets.length) {
          logger.info('every image is already optimised');
          return;
        }

        /** @type {Map<string, string>} old public path -> new public path */
        const renames = new Map();
        let before = 0;
        let after = 0;

        for (const file of targets) {
          const original = (await stat(file)).size;
          const image = sharp(file, { failOn: 'none' });
          const meta = await image.metadata();

          const pipeline = image.rotate();
          if (meta.width && meta.width > MAX_WIDTH) {
            pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
          }

          const webpPath = file.replace(/\.(jpe?g|png)$/i, '.webp');
          await pipeline.webp({ quality: QUALITY, effort: 6 }).toFile(webpPath);

          const converted = (await stat(webpPath)).size;
          before += original;
          after += converted;

          // the built pages still reference the original name
          const toPublic = (p) => '/' + path.relative(dir.pathname, p).split(path.sep).join('/');
          renames.set(toPublic(file), toPublic(webpPath));
          await unlink(file);

          const note = meta.width && meta.width > MAX_WIDTH ? ` (${meta.width}px → ${MAX_WIDTH}px)` : '';
          logger.info(`${path.basename(file)} ${kb(original)} → ${kb(converted)}${note}`);
        }

        // repoint the build at the converted files
        let touched = 0;
        for (const file of await walk(dir.pathname)) {
          if (!REWRITABLE.has(path.extname(file).toLowerCase())) continue;
          const source = await readFile(file, 'utf8');
          let output = source;
          for (const [from, to] of renames) output = output.split(from).join(to);
          if (output !== source) {
            await writeFile(file, output);
            touched++;
          }
        }

        const saved = before - after;
        logger.info(
          `${targets.length} image(s) converted, ${kb(before)} → ${kb(after)} ` +
            `(saved ${kb(saved)}), ${touched} file(s) repointed`,
        );
      },
    },
  };
}
