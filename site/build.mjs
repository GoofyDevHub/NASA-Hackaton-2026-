// Stage the public demo with the same relative media URLs as the local server.
import { copyFile, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCENES, SOURCES } from './scenes.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist', 'cloudflare');
const files = new Set(['site/styles.css', 'site/textures/earth.jpg', 'site/index.html']);
for (const file of await readdir(path.join(root, 'site'))) {
  if (file.endsWith('.js')) files.add('site/' + file);
}
for (const source of Object.values(SOURCES)) {
  for (const file of [source.legend, source.texture]) files.add(path.posix.join('site', file));
}
for (const scene of SCENES) {
  for (const file of [scene.image, scene.audioCrop, scene.audio?.mp3, scene.audio?.master]) {
    if (file) files.add(path.posix.join('site', file));
  }
}

await rm(output, { recursive: true, force: true });
for (const file of files) {
  const target = path.join(output, file);
  await mkdir(path.dirname(target), { recursive: true });
  await copyFile(path.join(root, file), target);
}
// Serve the current site at / too, keeping CSS, textures and script URLs relative to /site/.
const html = await readFile(path.join(root, 'site', 'index.html'), 'utf8');
await writeFile(path.join(output, 'index.html'), html.replace('<head>', '<head>\n  <base href="./site/">'));
console.log(`Prepared ${files.size + 1} public files for Cloudflare.`);
