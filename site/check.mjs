// CAT01 check: node site/check.mjs
// Every scene resolves to local media whose SHA-256 matches the approved manifests.
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCENES, PLAYLIST, SOURCES } from './scenes.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const sha = async rel => createHash('sha256').update(await readFile(path.join(HERE, rel))).digest('hex');
const json = async rel => JSON.parse(await readFile(path.join(HERE, rel), 'utf8'));
const images = await json('../assets/images/sources.json'), audio = await json('../assets/audio/sha256.json');
let failed = 0;
const check = (ok, msg) => { if (!ok) failed++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${msg}`); };

check(SCENES.length === 9, 'nine scenes');
check(PLAYLIST.length === 6, 'six playable scenes');
check(SCENES.filter(s => s.illustrative).map(s => s.id).join() === 'antarctica-lightning', 'only the polar wind is flagged illustrative');
for (const s of SCENES) {
  const name = path.basename(s.image);
  check(await sha(s.image) === images.images[name]?.sha256, `${s.id}: image ${name}`);
  if (s.phenomenon === 'ocean' && s.audio) {
    const crop = images.activeOceanAudioCrops[name];
    check(!!s.audioCrop && await sha(s.audioCrop) === crop.fileSha256, `${s.id}: exact audio crop ${crop.file}`);
  }
  if (s.audio) for (const [file, want] of [[s.audio.mp3, s.audio.mp3Sha256], [s.audio.master, s.audio.wavSha256]]) {
    const got = await sha(file), approved = audio[path.basename(file)];
    check(got === want && got === approved, `${s.id}: ${path.basename(file)}`);
  }
}
for (const [k, src] of Object.entries(SOURCES)) {
  const name = path.basename(src.texture);
  check(await sha(src.texture) === images.originals[name].sha256, `${k}: NASA original ${name}`);
}
console.log(failed ? `\n${failed} check(s) failed` : '\nAll media checks passed');
process.exit(failed ? 1 : 0);
